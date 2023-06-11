import {
  RubicksCube3x3Styles,
  RubicksCube3x3Colors,
  RubicksCube3x3Constructor,
  RubicksCube3x3RotateAxle,
  RubicksCube3x3StylesKeys,
  RubicksCube3x3ColorsKeys,
  RubicksCube3x3RotateAxleKeys,
  RotateAxleValues,
  PieceColors,
  SetPieceValueOnTimeoutProps,
} from "../../../types";

import { Piece } from "./Piece";

export class RubicksCube3x3 {
  private colors: RubicksCube3x3Colors;
  private styles: RubicksCube3x3Styles;
  private rotateAxle: RubicksCube3x3RotateAxle;
  private pieces: Piece[];

  constructor({
    colors: {
      frontColor, 
      backColor, 
      leftColor, 
      rightColor, 
      topColor, 
      bottomColor,
    },
    styles: {
      width,
      height,
      pieceRadius,
    },
    rotateAxle: {
      frontFace,
      backFace,
      leftFace,
      rightFace,
      topFace,
      bottomFace
    }
  }: RubicksCube3x3Constructor) {
    this.colors = {
      frontColor,
      backColor,
      leftColor,
      rightColor,
      topColor,
      bottomColor,
    };
    this.styles = {
      width,
      height,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      pieceRadius,
      transition: .5,
    };
    this.rotateAxle = {
      frontFace,
      backFace,
      leftFace,
      rightFace,
      topFace,
      bottomFace,
    }
    this.pieces = []
  }

  public verticalCubeMovement(movementType: 'top' | 'bottom') {
    const isTop = movementType === "top";
    
    if (this.styles.rotateZ === undefined) return

    const accountValue = isTop ? this.styles.rotateZ - 90 : this.styles.rotateZ + 90;

    this.styles.rotateZ = accountValue
  }

  public horizontalCubeMovement(movementType: 'left' | 'right') {
    const isLeft = movementType === "left";
    
    if (this.styles.rotateY === undefined) return

    const accountValue = isLeft ? this.styles.rotateY - 90 : this.styles.rotateY + 90;
    
    this.styles.rotateY = accountValue
  }

  public backPiecesMovement(movementType?: 'shift') {
    const shiftPressed = movementType === 'shift';
    const pieceIds = [7, 8, 9, 17, 26, 25, 24, 15];
    const pieces = this.pieces.filter(piece => pieceIds.includes(piece.getId()));

    const cachePieceColor = pieces.map(piece => {
      return {
        id: piece.getId(), 
        colors: piece.getData("colors")
      }
    });

    const cacheClass = pieces.map(piece => {
      return {
        id: piece.getId(),
        backClass: piece.getClass("backClass"),
        frontClass: piece.getClass("frontClass"),
        bottomClass: piece.getClass("bottomClass"),
        leftClass: piece.getClass("leftClass"),
        rightClass: piece.getClass("rightClass"),
        topClass: piece.getClass("topClass"),
      }
    })

    pieceIds.forEach((pieceId, index) => {
      const currentPiece = pieces.find(piece => piece.getId() === pieceId) as Piece;
      const { backX, backY, backZ } = currentPiece.getBackLinkedTransformOrigins();
      const nextPiece = pieces.find(_piece => {
        const nextIndex = (shiftPressed ? index + 2 : (index - 2 + pieceIds.length)) % pieceIds.length;
        return _piece.getId() === pieceIds[nextIndex];
      });
      const nextCacheColors = cachePieceColor.find(cacheColor => 
        cacheColor.id === nextPiece?.getId())?.colors as string & PieceColors[];

      currentPiece.setStyle("transition", .5);
      currentPiece.setStyle("transformOriginX", backX);
      currentPiece.setStyle("transformOriginY", backY);
      currentPiece.setStyle("transformOriginZ", backZ);
      currentPiece.setStyle(
        "rotateZ", 
        this.getRotateWithInvertedRotation({shiftPressed, faceInverted: true, rotate: currentPiece.getStyle("rotateZ")})
      );

      setTimeout(() => {
        const nextCacheClass = cacheClass.find(cacheClass =>
          cacheClass.id === nextPiece?.getId())

        shiftPressed ? currentPiece.setClass('bottomClass', nextCacheClass?.rightClass) : currentPiece.setClass('bottomClass', nextCacheClass?.leftClass);
        shiftPressed ? currentPiece.setClass('rightClass', nextCacheClass?.topClass) : currentPiece.setClass('rightClass', nextCacheClass?.bottomClass);
        shiftPressed ? currentPiece.setClass('topClass', nextCacheClass?.leftClass) : currentPiece.setClass('topClass', nextCacheClass?.rightClass);
        shiftPressed ? currentPiece.setClass('leftClass', nextCacheClass?.bottomClass) : currentPiece.setClass('leftClass', nextCacheClass?.topClass);
        currentPiece.setClass('backClass', nextCacheClass?.backClass);
        currentPiece.setClass('frontClass', nextCacheClass?.frontClass);

        this.setPieceValueOnTimeout({
          currentPiece,
          nextCacheColors,
          shiftPressed,
          faceInverted: true,
          rotateAxle: 'pieceRotateZ',
          pieceRotateAxle: 'rotateZ'
        })
      }, 500);
    })
  }

