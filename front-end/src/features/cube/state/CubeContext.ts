import { createContext, useContext } from 'react';
import type { RubiksCube3x3 } from '../model/RubiksCube3x3';
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
  rubiksCube3x3: { cube: RubiksCube3x3; functions: CubeFunctions };
}
export const CubeContext = createContext<CubeContextValue | null>(null);
export function useCube() {
  const value = useContext(CubeContext);
  if (!value) throw new Error('useCube requires CubeProvider.');
  return value;
}
