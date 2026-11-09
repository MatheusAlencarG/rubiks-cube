import { createContext, useContext } from 'react';
import type { Appearance, SavedGame } from '../api/types';
import type { CubeSession } from '../cube/session';

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
  togglePause: () => void;
  loadGame: (game: SavedGame) => void;
  refresh: () => void;
}
export const CubeSessionContext = createContext<CubeSessionValue | null>(null);
export function useCubeSession() {
  const value = useContext(CubeSessionContext);
  if (!value) throw new Error('useCubeSession requires RubicksCube3x3Context.');
  return value;
}
