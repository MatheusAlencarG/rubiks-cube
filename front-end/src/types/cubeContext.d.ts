import { ReactNode } from "react"

export interface RubicksCubeContextProps {
  children: ReactNode
}

export interface Initial_State_Cube {
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

export interface Piece {
  id: number;
  width: number;
  height: number;
  transformOrigin: ThreeDType;
  translate: ThreeDType;
  faceRotate: ThreeDType;
  pieceRotate: ThreeDType;
  faces: FacePiece;
  data: {
    layer: string,
    type: string,
    colors: string[];
    faces: string[];
  }
}

export interface ThreeDType {
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

export interface SetInfoCubeProps {
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
  rotateMovementType: string;
}

export interface GetOldPiecesWithRotationProps {
  oldPieces: Piece[];
  newPieces: Piece[];
  movementTypeColor: string;
  isTop: boolean;
  rotateAxle: 'x' | 'y' | 'z';
}

export interface GetNewFacePieces {
  isTopMovement: boolean;
  isBottomMovement: boolean;
  isRightMovement: boolean;
  isLeftMovement: boolean;
  isBackMovement: boolean;
  isFrontMovement: boolean;
  pieces: Piece[];
  isTop: boolean;
}