  public leftPiecesMovement(movementType?: 'shift') {
    const shiftPressed = movementType === 'shift';
    const pieceIds = [9, 6, 3, 12, 20, 23, 26, 17];
    const pieces = this.pieces.filter(piece => pieceIds.includes(piece.getId()));

    const cachePieceColor = pieces.map(piece => {
      return {
        id: piece.getId(), 
        colors: piece.getData("colors")
      }
    });

    const cacheClass = pieces.map(piece => {
      return {
        id: piece.getId(),
        backClass: piece.getClass("backClass"),
        frontClass: piece.getClass("frontClass"),
        bottomClass: piece.getClass("bottomClass"),
        leftClass: piece.getClass("leftClass"),
        rightClass: piece.getClass("rightClass"),
        topClass: piece.getClass("topClass"),
      }
    })

    pieceIds.forEach((pieceId, index) => {
      const currentPiece = pieces.find(piece => piece.getId() === pieceId) as Piece;
      const { leftX, leftY, leftZ } = currentPiece.getLeftLinkedTransformOrigins();
      const nextPiece = pieces.find(_piece => {
        const nextIndex = (shiftPressed ? index + 2 : (index - 2 + pieceIds.length)) % pieceIds.length;
        return _piece.getId() === pieceIds[nextIndex];
      });
      const nextCacheColors = cachePieceColor.find(cacheColor => 
        cacheColor.id === nextPiece?.getId())?.colors as string & PieceColors[];

      currentPiece.setStyle("transition", .5);
      currentPiece.setStyle("transformOriginX", leftX);
      currentPiece.setStyle("transformOriginY", leftY);
      currentPiece.setStyle("transformOriginZ", leftZ);
      currentPiece.setStyle(
        "rotateX", 
        this.getRotateWithInvertedRotation({shiftPressed, faceInverted: true, rotate: currentPiece.getStyle("rotateX")})
      );

      setTimeout(() => {
        const nextCacheClass = cacheClass.find(cacheClass =>
          cacheClass.id === nextPiece?.getId())

        shiftPressed ? currentPiece.setClass('bottomClass', nextCacheClass?.backClass) : currentPiece.setClass('bottomClass', nextCacheClass?.frontClass);
        shiftPressed ? currentPiece.setClass('frontClass', nextCacheClass?.bottomClass) : currentPiece.setClass('frontClass', nextCacheClass?.topClass);
        shiftPressed ? currentPiece.setClass('topClass', nextCacheClass?.frontClass) : currentPiece.setClass('topClass', nextCacheClass?.backClass);
        shiftPressed ? currentPiece.setClass('backClass', nextCacheClass?.topClass) : currentPiece.setClass('backClass', nextCacheClass?.bottomClass);
        currentPiece.setClass('leftClass', nextCacheClass?.leftClass);
        currentPiece.setClass('rightClass', nextCacheClass?.rightClass);

        this.setPieceValueOnTimeout({
          currentPiece,
          nextCacheColors,
          shiftPressed,
          faceInverted: true,
          rotateAxle: 'pieceRotateX',
          pieceRotateAxle: 'rotateX'
        })
      }, 500);
    })
  }

