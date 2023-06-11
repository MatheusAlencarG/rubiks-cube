import {
  PieceConstructor,
  PieceStyles,
  PieceData,
  PieceStylesKeys,
  PieceDataKeys,
  PieceColors,
  LinkedTransformOrigins,
  LinkedTransformOriginsKeys,
  PieceClass,
  PieceClassKeys,
  PieceClassValues
} from "../../../types";

export class Piece {
  private id: number;
  private styles: PieceStyles;
  private data: PieceData;
  private class: PieceClass;
  private linkedTransformOrigins: LinkedTransformOrigins;

  constructor({
    id,
    styles: {
      width,
      height,
      translateX,
      translateY,
      translateZ,
    },
    data: {
      layer,
      type,
      colors,
      faces,
    },
    linkedTransformOrigins: {
      frontX,
      frontY,
      frontZ,
      backX,
      backY,
      backZ,
      leftX,
      leftY,
      leftZ,
      rightX,
      rightY,
      rightZ,
      topX,
      topY,
      topZ,
      bottomX,
      bottomY,
      bottomZ,
    }
  }: PieceConstructor) {
    this.id = id;
    this.styles = {
      width,
      height,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      pieceRotateX: 0,
      pieceRotateY: 0,
      pieceRotateZ: 0,
      transformOriginX: 0,
      transformOriginY: 0,
      transformOriginZ: 0,
      translateX,
      translateY,
      translateZ,
      faceWidth: 80,
      faceHeight: 80,
      faceTranslateX: 40,
      faceTranslateY: 40,
      faceTranslateZ: 40,
      transition: 0,
    };
    this.data = {
      layer,
      type,
      colors,
      faces
    };
    this.class = {
      frontClass: 'front',
      backClass: 'back',
      leftClass: 'left',
      rightClass: 'right',
      topClass: 'top',
      bottomClass: 'bottom',
    };
    this.linkedTransformOrigins = {
      frontX,
      frontY,
      frontZ,
      backX,
      backY,
      backZ,
      leftX,
      leftY,
      leftZ,
      rightX,
      rightY,
      rightZ,
      topX,
      topY,
      topZ,
      bottomX,
      bottomY,
      bottomZ
    }
  }

  public getId() {
    return this.id;
  }

  public getStyle(key: PieceStylesKeys) {
    const style = this.styles[key] as number;
    return style;
  }

  public setStyle(key: PieceStylesKeys, value: number | undefined) {
    if (!value && value !== 0) return
    
    this.styles[key] = value;
  }

  public getAllStyle() {
    return this.styles
  }

  public setAllStyle(styles: PieceStyles) {
    this.styles = styles;
  }

  public getData(key: PieceDataKeys) {
    return this.data[key]
  }

  public setData(key: PieceDataKeys, value: string & PieceColors[]) {
    this.data[key] = value;
  }

  public getAllData() {
    return this.data
  }

  public setAllData(styles: PieceData) {
    this.data = styles;
  }

  public getFrontLinkedTransformOrigins() {
    const { frontX, frontY, frontZ } = this.linkedTransformOrigins;
    return { frontX, frontY, frontZ };
  }

  public getBackLinkedTransformOrigins() {
    const { backX, backY, backZ } = this.linkedTransformOrigins;
    return { backX, backY, backZ };
  }

  public getLeftLinkedTransformOrigins() {
    const { leftX, leftY, leftZ } = this.linkedTransformOrigins;
    return { leftX, leftY, leftZ };
  }

  public getRightLinkedTransformOrigins() {
    const { rightX, rightY, rightZ } = this.linkedTransformOrigins;
    return { rightX, rightY, rightZ };
  }

  public getTopLinkedTransformOrigins() {
    const { topX, topY, topZ } = this.linkedTransformOrigins;
    return { topX, topY, topZ };
  }

  public getBottomLinkedTransformOrigins() {
    const { bottomX, bottomY, bottomZ } = this.linkedTransformOrigins;
    return { bottomX, bottomY, bottomZ };
  }

  public setLinkedTransformOrigins(key: LinkedTransformOriginsKeys, value: number | undefined) {
    this.linkedTransformOrigins[key] = value;
  }

  public getLinkedTransformOrigins(key: LinkedTransformOriginsKeys) {
    return this.linkedTransformOrigins[key]
  }

  public getAllLinkedTransformOrigins() {
    return this.linkedTransformOrigins
  }

  public getClass(key: PieceClassKeys) {
    return this.class[key]
  }

  public setClass(key: PieceClassKeys, value: PieceClassValues | undefined) {
    this.class[key] = value;
  }

  public getAllClass() {
    return this.class
  }

  public setAllClass(classes: PieceClass) {
    this.class = classes;
  }
}