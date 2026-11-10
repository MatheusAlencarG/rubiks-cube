import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSWRConfig } from 'swr';
import {
  buttonClass,
  compactButtonClass,
  primaryButtonClass,
} from '../../../shared/ui/controlStyles';
import { PreferencesContext } from '../../preferences/PreferencesContext';
import { useCube } from '../state/CubeContext';
import { isLocalCubeTest, useCubeSession } from '../state/CubeSessionContext';
import { useAuth } from '../../account/AuthProvider';
import { usePrivateCollection, usePrivatePage } from '../../account/usePrivateCollections';
import { api, writeDocument } from '../../../shared/api/strapiClient';
import type { Attempt, Preset, SavedGame } from '../model/cubeTypes';
import CompletedAttempts from './CompletedAttempts';
import GameNotice, { TimedGameNotice } from './GameNotice';
import GameTimer from './GameTimer';
import SavedGames from './SavedGames';
import PresetEditor, { PresetInput } from './PresetEditor';
import { countManualMoves, DEFAULT_APPEARANCE } from '../model/CubeSession';

const pageSize = 5;
const noticeDurationMs = {
  saved: 3000,
  resumed: 4000,
  paused: 5000,
  blocked: 6000,
  autoSolved: 8000,
  error: 10000,
};

interface ActionFeedback {
  message: string;
  tone: 'info' | 'error';
  durationMs: number;
}

