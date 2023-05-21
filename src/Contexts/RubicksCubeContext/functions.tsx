import { GetNewFacePieces, GetNewLayerPiecesProps, GetNewPiecesProps, GetOldPiecesWithRotationProps } from "../../types/index";

export function getNewPieces({
  pieces,
  centerPieces,
  middlePieces,
  cornerPieces,
  movementType,
  faceColor,
  rotateAxle,
  rotateMovementType,
}: GetNewPiecesProps) {
  const isTop = movementType === "top";
  const newPiecesFace = getNewFacePieces({
    isTopMovement: rotateMovementType === 'top',
    isBottomMovement: rotateMovementType === 'bottom',
    isRightMovement: rotateMovementType === 'right',
    isLeftMovement: rotateMovementType === 'left',
    isBackMovement: rotateMovementType === 'back',
    isFrontMovement: rotateMovementType === 'front',
    pieces,
    isTop,
  });

  const newPieces = pieces.map((piece) => {
    const { data: { type, colors, faces }, faceRotate } = piece;
    if(!colors.includes(faceColor)) return piece;

    const accountValue = isTop ? faceRotate[rotateAxle] - 90 : faceRotate[rotateAxle] + 90;
    const typePieceConfig = type === 'corner' ? cornerPieces : 
      type === 'middle' ? middlePieces : centerPieces
    ;
    const pieceConfig = typePieceConfig.find((config) => {
      const colorss = colors.sort();
      const configColors = config.colors.sort();
      const colorsEquals = JSON.stringify(colorss) === JSON.stringify(configColors);
      
      if (!colorsEquals) return;
      return config;
    });

    const newPieceFace = newPiecesFace.find((pieceFace) => pieceFace.id === piece.id);

    const newRotate = {
      ...faceRotate
    }

    newRotate[rotateAxle] = accountValue
    
    return {
      ...piece, 
      transformOrigin: pieceConfig ? pieceConfig.transformOrigin : piece.transformOrigin,
      rotate: newRotate,
      data: { ...piece.data, faces: newPieceFace?.faces ? newPieceFace.faces : faces }
    }
  });

  return newPieces;
}

