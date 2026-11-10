import type { Piece } from './model/Piece';
import type { PieceClassValues } from './model/visualCubeTypes';
export interface RenderPieceFaceProps {
  pieceFaceType: PieceClassValues;
  piece: Piece;
  rotateX?: number;
  rotateY?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
}
