import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChevronDown, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { buttonClass, compactButtonClass } from './controlStyles';
import { Context as LanguageContext } from '../Contexts/GeneralConfigContext/Context';
import { useCube } from '../Contexts/RubicksCubeContext/CreateRubicksCube3x3Context';
import { useCubeSession } from '../Contexts/CubeSessionContext';
import { useAuth } from '../Contexts/AuthContext';
import { usePrivateCollection, usePrivatePage } from '../api/hooks';
import { api, writeDocument } from '../api/client';
import type { Attempt, Collection, Preset, SavedGame } from '../api/types';
import CollectionPagination from './CollectionPagination';
import GameTimer from './GameTimer';
import SavedGames from './SavedGames';
import PresetEditor, { PresetInput } from './PresetEditor';
import { countManualMoves, DEFAULT_APPEARANCE } from '../cube/session';

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
  const { language, preferences } = useContext(LanguageContext);
  const {
    rubicksCube3x3: { cube },
  } = useCube();
  const {
    session,
    busy: turning,
    error: cubeError,
    pauseBlockCount,
    newGame,
    solveCube,
    togglePause,
    loadGame,
    refresh,
  } = useCubeSession();
  const { user, token } = useAuth();

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
    !cubeDisabled && !lastAutoSolve && moveCount > 0 && isSolved && !session.attemptRecorded;
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
    if (!canRecordAttempt) return;

    const payload = session.payload(cube, '');
    await writeDocument<Attempt>('solve-attempts', token!, {
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
    if (attemptsPage === 1) await attempts.mutate();
    else setAttemptsPage(1);
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
        <button className={buttonClass} disabled={disabled} onClick={startNewGame}>
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
        {user && (
          <button className={buttonClass} disabled={disabled} onClick={() => void run(saveGame)}>
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
                  onRecord={() => void run(complete)}
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
      <GameTimer session={session} en={en} disabled={disabled} onTogglePause={togglePause} />
      <div className="pointer-events-none absolute left-4 right-4 top-full mt-2 flex max-w-[30rem] flex-col items-start gap-2">
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

const noticeStyles = {
  info: { icon: Info, colors: 'border-sky-400 bg-sky-950 text-sky-100' },
  warning: { icon: TriangleAlert, colors: 'border-amber-400 bg-amber-950 text-amber-100' },
  error: { icon: CircleAlert, colors: 'border-red-400 bg-red-950 text-red-100' },
};

interface GameNoticeProps {
  tone: keyof typeof noticeStyles;
  role?: 'alert' | 'status';
  children: React.ReactNode;
}

function TimedGameNotice({
  durationMs,
  occurrence,
  ...notice
}: GameNoticeProps & { durationMs: number; occurrence: number | object }) {
  const [expiredOccurrence, setExpiredOccurrence] = useState<typeof occurrence>();

  useEffect(() => {
    const timeout = window.setTimeout(() => setExpiredOccurrence(occurrence), durationMs);
    return () => window.clearTimeout(timeout);
  }, [durationMs, occurrence]);

  return expiredOccurrence === occurrence ? null : <GameNotice {...notice} />;
}

function GameNotice({ tone, role, children }: GameNoticeProps) {
  const { icon: Icon, colors } = noticeStyles[tone];

  return (
    <div
      role={role}
      aria-live={role ? undefined : 'polite'}
      className={`box-border flex w-fit max-w-full items-center gap-2 rounded-md border border-solid px-3 py-2 text-xs ${colors}`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-wrap items-center gap-2 break-words">{children}</div>
    </div>
  );
}

interface CompletedAttemptsProps {
  en: boolean;
  collection?: Collection<Attempt>;
  loading: boolean;
  disabled: boolean;
  canRecord: boolean;
  onPageChange: (page: number) => void;
  onRecord: () => void;
  onDelete: (documentId: string) => void;
}

function CompletedAttempts({
  en,
  collection,
  loading,
  disabled,
  canRecord,
  onPageChange,
  onRecord,
  onDelete,
}: CompletedAttemptsProps) {
  const { page = 1, pageCount = 0 } = collection?.meta.pagination ?? {};

  return (
    <section className="rounded-lg border border-solid border-gray-500/40 bg-canvas p-3 text-on-canvas lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold">
          {en ? 'Completed attempts' : 'Tentativas concluídas'}
        </h3>
        <button
          type="button"
          className={compactButtonClass}
          disabled={!canRecord}
          onClick={onRecord}
        >
          {en ? 'Record solved attempt' : 'Registrar tentativa resolvida'}
        </button>
      </div>

      {loading && <p role="status">{en ? 'Loading attempts…' : 'Carregando tentativas…'}</p>}
      {collection?.data.map(attempt => (
        <div
          key={attempt.documentId}
          className="mt-2 flex flex-wrap items-center justify-between gap-2 border-0 border-t border-solid border-gray-500/40 pt-2 text-xs"
        >
          <div className="flex flex-wrap gap-2">
            <strong>{(attempt.durationMs / 1000).toFixed(2)} s</strong>
            <time dateTime={attempt.completedAt} className="opacity-75">
              {new Date(attempt.completedAt).toLocaleString(en ? 'en-US' : 'pt-BR')}
            </time>
          </div>
          <button
            type="button"
            className={compactButtonClass}
            disabled={disabled}
            onClick={() => onDelete(attempt.documentId)}
          >
            {en ? 'Delete attempt' : 'Excluir tentativa'}
          </button>
        </div>
      ))}
      <CollectionPagination
        en={en}
        label={en ? 'Completed attempts pages' : 'Páginas de tentativas concluídas'}
        page={page}
        pageCount={pageCount}
        disabled={disabled || loading}
        onPageChange={onPageChange}
      />
    </section>
  );
}
