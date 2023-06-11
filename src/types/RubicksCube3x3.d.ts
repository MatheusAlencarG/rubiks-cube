import { Piece } from "../Contexts/RubicksCube3x3Context/RucksCube3x3/Piece";

interface RubicksCube3x3Constructor {
  colors: Colors;
  styles: RubicksCube3x3Styles;
  piece?: Piece;
  rotateAxle: RubicksCube3x3RotateAxle;
}

interface RubicksCube3x3Colors {
  frontColor: string;
  backColor: string;
  leftColor: string;
  rightColor: string;
  topColor: string;
  bottomColor: string;
}

interface RubicksCube3x3Styles {
  width: number;
  height: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  pieceRadius: number;
  transition: number;
}

interface RubicksCube3x3RotateAxle {
  frontFace: RotateAxleValues;
  backFace: RotateAxleValues;
  leftFace: RotateAxleValues;
  rightFace: RotateAxleValues;
  topFace: RotateAxleValues;
  bottomFace: RotateAxleValues;
}

type RubicksCube3x3StylesKeys = 'width' | 'height' | 'rotateX' | 'rotateY' | 'rotateZ' | 'pieceRadius' | 'transition'
type RubicksCube3x3ColorsKeys = 'frontColor' | 'backColor' | 'leftColor' | 'rightColor' | 'topColor' | 'bottomColor'
type RubicksCube3x3RotateAxleKeys = 'frontFace' | 'backFace' | 'leftFace' | 'rightFace' | 'topFace' | 'bottomFace'

interface PieceConstructor {
  id: number;
  styles: PieceStyles;
  data: PieceData;
  class?: PieceClass;
  linkedTransformOrigins: LinkedTransformOrigins;
}

interface PieceStyles {
  width: number;
  height: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  pieceRotateX?: number;
  pieceRotateY?: number;
  pieceRotateZ?: number;
  transformOriginX?: number;
  transformOriginY?: number;
  transformOriginZ?: number;
  translateX: number;
  translateY: number;
  translateZ: number;
  faceWidth?: number;
  faceHeight?: number;
  faceTranslateX?: number;
  faceTranslateY?: number;
  faceTranslateZ?: number;
  transition?: number;
}

interface PieceData {
  layer: string;
  type: string;
  colors: PieceColors[];
  faces: PieceColors[];
}

interface PieceClass {
  frontClass?: PieceClassValues;
  backClass?: PieceClassValues;
  leftClass?: PieceClassValues;
  rightClass?: PieceClassValues;
  topClass?: PieceClassValues;
  bottomClass?: PieceClassValues;
}

interface LinkedTransformOrigins {
  frontX?: number;
  frontY?: number;
  frontZ?: number;
  backX?: number;
  backY?: number;
  backZ?: number;
  leftX?: number;
  leftY?: number;
  leftZ?: number;
  rightX?: number;
  rightY?: number;
  rightZ?: number;
  topX?: number;
  topY?: number;
  topZ?: number;
  bottomX?: number;
  bottomY?: number;
  bottomZ?: number;
}

interface SetPieceValueOnTimeoutProps {
  currentPiece: Piece;
  nextCacheColors: string & PieceColors[];
  shiftPressed: boolean;
  faceInverted?: boolean;
  rotateAxle: PieceStylesKeys;
  pieceRotateAxle: PieceStylesKeys;
}

type PieceStylesKeys = 'width' | 'height' | 'rotateX' | 'rotateY' | 'rotateZ' | 'transformOriginX' | 'transformOriginY' | 'transformOriginZ' | 'faceWidth' | 'faceHeight' | 'faceTranslateX' | 'faceTranslateY' | 'faceTranslateZ' | 'translateX' | 'translateY' | 'translateZ' | 'pieceRotateX' | 'pieceRotateY' | 'pieceRotateZ' | 'transition'
type PieceDataKeys = 'layer' | 'type' | 'colors' | 'faces'
type PieceClassKeys = 'frontClass' | 'backClass' | 'leftClass' | 'rightClass' | 'topClass' | 'bottomClass'
type LinkedTransformOriginsKeys = 'frontX' | 'frontY' | 'frontZ' | 'backX' | 'backY' | 'backZ' | 'leftX' | 'leftY' | 'leftZ' | 'rightX' | 'rightY' | 'rightZ' | 'topX' | 'topY' | 'topZ' | 'bottomX' | 'bottomY' | 'bottomZ' 

type PieceClassValues = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom'
type PieceColors = 'red' | 'blue' | 'yellow' | 'white' | 'orange' | 'green'
type RotateAxleValues = 'x' | 'y' | 'z'

export {
  RubicksCube3x3Constructor,
  RubicksCube3x3Colors,
  RubicksCube3x3Styles,
  RubicksCube3x3RotateAxle,
  RubicksCube3x3StylesKeys,
  RubicksCube3x3ColorsKeys,
  RubicksCube3x3RotateAxleKeys,
  RotateAxleValues,
  PieceConstructor,
  PieceStyles,
  PieceData,
  PieceClass,
  LinkedTransformOrigins,
  SetPieceValueOnTimeoutProps,
  PieceStylesKeys,
  PieceDataKeys,
  PieceClassKeys,
  LinkedTransformOriginsKeys,
  PieceClassValues,
  PieceColors,
}