  public topPiecesMovement(movementType?: 'shift') {
    const shiftPressed = movementType === 'shift';
    const pieceIds = [1, 2, 3, 6, 9, 8, 7, 4];
    const pieces = this.pieces.filter(piece => pieceIds.includes(piece.getId()));

    const cachePieceColor = pieces.map(piece => {
      return {
        id: piece.getId(), 
        colors: piece.getData("colors")
      }
    });

    const cacheClass = pieces.map(piece => {
      return {
        id: piece.getId(),
        backClass: piece.getClass("backClass"),
        frontClass: piece.getClass("frontClass"),
        bottomClass: piece.getClass("bottomClass"),
        leftClass: piece.getClass("leftClass"),
        rightClass: piece.getClass("rightClass"),
        topClass: piece.getClass("topClass"),
      }
    })

    pieceIds.forEach((pieceId, index) => {
      const currentPiece = pieces.find(piece => piece.getId() === pieceId) as Piece;
      const { topX, topY, topZ } = currentPiece.getTopLinkedTransformOrigins();
      const nextPiece = pieces.find(_piece => {
        const nextIndex = (shiftPressed ? index + 2 : (index - 2 + pieceIds.length)) % pieceIds.length;
        return _piece.getId() === pieceIds[nextIndex];
      });
      const nextCacheColors = cachePieceColor.find(cacheColor => 
        cacheColor.id === nextPiece?.getId())?.colors as string & PieceColors[];

      currentPiece.setStyle("transition", .5);
      currentPiece.setStyle("transformOriginX", topX);
      currentPiece.setStyle("transformOriginY", topY);
      currentPiece.setStyle("transformOriginZ", topZ);
      currentPiece.setStyle(
        "rotateY", 
        this.getRotateWithInvertedRotation({shiftPressed, faceInverted: true, rotate: currentPiece.getStyle("rotateY")})
      );

      setTimeout(() => {
        const nextCacheClass = cacheClass.find(cacheClass =>
          cacheClass.id === nextPiece?.getId())

        shiftPressed ? currentPiece.setClass('rightClass', nextCacheClass?.frontClass) : currentPiece.setClass('rightClass', nextCacheClass?.backClass);
        shiftPressed ? currentPiece.setClass('frontClass', nextCacheClass?.leftClass) : currentPiece.setClass('frontClass', nextCacheClass?.rightClass);
        shiftPressed ? currentPiece.setClass('leftClass', nextCacheClass?.backClass) : currentPiece.setClass('leftClass', nextCacheClass?.frontClass);
        shiftPressed ? currentPiece.setClass('backClass', nextCacheClass?.rightClass) : currentPiece.setClass('backClass', nextCacheClass?.leftClass);
        currentPiece.setClass('bottomClass', nextCacheClass?.bottomClass);
        currentPiece.setClass('topClass', nextCacheClass?.topClass);

        this.setPieceValueOnTimeout({
          currentPiece,
          nextCacheColors,
          shiftPressed,
          faceInverted: true,
          rotateAxle: 'pieceRotateY',
          pieceRotateAxle: 'rotateY'
        })
      }, 500);
    })
  }

