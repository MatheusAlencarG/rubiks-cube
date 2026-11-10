import { createContext, useContext } from 'react';
import type { Appearance, SavedGame } from '../model/cubeTypes';
import type { CubeSession } from '../model/CubeSession';

export interface NewGameOptions {
  appearance?: Appearance;
  preset?: string | null;
  scramble?: boolean;
}

interface CubeSessionValue {
  session: CubeSession;
  busy: boolean;
  error?: { message: string };
  pauseBlockCount: number;
  newGame: (options?: NewGameOptions) => void;
  solveCube: () => void;
  solveCubeForTesting: () => boolean;
  togglePause: () => void;
  loadGame: (game: SavedGame) => void;
  refresh: () => void;
}
export const CubeSessionContext = createContext<CubeSessionValue | null>(null);

export function isLocalCubeTest() {
  return ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
}

export function useCubeSession() {
  const value = useContext(CubeSessionContext);
  if (!value) throw new Error('useCubeSession requires CubeProvider.');
  return value;
}