export default function CubeControls() {
  const { language, preferences } = useContext(PreferencesContext);
  const {
    rubiksCube3x3: { cube },
  } = useCube();
  const {
    session,
    busy: turning,
    error: cubeError,
    pauseBlockCount,
    newGame,
    solveCube,
    solveCubeForTesting,
    togglePause,
    loadGame,
    refresh,
  } = useCubeSession();
  const { user, token } = useAuth();
  const { mutate: mutateCache } = useSWRConfig();

  const [gamesPage, setGamesPage] = useState(1);
  const [attemptsPage, setAttemptsPage] = useState(1);
  const games = usePrivatePage<SavedGame>(
    'saved-games',
    gamesPage,
    pageSize,
    'sort[0]=savedAt:desc&sort[1]=id:desc'
  );
  const presets = usePrivateCollection<Preset>('cube-presets', 'sort[0]=name:asc');
  const attempts = usePrivatePage<Attempt>(
    'solve-attempts',
    attemptsPage,
    pageSize,
    'sort[0]=completedAt:desc&sort[1]=id:desc'
  );
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedback>();
  const tokenRef = useRef(token);
  const panelRef = useRef<HTMLDetailsElement>(null);

  const en = language.currentLanguage === 'en-us';
  const disabled = turning || busy || preferences.loading;
  const cubeDisabled = disabled || session.paused;
  const activePreset = preferences.settings?.activePreset;
  const moveCount = countManualMoves(session.moves);
  const lastAutoSolve = session.lastAutoSolve;
  const pauseBlocked = pauseBlockCount > 0;
  const isSolved = session.logical.isSolved();
  const canRecordAttempt =
    !cubeDisabled && session.hasRankedStart && session.finished && !session.attemptRecorded;
  const gamesPageCount = games.data?.meta.pagination.pageCount;
  const attemptsPageCount = attempts.data?.meta.pagination.pageCount;

  useEffect(() => {
    if (gamesPageCount !== undefined) {
      setGamesPage(page => Math.min(page, Math.max(1, gamesPageCount)));
    }
  }, [gamesPageCount]);

  useEffect(() => {
    if (attemptsPageCount !== undefined) {
      setAttemptsPage(page => Math.min(page, Math.max(1, attemptsPageCount)));
    }
  }, [attemptsPageCount]);

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      const panel = panelRef.current;
      if (panel?.open && event.target instanceof Node && !panel.contains(event.target)) {
        panel.open = false;
      }
    }

    document.addEventListener('pointerdown', closeOutside, true);
    return () => document.removeEventListener('pointerdown', closeOutside, true);
  }, []);

  useEffect(() => {
    tokenRef.current = token;

    return () => {
      tokenRef.current = null;
    };
  }, [token]);

  async function run(action: () => Promise<void>) {
    const requestToken = token;
    if (!requestToken || disabled) return false;

    setBusy(true);
    setFeedback(undefined);

    try {
      await action();
      if (requestToken !== tokenRef.current) return false;

      setFeedback({
        message: en ? 'Saved.' : 'Salvo.',
        tone: 'info',
        durationMs: noticeDurationMs.saved,
      });
      return true;
    } catch (failure) {
      if (requestToken === tokenRef.current) showActionError(failure);
      return false;
    } finally {
      setBusy(false);
    }
  }

  function startNewGame() {
    newGame({ scramble: true });
    setFeedback(undefined);
  }

  function showActionError(failure: unknown) {
    setFeedback({
      message: (failure as Error).message,
      tone: 'error',
      durationMs: noticeDurationMs.error,
    });
  }

  async function saveGame() {
    const payload = session.payload(cube, session.name || (en ? 'My game' : 'Minha partida'));
    const { name, ...progress } = payload;
    const saved = await writeDocument<SavedGame>(
      'saved-games',
      token!,
      session.documentId ? progress : { ...progress, name },
      session.documentId
    );

    session.documentId = saved.documentId;
    session.name = saved.name;
    if (gamesPage === 1) await games.mutate();
    else setGamesPage(1);
    refresh();
  }

  function renameGame(game: SavedGame, name: string) {
    return run(async () => {
      const updated = await writeDocument<SavedGame>(
        'saved-games',
        token!,
        { name },
        game.documentId
      );
      if (tokenRef.current !== token) return;

      if (session.documentId === updated.documentId) session.name = updated.name;
      await games.mutate();
    });
  }

  function resumeGame(game: SavedGame) {
    try {
      loadGame(game);
      setFeedback({
        message: en ? 'Game resumed.' : 'Partida retomada.',
        tone: 'info',
        durationMs: noticeDurationMs.resumed,
      });
    } catch (failure) {
      showActionError(failure);
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
    const resource = session.devSolved ? 'solve-attempts/dev' : 'solve-attempts';
    await writeDocument<Attempt>(resource, token!, {
      cubeType: payload.cubeType,
      engineVersion: payload.engineVersion,
      initialState: payload.initialState,
      scramble: payload.scramble,
      moves: payload.moves,
      appearanceSnapshot: payload.appearanceSnapshot,
      preset: payload.preset,
      durationMs: Math.max(1, payload.elapsedMs),
      completedAt: new Date().toISOString(),
    });

    session.attemptRecorded = true;
    void mutateCache('/ranking', undefined, { revalidate: false });
    if (attemptsPage === 1) await attempts.mutate();
    else setAttemptsPage(1);
    refresh();
  }

  function recordAttempt() {
    if (canRecordAttempt) void run(complete);
  }

  function startDevSolve() {
    if (solveCubeForTesting() && user) void run(complete);
  }

  function deleteAttempt(documentId: string) {
    void run(async () => {
      await api(`/solve-attempts/${documentId}`, { token, method: 'DELETE' });
      void mutateCache('/ranking', undefined, { revalidate: false });
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
      newGame({ appearance: preset.appearance, preset: preset.documentId });
      await presets.mutate();
    });
  }

  function selectPreset(preset: Preset | undefined | null) {
    void run(async () => {
      await preferences.save({ activePreset: preset?.documentId ?? null });

      if (tokenRef.current === token) {
        newGame({
          appearance: preset?.appearance ?? DEFAULT_APPEARANCE,
          preset: preset?.documentId ?? null,
        });
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
      data-cube-controls
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button className={primaryButtonClass} disabled={disabled} onClick={startNewGame}>
          {en ? 'New game' : 'Nova partida'}
        </button>
        <button
          type="button"
          className={`${buttonClass} aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
          disabled={disabled || (!session.paused && isSolved)}
          aria-disabled={session.paused || undefined}
          onClick={solveCube}
        >
          {en ? 'Solve cube' : 'Resolver cubo'}
        </button>
        {isLocalCubeTest() && (
          <button
            type="button"
            className={buttonClass}
            disabled={cubeDisabled || isSolved || !session.hasRankedStart || Boolean(lastAutoSolve)}
            onClick={startDevSolve}
          >
            {en ? 'Solve cube (dev)' : 'Resolver cubo (dev)'}
          </button>
        )}
        {user && (
          <button
            className={buttonClass}
            disabled={disabled || session.devSolved}
            onClick={() => void run(saveGame)}
          >
            {en ? 'Save game' : 'Salvar partida'}
          </button>
        )}
        <span aria-live="polite">
          {moveCount} {en ? 'moves' : 'movimentos'}
        </span>
        <details ref={panelRef} className="group">
          <summary
            className={`${buttonClass} inline-flex list-none items-center gap-1 [&::-webkit-details-marker]:hidden`}
          >
            <ChevronDown
              className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
            {en ? 'Games and appearance' : 'Partidas e aparência'}
          </summary>
          <div className="absolute left-2 right-2 top-full z-10 box-border max-h-[54vh] overflow-auto rounded-xl border border-solid border-accent bg-surface p-3 text-ink shadow-xl">
            {!user ? (
              <div className="flex justify-center pt-2">
                <GameNotice tone="info">
                  {en
                    ? 'Open Account to sign in and save games and presets.'
                    : 'Abra Conta para entrar e salvar partidas e presets.'}
                </GameNotice>
              </div>
            ) : (
              <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                <SavedGames
                  en={en}
                  collection={games.data}
                  loading={games.isLoading}
                  disabled={disabled}
                  resumeDisabled={session.paused}
                  onPageChange={setGamesPage}
                  onRename={renameGame}
                  onResume={resumeGame}
                  onDelete={deleteGame}
                />
                <PresetEditor
                  key={`${session.preset}-${JSON.stringify(session.appearance)}`}
                  en={en}
                  appearance={session.appearance}
                  presets={presets.data}
                  activePreset={activePreset}
                  disabled={cubeDisabled}
                  onSave={savePreset}
                  onSelect={selectPreset}
                  onDelete={deletePreset}
                />
                <CompletedAttempts
                  en={en}
                  collection={attempts.data}
                  loading={attempts.isLoading}
                  disabled={disabled}
                  canRecord={canRecordAttempt}
                  onPageChange={setAttemptsPage}
                  onRecord={recordAttempt}
                  onDelete={deleteAttempt}
                />
                {(games.error || presets.error || attempts.error) && (
                  <div className="flex justify-center pt-2 lg:col-span-2">
                    <GameNotice tone="error" role="alert">
                      <span>
                        {en ? 'Unable to load your data.' : 'Não foi possível carregar seus dados.'}
                      </span>
                      <button className={compactButtonClass} onClick={reloadCollections}>
                        {en ? 'Try again' : 'Tentar novamente'}
                      </button>
                    </GameNotice>
                  </div>
                )}
              </div>
            )}
          </div>
        </details>
      </div>
      <GameTimer
        session={session}
        en={en}
        disabled={disabled || session.finished}
        onTogglePause={togglePause}
      />
      <div className="pointer-events-none absolute left-4 right-4 top-full mt-2 flex max-w-[30rem] flex-col items-start gap-2">
        {isSolved && !session.finished && !lastAutoSolve && (
          <GameNotice tone="info">
            {en
              ? 'Start a new game to scramble the cube.'
              : 'Inicie uma nova partida para embaralhar o cubo.'}
          </GameNotice>
        )}
        {session.finished && (
          <TimedGameNotice
            tone="info"
            role="status"
            durationMs={noticeDurationMs.autoSolved}
            occurrence={session}
          >
            {session.devSolved
              ? en
                ? 'Test solve completed.'
                : 'Resolução de teste concluída.'
              : en
                ? 'Cube solved!'
                : 'Cubo resolvido!'}
          </TimedGameNotice>
        )}
        {session.paused && (
          <TimedGameNotice
            tone={pauseBlocked ? 'warning' : 'info'}
            durationMs={pauseBlocked ? noticeDurationMs.blocked : noticeDurationMs.paused}
            occurrence={pauseBlockCount}
          >
            {pauseBlocked
              ? en
                ? 'Command blocked. Resume the timer to move the cube.'
                : 'Comando bloqueado. Retome o cronômetro para mover o cubo.'
              : en
                ? 'Paused. Resume the timer to move the cube.'
                : 'Em pausa. Retome o cronômetro para mover o cubo.'}
          </TimedGameNotice>
        )}
        {lastAutoSolve && (
          <TimedGameNotice
            tone="info"
            durationMs={noticeDurationMs.autoSolved}
            occurrence={lastAutoSolve}
          >
            {en
              ? 'Auto-solve used. Start a new game to record a manual solve.'
              : 'Resolução automática usada. Inicie uma nova partida para registrar uma resolução manual.'}
          </TimedGameNotice>
        )}
        {cubeError && (
          <TimedGameNotice
            tone="error"
            role="alert"
            durationMs={noticeDurationMs.error}
            occurrence={cubeError}
          >
            {cubeError.message}
          </TimedGameNotice>
        )}
        {feedback && user && (
          <TimedGameNotice
            tone={feedback.tone}
            role={feedback.tone === 'error' ? 'alert' : 'status'}
            durationMs={feedback.durationMs}
            occurrence={feedback}
          >
            {feedback.message}
          </TimedGameNotice>
        )}
      </div>
    </section>
  );
}