  public frontPiecesMovement(movementType?: 'shift') {
    const shiftPressed = movementType === 'shift';
    const pieceIds = [3, 2, 1, 10, 18, 19, 20, 12];
    const pieces = this.pieces.filter(piece => pieceIds.includes(piece.getId()));

    const cachePieceColor = pieces.map(piece => {
      return {
        id: piece.getId(), 
        colors: piece.getData("colors")
      }
    });

    const cacheClass = pieces.map(piece => {
      return {
        id: piece.getId(),
        backClass: piece.getClass("backClass"),
        frontClass: piece.getClass("frontClass"),
        bottomClass: piece.getClass("bottomClass"),
        leftClass: piece.getClass("leftClass"),
        rightClass: piece.getClass("rightClass"),
        topClass: piece.getClass("topClass"),
      }
    })


    pieceIds.forEach((pieceId, index) => {
      const currentPiece = pieces.find(piece => piece.getId() === pieceId) as Piece;
      const { frontX, frontY, frontZ } = currentPiece.getFrontLinkedTransformOrigins();
      const nextPiece = pieces.find(_piece => {
        const nextIndex = (shiftPressed ? index + 2 : (index - 2 + pieceIds.length)) % pieceIds.length;
        return _piece.getId() === pieceIds[nextIndex];
      });
      const nextCacheColors = cachePieceColor.find(cacheColor => 
        cacheColor.id === nextPiece?.getId())?.colors as string & PieceColors[];

      currentPiece.setStyle("transition", .5);
      currentPiece.setStyle("transformOriginX", frontX);
      currentPiece.setStyle("transformOriginY", frontY);
      currentPiece.setStyle("transformOriginZ", frontZ);
      currentPiece.setStyle(
        "rotateZ", 
        this.getRotateWithInvertedRotation({shiftPressed, rotate: currentPiece.getStyle("rotateZ")})
      );

      setTimeout(() => {
        const nextCacheClass = cacheClass.find(cacheClass =>
          cacheClass.id === nextPiece?.getId())
        
        shiftPressed ? currentPiece.setClass('leftClass', nextCacheClass?.topClass) : currentPiece.setClass('leftClass', nextCacheClass?.bottomClass);
        shiftPressed ? currentPiece.setClass('bottomClass', nextCacheClass?.leftClass) : currentPiece.setClass('bottomClass', nextCacheClass?.rightClass);
        shiftPressed ? currentPiece.setClass('rightClass', nextCacheClass?.bottomClass) : currentPiece.setClass('rightClass', nextCacheClass?.topClass);
        shiftPressed ? currentPiece.setClass('topClass', nextCacheClass?.rightClass) : currentPiece.setClass('topClass', nextCacheClass?.leftClass);
        currentPiece.setClass('frontClass', nextCacheClass?.frontClass);
        currentPiece.setClass('backClass', nextCacheClass?.backClass);

        this.setPieceValueOnTimeout({
          currentPiece,
          nextCacheColors,
          shiftPressed,
          rotateAxle: 'pieceRotateZ',
          pieceRotateAxle: 'rotateZ'
        })
      }, 500);
    })
  }

