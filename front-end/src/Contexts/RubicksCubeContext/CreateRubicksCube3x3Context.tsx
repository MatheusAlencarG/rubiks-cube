import { createContext, useContext } from 'react';
import type { RubicksCube3x3 } from './RucksCube3x3/RubicksCube3x3';
export type FaceMovement = (direction?: 'shift') => void;
export interface CubeFunctions {
  horizontalCubeMovement: (direction: 'left' | 'right') => void;
  verticalCubeMovement: (direction: 'top' | 'bottom') => void;
  rightPiecesMovement: FaceMovement;
  topPiecesMovement: FaceMovement;
  bottomPiecesMovement: FaceMovement;
  frontPiecesMovement: FaceMovement;
  leftPiecesMovement: FaceMovement;
  backPiecesMovement: FaceMovement;
}
interface CubeContextValue {
  rubicksCube3x3: { cube: RubicksCube3x3; functions: CubeFunctions };
}
export const Context = createContext<CubeContextValue | null>(null);
export function useCube() {
  const value = useContext(Context);
  if (!value) throw new Error('useCube requires RubicksCube3x3Context.');
  return value;
}
