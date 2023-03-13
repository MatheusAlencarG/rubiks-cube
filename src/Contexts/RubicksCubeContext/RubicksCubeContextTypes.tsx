import { ReactNode } from "react"

export type RubicksCubeContextProps = {
  children: ReactNode
}

export interface Initial_State {
  rubicksCubeState: Cube;
  horizontalCubeMovement: (movementType: string) => void;
  verticalCubeMovement: (movementType: string) => void;
  rightPiecesMovement: (movementType: string) => void;
  leftPiecesMovement: (movementType: string) => void;
  topPiecesMovement: (movementType: string) => void;
  bottomPiecesMovement: (movementType: string) => void;
  frontPiecesMovement: (movementType: string) => void;
  backPiecesMovement: (movementType: string) => void;
}

export interface Cube {
  cube: {
    width: number;
    height: number;
    rotate: ThreeDType;
    pieceRadius: number;
    pieces: Piece[];
    frontFace: FaceContent;
    backFace: FaceContent;
    topFace: FaceContent;
    bottomFace: FaceContent;
    rightFace: FaceContent;
    leftFace: FaceContent;
  };
}

export interface FaceContent {
  cornerPieces: FacePieces[];
  middlePieces: FacePieces[];
  centerPieces: FacePieces[];
  rotateAxle: 'x' | 'y' | 'z';
  faceColor: {
    hexadecimal: string;
    color: string;
  };
  color: string;
}

export interface FacePieces {
  transformOrigin: ThreeDType;
  colors: string[];
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

export type SetInfoCubeProps = {
  cube: {
    faceColor: {
      topFaceColor: string;
      bottomFaceColor: string;
      leftFaceColor: string;
      rightFaceColor: string;
      frontFaceColor: string;
      backFaceColor: string;
    },
    rotate: ThreeDType;
    pieces: Piece[];
  }
}

export interface GetNewLayerPiecesProps {
  pieces: Piece[];
  topFaceColor: string;
  bottomFaceColor: string;
} 

export interface GetNewPiecesProps {
  pieces: Piece[];
  centerPieces: FacePieces[];
  middlePieces: FacePieces[];
  cornerPieces: FacePieces[];
  movementType: string;
  faceColor: string;
  rotateAxle: 'x' | 'y' | 'z';
  typeMovement: string;
}

export interface GetOldPiecesWithRotationProps {
  oldPieces: Piece[];
  newPieces: Piece[];
}