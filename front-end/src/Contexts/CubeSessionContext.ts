import { createContext, useContext } from 'react';
import type { Appearance, SavedGame } from '../api/types';
import type { CubeSession } from '../cube/session';
interface CubeSessionValue {
  session: CubeSession;
  busy: boolean;
  error: string;
  newGame: (appearance?: Appearance, preset?: string | null) => void;
  loadGame: (game: SavedGame) => void;
  refresh: () => void;
}
export const CubeSessionContext = createContext<CubeSessionValue | null>(null);
export function useCubeSession() {
  const value = useContext(CubeSessionContext);
  if (!value) throw new Error('useCubeSession requires RubicksCube3x3Context.');
  return value;
}
