import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Context, CubeFunctions } from './CreateRubicksCube3x3Context';
import { createRubicksCube3x3 } from './RucksCube3x3/instantiateRubicksCube3x3';
import {
  CubeSession,
  applyAppearance,
  DEFAULT_APPEARANCE,
  restoreVisual,
  SOLVED,
} from '../../cube/session';
import { CubeSessionContext, NewGameOptions } from '../CubeSessionContext';
import { Context as PreferencesContext } from '../GeneralConfigContext/Context';
import { useAuth } from '../AuthContext';
import type { SavedGame } from '../../api/types';

function bundle(session = new CubeSession()) {
  const cube = createRubicksCube3x3();
  applyAppearance(cube, session.appearance);
  restoreVisual(cube, session.logical.asString());
  return { cube, session };
}
export default function RubicksCube3x3Context({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState(bundle);
  const latest = useRef(current);
  const [, render] = useState(0);
  const busy = useRef(false);
  const [isBusy, setIsBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [error, setError] = useState<{ message: string }>();
  const [pauseBlockCount, setPauseBlockCount] = useState(0);
  const { user } = useAuth();
  const { settings } = useContext(PreferencesContext).preferences;
  const activePreset = settings?.activePreset;
  const refresh = useCallback(() => render(value => value + 1), []);
  const replace = useCallback((session: CubeSession) => {
    const next = bundle(session);
    latest.current = next;
    busy.current = false;
    setIsBusy(false);
    clearTimeout(timer.current);
    setError(undefined);
    setPauseBlockCount(0);
    setCurrent(next);
  }, []);
  function newGame({
    appearance = activePreset?.appearance ?? DEFAULT_APPEARANCE,
    preset = activePreset?.documentId ?? null,
    scramble = false,
  }: NewGameOptions = {}) {
    if (busy.current || (!scramble && latest.current.session.paused)) return;

    replace(
      scramble ? CubeSession.scrambled(appearance, preset) : new CubeSession(appearance, preset)
    );
  }

  const blockedByPause = useCallback(() => {
    if (!latest.current.session.paused) return false;

    setPauseBlockCount(count => count + 1);
    return true;
  }, []);

  function solveCube() {
    if (busy.current || blockedByPause()) return;

    const { cube, session } = latest.current;
    try {
      session.autoSolve();
      restoreVisual(cube, session.logical.asString());
      setError(undefined);
      refresh();
    } catch (failure) {
      setError({ message: (failure as Error).message });
    }
  }

  const togglePause = useCallback(() => {
    if (busy.current) return;

    latest.current.session.togglePause();
    setPauseBlockCount(0);
    refresh();
  }, [refresh]);

  function loadGame(game: SavedGame) {
    if (busy.current || latest.current.session.paused) return;
    replace(CubeSession.load(game));
    latest.current.cube.setStyle('rotateX', game.viewRotationX);
    latest.current.cube.setStyle('rotateY', game.viewRotationY);
    latest.current.cube.setStyle('rotateZ', game.viewRotationZ);
  }
  // Switching accounts starts a separate session; never carry another user's game forward.
  useEffect(() => {
    replace(new CubeSession());
  }, [user?.id, replace]);
  useEffect(() => {
    if (
      !busy.current &&
      !latest.current.session.paused &&
      latest.current.session.initialState.facelets === SOLVED &&
      latest.current.session.moves.length === 0 &&
      !latest.current.session.documentId
    ) {
      const appearance = activePreset?.appearance ?? DEFAULT_APPEARANCE;
      const session = latest.current.session;
      const sameAppearance = (
        Object.keys(DEFAULT_APPEARANCE) as (keyof typeof DEFAULT_APPEARANCE)[]
      ).every(key => appearance[key] === session.appearance[key]);
      if (session.preset !== (activePreset?.documentId ?? null) || !sameAppearance)
        replace(new CubeSession(appearance, activePreset?.documentId ?? null));
    }
  }, [activePreset, replace]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const turn = useCallback(
    (
      method:
        | 'frontPiecesMovement'
        | 'backPiecesMovement'
        | 'leftPiecesMovement'
        | 'rightPiecesMovement'
        | 'topPiecesMovement'
        | 'bottomPiecesMovement',
      move: string,
      movementType?: 'shift'
    ) => {
      if (busy.current || blockedByPause()) return;
      const { cube, session } = latest.current;
      try {
        session.move(movementType === 'shift' ? `${move}'` : move);
      } catch (failure) {
        setError({ message: (failure as Error).message });
        return;
      }
      busy.current = true;
      setIsBusy(true);
      cube[method](movementType);
      refresh();
      timer.current = setTimeout(() => {
        busy.current = false;
        setIsBusy(false);
        refresh();
      }, session.appearance.transitionMs);
    },
    [blockedByPause, refresh]
  );
  const functions = useMemo<CubeFunctions>(
    () => ({
      horizontalCubeMovement: direction => {
        if (blockedByPause()) return;
        latest.current.cube.horizontalCubeMovement(direction);
        refresh();
      },
      verticalCubeMovement: direction => {
        if (blockedByPause()) return;
        latest.current.cube.verticalCubeMovement(direction);
        refresh();
      },
      frontPiecesMovement: direction => turn('frontPiecesMovement', 'F', direction),
      backPiecesMovement: direction => turn('backPiecesMovement', 'B', direction),
      leftPiecesMovement: direction => turn('leftPiecesMovement', 'L', direction),
      rightPiecesMovement: direction => turn('rightPiecesMovement', 'R', direction),
      topPiecesMovement: direction => turn('topPiecesMovement', 'U', direction),
      bottomPiecesMovement: direction => turn('bottomPiecesMovement', 'D', direction),
    }),
    [blockedByPause, turn, refresh]
  );
  return (
    <CubeSessionContext.Provider
      value={{
        session: current.session,
        busy: isBusy,
        error,
        pauseBlockCount,
        newGame,
        solveCube,
        togglePause,
        loadGame,
        refresh,
      }}
    >
      <Context.Provider
        value={{
          rubicksCube3x3: {
            cube: current.cube,
            functions,
          },
        }}
      >
        {children}
      </Context.Provider>
    </CubeSessionContext.Provider>
  );
}
