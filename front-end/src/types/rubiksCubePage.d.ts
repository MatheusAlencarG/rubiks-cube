import type { Piece } from '../Contexts/RubicksCubeContext/RucksCube3x3/Piece';
import type { PieceClassValues } from './RubicksCube3x3';
export interface RenderPieceFaceProps {
  pieceFaceType: PieceClassValues;
  piece: Piece;
  rotateX?: number;
  rotateY?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
}
