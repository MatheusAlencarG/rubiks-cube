import { Piece } from "../../Contexts/RubicksCubeContext/RubicksCubeContextTypes";

export type CubeProps = {
  widthCustom: number;
  heightCustom: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

export type PieceProps = {
  widthCustom: number;
  heightCustom: number;
  transformOriginX: number;
  transformOriginY: number;
  transformOriginZ: number;
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  topFaceColor: string;
  bottomFaceColor: string;
  leftFaceColor: string;
  rightFaceColor: string;
  frontFaceColor: string;
  backFaceColor: string;
}

export type PieceFaceProps = {
  widthCustom: number;
  heightCustom: number;
  lineHeight: number;
  translateX?: number;
  translateY?: number;
  translateZ: number;
  pieceRadius: number;
}

export type RenderPieceFaceProps = {
  pieceFaceType: string;
  piece: Piece;
}