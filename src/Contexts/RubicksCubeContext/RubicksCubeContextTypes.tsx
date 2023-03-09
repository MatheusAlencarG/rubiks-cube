import { ReactNode } from "react"

export type RubicksCubeContextProps = {
  children: ReactNode
}

export interface Initial_State {
  cube: {
    width: number;
    height: number;
    rotate: ThreeDType;
    pieceRadius: number;
    pieces: Piece[];
    firstFace: string;
    secondFace: string;
    thirdFace: string;
    fourthFace: string;
    fivethFace: string;
    sixthFace: string;
  };
}

export type Piece = {
  id: number;
  width: number;
  height: number;
  transformOrigin: ThreeDType;
  translate: ThreeDType;
  rotate: ThreeDType;
  faces: FacePiece;
  data: {
    layer: string,
    type: string,
    colors: {
      firstColor: {
        color: string,
        face: string
      },
      secondColor?: {
        color: string,
        face: string
      },
      thirdColor?: {
        color: string,
        face: string
      }
    }
  }
}

export type ThreeDType = {
  x: number;
  y: number;
  z: number;
}

export interface FacePiece {
  width: number;
  height: number;
  lineHeight: number;
  translate: ThreeDType;
}

export interface Face {
  rotate: ThreeDType;
}