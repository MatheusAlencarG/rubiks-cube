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
} from '../../cube/session';
import { CubeSessionContext } from '../CubeSessionContext';
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
  const [error, setError] = useState('');
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
    setError('');
    setCurrent(next);
  }, []);
  function newGame(
    appearance = activePreset?.appearance ?? DEFAULT_APPEARANCE,
    preset = activePreset?.documentId ?? null
  ) {
    if (busy.current) return;
    replace(new CubeSession(appearance, preset));
  }
  function loadGame(game: SavedGame) {
    if (busy.current) return;
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
      if (busy.current) return;
      const { cube, session } = latest.current;
      try {
        session.move(movementType === 'shift' ? `${move}'` : move);
      } catch (failure) {
        setError((failure as Error).message);
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
    [refresh]
  );
  const functions = useMemo<CubeFunctions>(
    () => ({
      horizontalCubeMovement: direction => {
        latest.current.cube.horizontalCubeMovement(direction);
        refresh();
      },
      verticalCubeMovement: direction => {
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
    [turn, refresh]
  );
  return (
    <CubeSessionContext.Provider
      value={{ session: current.session, busy: isBusy, error, newGame, loadGame, refresh }}
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