  public bottomPiecesMovement(movementType?: 'shift') {
    const shiftPressed = movementType === 'shift';
    const pieceIds = [20, 19, 18, 21, 24, 25, 26, 23];
    const pieces = this.pieces.filter(piece => pieceIds.includes(piece.getId()));

    const cachePieceColor = pieces.map(piece => {
      return {
        id: piece.getId(), 
        colors: piece.getData("colors")
      }
    });

    const cacheClass = pieces.map(piece => {
      return {
        id: piece.getId(),
        backClass: piece.getClass("backClass"),
        frontClass: piece.getClass("frontClass"),
        bottomClass: piece.getClass("bottomClass"),
        leftClass: piece.getClass("leftClass"),
        rightClass: piece.getClass("rightClass"),
        topClass: piece.getClass("topClass"),
      }
    })


    pieceIds.forEach((pieceId, index) => {
      const currentPiece = pieces.find(piece => piece.getId() === pieceId) as Piece;
      const { bottomX, bottomY, bottomZ } = currentPiece.getBottomLinkedTransformOrigins();
      const nextPiece = pieces.find(_piece => {
        const nextIndex = (shiftPressed ? index + 2 : (index - 2 + pieceIds.length)) % pieceIds.length;
        return _piece.getId() === pieceIds[nextIndex];
      });
      const nextCacheColors = cachePieceColor.find(cacheColor => 
        cacheColor.id === nextPiece?.getId())?.colors as string & PieceColors[];

      currentPiece.setStyle("transition", .5);
      currentPiece.setStyle("transformOriginX", bottomX);
      currentPiece.setStyle("transformOriginY", bottomY);
      currentPiece.setStyle("transformOriginZ", bottomZ);
      currentPiece.setStyle(
        "rotateY", 
        this.getRotateWithInvertedRotation({shiftPressed, rotate: currentPiece.getStyle("rotateY")})
      );

      setTimeout(() => {
        const nextCacheClass = cacheClass.find(cacheClass =>
          cacheClass.id === nextPiece?.getId())
        
        shiftPressed ? currentPiece.setClass('leftClass', nextCacheClass?.frontClass) : currentPiece.setClass('leftClass', nextCacheClass?.backClass);
        shiftPressed ? currentPiece.setClass('backClass', nextCacheClass?.leftClass) : currentPiece.setClass('backClass', nextCacheClass?.rightClass);
        shiftPressed ? currentPiece.setClass('rightClass', nextCacheClass?.backClass) : currentPiece.setClass('rightClass', nextCacheClass?.frontClass);
        shiftPressed ? currentPiece.setClass('frontClass', nextCacheClass?.rightClass) : currentPiece.setClass('frontClass', nextCacheClass?.leftClass);
        currentPiece.setClass('topClass', nextCacheClass?.topClass);
        currentPiece.setClass('bottomClass', nextCacheClass?.bottomClass);

        this.setPieceValueOnTimeout({
          currentPiece,
          nextCacheColors,
          shiftPressed,
          rotateAxle: 'pieceRotateY',
          pieceRotateAxle: 'rotateY'
        })
      }, 500);
    })
  }

  public rightPiecesMovement(movementType?: 'shift') {
    const shiftPressed = movementType === 'shift';
    const pieceIds = [1, 4, 7, 15, 24, 21, 18, 10];
    const pieces = this.pieces.filter(piece => pieceIds.includes(piece.getId()));

    const cachePieceColor = pieces.map(piece => {
      return {
        id: piece.getId(), 
        colors: piece.getData("colors")
      }
    });

    const cacheClass = pieces.map(piece => {
      return {
        id: piece.getId(),
        backClass: piece.getClass("backClass"),
        frontClass: piece.getClass("frontClass"),
        bottomClass: piece.getClass("bottomClass"),
        leftClass: piece.getClass("leftClass"),
        rightClass: piece.getClass("rightClass"),
        topClass: piece.getClass("topClass"),
      }
    })


    pieceIds.forEach((pieceId, index) => {
      const currentPiece = pieces.find(piece => piece.getId() === pieceId) as Piece;
      const { rightX, rightY, rightZ } = currentPiece.getRightLinkedTransformOrigins();
      const nextPiece = pieces.find(_piece => {
        const nextIndex = (shiftPressed ? index + 2 : (index - 2 + pieceIds.length)) % pieceIds.length;
        return _piece.getId() === pieceIds[nextIndex];
      });
      const nextCacheColors = cachePieceColor.find(cacheColor => 
        cacheColor.id === nextPiece?.getId())?.colors as string & PieceColors[];

      currentPiece.setStyle("transition", .5);
      currentPiece.setStyle("transformOriginX", rightX);
      currentPiece.setStyle("transformOriginY", rightY);
      currentPiece.setStyle("transformOriginZ", rightZ);
      currentPiece.setStyle(
        "rotateX", 
        this.getRotateWithInvertedRotation({shiftPressed, rotate: currentPiece.getStyle("rotateX")})
      );

      setTimeout(() => {
        const nextCacheClass = cacheClass.find(cacheClass =>
          cacheClass.id === nextPiece?.getId())
        
        shiftPressed ? currentPiece.setClass('topClass', nextCacheClass?.backClass) : currentPiece.setClass('topClass', nextCacheClass?.frontClass);
        shiftPressed ? currentPiece.setClass('backClass', nextCacheClass?.bottomClass) : currentPiece.setClass('backClass', nextCacheClass?.topClass);
        shiftPressed ? currentPiece.setClass('bottomClass', nextCacheClass?.frontClass) : currentPiece.setClass('bottomClass', nextCacheClass?.backClass);
        shiftPressed ? currentPiece.setClass('frontClass', nextCacheClass?.topClass) : currentPiece.setClass('frontClass', nextCacheClass?.bottomClass);
        currentPiece.setClass('leftClass', nextCacheClass?.leftClass);
        currentPiece.setClass('rightClass', nextCacheClass?.rightClass);

        this.setPieceValueOnTimeout({
          currentPiece,
          nextCacheColors,
          shiftPressed,
          rotateAxle: 'pieceRotateX',
          pieceRotateAxle: 'rotateX'
        })
      }, 500);
    })
  }

