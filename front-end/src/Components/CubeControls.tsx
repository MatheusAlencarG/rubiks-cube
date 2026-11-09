import React, { useContext, useEffect, useRef, useState } from 'react';
import { buttonClass } from './controlStyles';
import { Context as LanguageContext } from '../Contexts/GeneralConfigContext/Context';
import { useCube } from '../Contexts/RubicksCubeContext/CreateRubicksCube3x3Context';
import { useCubeSession } from '../Contexts/CubeSessionContext';
import { useAuth } from '../Contexts/AuthContext';
import { usePrivateCollection } from '../api/hooks';
import { api, writeDocument } from '../api/client';
import type { Attempt, Preset, SavedGame } from '../api/types';
import SavedGames from './SavedGames';
import PresetEditor, { PresetInput } from './PresetEditor';
import { DEFAULT_APPEARANCE } from '../cube/session';

export default function CubeControls() {
  const { language, preferences } = useContext(LanguageContext);
  const {
    rubicksCube3x3: { cube },
  } = useCube();
  const { session, busy: turning, error: cubeError, newGame, loadGame, refresh } = useCubeSession();
  const { user, token } = useAuth();

  const games = usePrivateCollection<SavedGame>('saved-games', 'sort[0]=savedAt:desc');
  const presets = usePrivateCollection<Preset>('cube-presets', 'sort[0]=name:asc');
  const attempts = usePrivateCollection<Attempt>('solve-attempts', 'sort[0]=completedAt:desc');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const tokenRef = useRef(token);

  const en = language.currentLanguage === 'en-us';
  const disabled = turning || busy || preferences.loading;
  const activePreset = preferences.settings?.activePreset;
  const canRecordAttempt =
    !disabled && session.moves.length > 0 && session.logical.isSolved() && !session.attemptRecorded;

  useEffect(() => {
    tokenRef.current = token;

    return () => {
      tokenRef.current = null;
    };
  }, [token]);

  async function run(action: () => Promise<void>) {
    const requestToken = token;
    if (!requestToken || disabled) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      await action();
      if (requestToken === tokenRef.current) setMessage(en ? 'Saved.' : 'Salvo.');
    } catch (failure) {
      if (requestToken === tokenRef.current) setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function startNewGame() {
    newGame();
    setMessage('');
    setError('');
  }

  async function saveGame() {
    const payload = session.payload(cube, session.name || (en ? 'My game' : 'Minha partida'));
    const saved = await writeDocument<SavedGame>(
      'saved-games',
      token!,
      payload,
      session.documentId
    );

    session.documentId = saved.documentId;
    session.name = saved.name;
    await games.mutate();
    refresh();
  }

  function resumeGame(game: SavedGame) {
    try {
      loadGame(game);
      setMessage(en ? 'Game resumed.' : 'Partida retomada.');
      setError('');
    } catch (failure) {
      setError((failure as Error).message);
    }
  }

  function deleteGame(game: SavedGame) {
    void run(async () => {
      await api('/saved-games/' + game.documentId, { token, method: 'DELETE' });

      if (session.documentId === game.documentId) session.documentId = undefined;
      await games.mutate();
    });
  }

  async function complete() {
    const payload = session.payload(cube, '');
    await writeDocument<Attempt>('solve-attempts', token!, {
      cubeType: payload.cubeType,
      engineVersion: payload.engineVersion,
      initialState: payload.initialState,
      moves: payload.moves,
      appearanceSnapshot: payload.appearanceSnapshot,
      preset: payload.preset,
      durationMs: Math.max(1, payload.elapsedMs),
      completedAt: new Date().toISOString(),
    });

    session.attemptRecorded = true;
    await attempts.mutate();
    refresh();
  }

  function deleteAttempt(documentId: string) {
    void run(async () => {
      await api(`/solve-attempts/${documentId}`, { token, method: 'DELETE' });
      await attempts.mutate();
    });
  }

  function savePreset({ name, appearance, update }: PresetInput) {
    void run(async () => {
      const preset = await writeDocument<Preset>(
        'cube-presets',
        token!,
        { name, appearance },
        update ? activePreset?.documentId : undefined
      );

      if (tokenRef.current !== token) return;
      await preferences.save({ activePreset: preset.documentId });

      if (tokenRef.current !== token) return;
      newGame(preset.appearance, preset.documentId);
      await presets.mutate();
    });
  }

  function selectPreset(preset: Preset | undefined | null) {
    void run(async () => {
      await preferences.save({ activePreset: preset?.documentId ?? null });

      if (tokenRef.current === token) {
        newGame(preset?.appearance ?? DEFAULT_APPEARANCE, preset?.documentId ?? null);
      }
    });
  }

  function deletePreset() {
    void run(async () => {
      if (!activePreset) return;

      await api('/cube-presets/' + activePreset.documentId, { token, method: 'DELETE' });

      if (session.preset === activePreset.documentId) session.preset = null;
      await preferences.save({ activePreset: null });
      await presets.mutate();
    });
  }

  function reloadCollections() {
    void games.mutate();
    void presets.mutate();
    void attempts.mutate();
  }

  return (
    <section
      className="relative z-[2] box-border w-full px-3 pt-2 text-sm"
      aria-label={en ? 'Game controls' : 'Controles da partida'}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button className={buttonClass} disabled={disabled} onClick={startNewGame}>
          {en ? 'New game' : 'Nova partida'}
        </button>
        {user && (
          <button className={buttonClass} disabled={disabled} onClick={() => void run(saveGame)}>
            {en ? 'Save game' : 'Salvar partida'}
          </button>
        )}
        <span aria-live="polite">
          {session.moves.length} {en ? 'moves' : 'movimentos'}
        </span>
        <details className="group">
          <summary className={buttonClass}>
            {en ? 'Games and appearance' : 'Partidas e aparência'}
          </summary>
          <div className="absolute left-2 right-2 top-full z-10 box-border max-h-[48vh] overflow-auto rounded-md border border-solid border-accent bg-surface p-4 text-ink shadow-xl">
            {!user ? (
              <p>
                {en
                  ? 'Sign in through settings to save games and presets.'
                  : 'Entre pela engrenagem de configurações para salvar partidas e presets.'}
              </p>
            ) : (
              <>
                <SavedGames
                  en={en}
                  games={games.data}
                  loading={games.isLoading}
                  disabled={disabled}
                  onResume={resumeGame}
                  onDelete={deleteGame}
                />
                <PresetEditor
                  key={`${session.preset}-${session.appearance.widthPx}`}
                  en={en}
                  appearance={session.appearance}
                  presets={presets.data}
                  activePreset={activePreset}
                  disabled={disabled}
                  onSave={savePreset}
                  onSelect={selectPreset}
                  onDelete={deletePreset}
                />
                <h3>{en ? 'Completed attempts' : 'Tentativas concluídas'}</h3>
                <button
                  className={buttonClass}
                  disabled={!canRecordAttempt}
                  onClick={() => void run(complete)}
                >
                  {en ? 'Record solved attempt' : 'Registrar tentativa resolvida'}
                </button>
                {attempts.data?.map(attempt => (
                  <p key={attempt.documentId}>
                    {(attempt.durationMs / 1000).toFixed(2)}s ·{' '}
                    {new Date(attempt.completedAt).toLocaleString(en ? 'en-US' : 'pt-BR')}{' '}
                    <button
                      className={buttonClass}
                      disabled={disabled}
                      onClick={() => deleteAttempt(attempt.documentId)}
                    >
                      {en ? 'Delete attempt' : 'Excluir tentativa'}
                    </button>
                  </p>
                ))}
                {(games.error || presets.error || attempts.error) && (
                  <div role="alert">
                    <p>
                      {en ? 'Unable to load your data.' : 'Não foi possível carregar seus dados.'}
                    </p>
                    <button className={buttonClass} onClick={reloadCollections}>
                      {en ? 'Try again' : 'Tentar novamente'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </details>
      </div>
      {(error || cubeError) && (
        <p role="alert" className="text-center">
          {error || cubeError}
        </p>
      )}
      {message && user && (
        <p role="status" className="m-1 text-center">
          {message}
        </p>
      )}
    </section>
  );
}
