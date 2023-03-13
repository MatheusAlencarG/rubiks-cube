import { GetNewLayerPiecesProps, GetNewPiecesProps, GetOldPiecesWithRotationProps } from "./RubicksCubeContextTypes";

export function getNewPieces({
  pieces,
  centerPieces,
  middlePieces,
  cornerPieces,
  movementType,
  faceColor,
  rotateAxle,
  typeMovement,
}: GetNewPiecesProps) {
  const newPieces = pieces.map((piece) => {
    const { data: { type, colors: { firstColor, secondColor, thirdColor } }, rotate } = piece;
      if(
        firstColor.face !== faceColor && 
        secondColor?.face !== faceColor && 
        thirdColor?.face !== faceColor
      ) return piece;

      const isTop = movementType === "top";
      const accountValue = isTop ? rotate[rotateAxle] - 90 : rotate[rotateAxle] + 90;
      const typePieceConfig = type === 'corner' ? cornerPieces : 
        type === 'middle' ? middlePieces : centerPieces
      ;
      const pieceConfig = typePieceConfig.find((config) => {
        const colors = [ firstColor.face, secondColor?.face, thirdColor?.face ].sort()
          .filter((color) => color !== null && color !== undefined);
        const configColors = config.colors.sort();
        const colorsEquals = JSON.stringify(colors) === JSON.stringify(configColors);
        
        if (!colorsEquals) return;
        return config
      });

      const isTopMovement = typeMovement === 'top';
      const isBottomMovement = typeMovement === 'bottom';
      const isRightMovement = typeMovement === 'right';
      const isLeftMovement = typeMovement === 'left';
      const isBackMovement = typeMovement === 'back';
      const isFrontMovement = typeMovement === 'front';
      const pieceColors = [ firstColor, secondColor, thirdColor ]
        .map((colorInfo) => colorInfo?.color)
        // .filter((color) => color !== null && color !== undefined)
      ;

      const newColors = [ firstColor, secondColor, thirdColor ]
        .map((colorInfo) => {
          return 
        })

      const newRotate = {
        ...rotate
      }

      newRotate[rotateAxle] = accountValue

      return { 
        ...piece, 
        transformOrigin: pieceConfig ? pieceConfig.transformOrigin : piece.transformOrigin,
        rotate: newRotate
        // data: { colors: }
      }
    })
  ;

  return newPieces;
}

export function getNewFaceColor({
  isLeft, 
  yellowIsRight, 
  yellowIsLeft, 
  yellowIsBottom, 
  frontFace, 
  backFace, 
  leftFace, 
  rightFace, 
  topFace, 
  bottomFace
}: any) {
  const newFaceColor = {
    topFaceColor: yellowIsRight ? (isLeft ? frontFace : backFace) : yellowIsLeft ? (isLeft ? backFace : frontFace) : yellowIsBottom ? topFace : topFace,
    bottomFaceColor: yellowIsRight ? (isLeft ? backFace : frontFace) : yellowIsLeft ? (isLeft ? frontFace : backFace) : yellowIsBottom ? bottomFace : bottomFace,
    leftFaceColor: yellowIsRight ? leftFace : yellowIsLeft ? leftFace : yellowIsBottom ? (!isLeft ? frontFace : backFace) : isLeft ? frontFace : backFace,
    rightFaceColor: yellowIsRight ? rightFace : yellowIsLeft ? rightFace : yellowIsBottom ? (!isLeft ? backFace : frontFace) : isLeft ? backFace : frontFace,
    frontFaceColor: yellowIsRight ? (isLeft ? bottomFace : topFace) : yellowIsLeft ? (isLeft ? topFace : bottomFace) : yellowIsBottom ? (!isLeft ? rightFace : leftFace) : (isLeft ? rightFace : leftFace),
    backFaceColor: yellowIsRight ? (isLeft ? topFace : bottomFace) : yellowIsLeft ? (isLeft ? bottomFace : topFace) : yellowIsBottom ? (!isLeft ? leftFace : rightFace) : (isLeft ? leftFace : rightFace)
  }
  return newFaceColor;
}

export function getNewLayerPieces({
  pieces,
  topFaceColor,
  bottomFaceColor,
}: GetNewLayerPiecesProps) {
  const newThirdLayerPieces = pieces
    .filter((piece) => 
      piece.data.colors.firstColor.color === topFaceColor || 
      piece.data.colors.secondColor?.color === topFaceColor || 
      piece.data.colors.thirdColor?.color === topFaceColor)
    .map((thirdLayerPiece) => { 
      return { ...thirdLayerPiece, data: { ...thirdLayerPiece.data, layer: "third" } } 
    })
  ;
  const newFirstLayerPieces = pieces
    .filter((piece) => 
      piece.data.colors.firstColor.color === bottomFaceColor || 
      piece.data.colors.secondColor?.color === bottomFaceColor || 
      piece.data.colors.thirdColor?.color === bottomFaceColor)
    .map((firstLayerPiece) => {
      return { ...firstLayerPiece, data: { ...firstLayerPiece.data, layer: "first" } } 
    })
  ;

  const newSecondLayerPieces = pieces
    .filter((piece) => {
      const othersLayersIds = [ ...newThirdLayerPieces, ...newFirstLayerPieces ].map((otherPiece) => otherPiece.id)

      if (othersLayersIds.includes(piece.id)) return;
      return piece;
    })
    .map((secondLayerPiece) => {
      return { ...secondLayerPiece, data: { ...secondLayerPiece.data, layer: "second" } } 
    })
  ;

  const newLayerPieces = 
    [ ...newThirdLayerPieces, ...newFirstLayerPieces, ...newSecondLayerPieces ]
    .sort((a, b) => a.id - b.id)
  ;

  return newLayerPieces;
}

export function getOldPiecesWithRotation({
  oldPieces,
  newPieces
}: GetOldPiecesWithRotationProps) {
  return oldPieces;
}