  private setPieceValueOnTimeout({ currentPiece, nextCacheColors, shiftPressed, faceInverted, rotateAxle, pieceRotateAxle }: SetPieceValueOnTimeoutProps) {
    currentPiece.setData("colors", nextCacheColors);
    currentPiece.setStyle(
      rotateAxle, 
      this.getRotateWithInvertedRotation({shiftPressed, faceInverted, rotate: currentPiece.getStyle(rotateAxle)})
    );

    currentPiece.setStyle("transformOriginX", 0);
    currentPiece.setStyle("transformOriginY", 0);
    currentPiece.setStyle("transformOriginZ", 0);
    currentPiece.setStyle("transition", 0)
    currentPiece.setStyle(pieceRotateAxle, 0);
  }

  private getRotateWithInvertedRotation({ shiftPressed, faceInverted = false, rotate }: { shiftPressed: boolean, faceInverted?: boolean, rotate: number }) {
    return faceInverted ? shiftPressed ? rotate + 90 : rotate - 90 : shiftPressed ? rotate - 90 : rotate + 90;
  }


  public getColor(key: RubicksCube3x3ColorsKeys) {
    return this.colors[key]
  }

  public setColor(key: RubicksCube3x3ColorsKeys, value: string) {
    this.colors[key] = value;
  }

  public getAllColor() {
    return this.colors
  }

  public setAllColor(colors: RubicksCube3x3Colors) {
    this.colors = colors;
  }
  
  public getStyle(key: RubicksCube3x3StylesKeys) {
    const style = this.styles[key] as number;
    return style;
  }

  public setStyle(key: RubicksCube3x3StylesKeys, value: number) {
    this.styles[key] = value;
  }

  public getAllStyle() {
    return this.styles
  }

  public setAllStyle(value: RubicksCube3x3Styles) {
    this.styles = value;
  }

  public getRotateAxle(key: RubicksCube3x3RotateAxleKeys) {
    return this.rotateAxle[key]
  }

  public setRotateAxle(key: RubicksCube3x3RotateAxleKeys, value: RotateAxleValues) {
    this.rotateAxle[key] = value;
  }

  public getAllRotateAxle() {
    return this.rotateAxle
  }

  public setAllRotateAxle(value: RubicksCube3x3RotateAxle) {
    this.rotateAxle = value;
  }

  public getPieces() {
    return this.pieces;
  }

  public setPieces(pieces: Piece[]) {
    for (const piece of pieces) {
      this.pieces.push(piece);
    }
  }
}