import { Piece } from "../Contexts/RubicksCubeContext/RucksCube3x3/Piece";

export interface CubeProps {
  widthCustom: number;
  heightCustom: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  transition: number;
}

export interface PieceFaceProps {
  widthCustom: number;
  heightCustom: number;
  translateX?: number;
  translateY?: number;
  translateZ: number;
  pieceRadius: number;
}

export interface RenderPieceFaceProps {
  pieceFaceType: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
  piece: Piece;
  rotateX?: number;
  rotateY?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
}

export interface PieceContainerProps {
  pieceRotateX: number;
  pieceRotateY: number;
  pieceRotateZ: number;
  topFaceColor: string;
  bottomFaceColor: string;
  leftFaceColor: string;
  rightFaceColor: string;
  frontFaceColor: string;
  backFaceColor: string;
  transition: number;
}