function getNewFacePieces({
  isTopMovement,
  isBottomMovement,
  isRightMovement,
  isLeftMovement,
  isBackMovement,
  isFrontMovement,
  pieces,
  isTop,
}: GetNewFacePieces) {
  const newFacePieces = pieces.map((piece) => { 
      return { id: piece.id, colors: piece.data.colors, faces: piece.data.faces, type: piece.data.type } 
    }).map((facePiece) => {
      const { type, faces } = facePiece;
      // Arrumar essa lógica, tem alguns errados
      if (isTopMovement && faces.includes('yellow')) {
        if (type === 'corner') {
          if (faces.includes('red') && faces.includes('green')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green') && faces.includes('orange')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('orange') && faces.includes('blue')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('red')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue') && faces.includes('red')) {
            const newPositionColors = 
            isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('green')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          }
        } else if (type === 'middle') {
          if (faces.includes('red')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue')
            )?.data.faces : 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red')
            )?.data.faces : 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('orange')) {
            const newPositionColors = isTop ? 
              pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green')
            )?.data.faces : 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange')
            )?.data.faces : 
            pieces.find((_piece) => 
              _piece.data.faces.includes('yellow') &&
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          }
        }
        return facePiece;
      } else if (isBottomMovement && faces.includes('white')) {
        if (type === 'corner') {
          if (faces.includes('green') && faces.includes('red')) {
            const newPositionColors = isTop ? 
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue')
            )?.data.faces : 
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green') && faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('orange') && faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('red')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('red') && faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('red')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          }
        } else if (type === 'middle') {
          if (faces.includes('red')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
            _piece.data.type === 'middle' &&
            _piece.data.faces.includes('white') && 
            _piece.data.faces.includes('blue')
          )?.data.faces :
          pieces.find((_piece) => 
            _piece.data.type === 'middle' &&
            _piece.data.faces.includes('white') && 
            _piece.data.faces.includes('green')
          )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('green')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('blue')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('red')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          }
        }
        return facePiece;
      } else if (isRightMovement && faces.includes('green')) {
        if (type === 'corner') {
          if (faces.includes('yellow') && faces.includes('red')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('yellow') && faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('white') && faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('white')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('white') && faces.includes('red')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('red')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          }
        } else if (type === 'middle') {
          if (faces.includes('yellow')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('red')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('red')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          }
        }
        return facePiece;
      } else if (isLeftMovement && faces.includes('blue')) {
        if (type === 'corner') {
          if (faces.includes('yellow') && faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('yellow') && faces.includes('red')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('red') && faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('red')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('orange') && faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('white')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          }
        } else if (type === 'middle') {
          if (faces.includes('orange')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('yellow')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('red')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('orange')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('red')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('orange')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('red')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          }
        }
        return facePiece;
      } else if (isBackMovement && faces.includes('orange')) {
        if (type === 'corner') {
          if (faces.includes('green') && faces.includes('yellow')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('yellow') && 
              _piece.data.faces.includes('blue')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('yellow') && faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue') && faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green') && faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          }
        } else if (type === 'middle') {
          if (faces.includes('green')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('white')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('yellow')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('green')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('orange') && 
              _piece.data.faces.includes('blue')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          }
        }
        return facePiece;
      } else if (isFrontMovement && faces.includes('red')) { // Parei aquii
        if (type === 'corner') {
          if (faces.includes('green') && faces.includes('yellow')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('white')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('yellow') && faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue') && faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('white') && 
              _piece.data.faces.includes('green')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green') && faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('green') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'corner' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue') && 
              _piece.data.faces.includes('white')
            )?.data.faces;

            return { ...facePiece, faces: newPositionColors }
          }
        } else if (type === 'middle') {
          if (faces.includes('yellow')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('green')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('blue')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('white')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('white')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('green')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('blue')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          } else if (faces.includes('green')) {
            const newPositionColors = isTop ? pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('yellow')
            )?.data.faces :
            pieces.find((_piece) => 
              _piece.data.type === 'middle' &&
              _piece.data.faces.includes('red') && 
              _piece.data.faces.includes('white')
            )?.data.faces;
            
            return { ...facePiece, faces: newPositionColors }
          }
        }
        return facePiece;
      }
      
      return facePiece;
    })
  ;

  return newFacePieces;
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
    .filter((piece) => piece.data.colors.includes(topFaceColor))
    .map((thirdLayerPiece) => { 
      return { ...thirdLayerPiece, data: { ...thirdLayerPiece.data, layer: "third" } } 
    })
  ;
  const newFirstLayerPieces = pieces
    .filter((piece) => piece.data.colors.includes(bottomFaceColor))
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
  newPieces,
  movementTypeColor,
  isTop,
  rotateAxle
}: GetOldPiecesWithRotationProps) {
  const newPiecesPosition = newPieces.map((newPiece) => { // preciso percorrer o newPieces, as peças de outras faces estao voltando para o valor original
    if (!newPiece.data.colors.includes(movementTypeColor)) return newPiece;

    const mergedPiece = newPieces.map((piece) => {
      const currentNewPiece = newPieces.find((currentNewPiece) => 
        currentNewPiece.id === newPiece.id
      );
      const currentOldPiece = oldPieces.find((currentOldPiece) => 
        currentOldPiece.id === newPiece.id
      );
      
      if (!currentNewPiece || !currentOldPiece) return piece;
      
      const oldPieceOnNewPosition = oldPieces.find((oldPieceOnNewPosition) => 
        JSON.stringify(oldPieceOnNewPosition.data.faces.sort()) ===
        JSON.stringify(currentNewPiece.data.faces.sort())
      );
      // const newRotate = { // Colocar validação de + ou - 90
      //   x: currentNewPiece.pieceRotate.x + 90,
      //   y: currentNewPiece.pieceRotate.y,
      //   z: currentNewPiece.pieceRotate.z
      // };
      const accountValue = isTop ? piece.pieceRotate[rotateAxle] - 90 : piece.pieceRotate[rotateAxle] + 90;
      const newRotate = {
        ...currentNewPiece.pieceRotate
      };

      newRotate[rotateAxle] = accountValue;

      if (!oldPieceOnNewPosition) return piece;

      return {
        ...currentOldPiece,
        translate: oldPieceOnNewPosition.translate, 
        pieceRotate: newRotate,
        data: {
          ...currentOldPiece.data,
          layer: currentNewPiece.data.layer,
          faces: currentNewPiece.data.faces
        },
      }
    })

    if (!mergedPiece) return newPiece

    return mergedPiece[0]
  });

  return newPiecesPosition;
}