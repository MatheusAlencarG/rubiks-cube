import { Piece } from "./index";

export interface CubeProps {
  widthCustom: number;
  heightCustom: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

export interface PieceFaceProps {
  widthCustom: number;
  heightCustom: number;
  lineHeight: number;
  translateX?: number;
  translateY?: number;
  translateZ: number;
  pieceRadius: number;
}

export interface RenderPieceFaceProps {
  pieceFaceType: string;
  piece: Piece;
}

export interface PieceContainerProps {
  widthCustom: number;
  heightCustom: number;
  transformOriginX: number;
  transformOriginY: number;
  transformOriginZ: number;
  translateX: number;
  translateY: number;
  translateZ: number;
  faceRotateX: number;
  faceRotateY: number;
  faceRotateZ: number;
  pieceRotateX: number;
  pieceRotateY: number;
  pieceRotateZ: number;
  topFaceColor: string;
  bottomFaceColor: string;
  leftFaceColor: string;
  rightFaceColor: string;
  frontFaceColor: string;
  backFaceColor: string;
}