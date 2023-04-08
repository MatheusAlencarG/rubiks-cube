/* eslint-disable array-callback-return */
import React, { useState } from "react";

import { Context, INITIAL_STATE } from "./Context";
import { getNewFaceColor, getNewLayerPieces, getNewPieces, getOldPiecesWithRotation } from "./functions";
import { Piece, RubicksCubeContextProps, SetInfoCubeProps } from "../../types/index";

function RubicksCubeContext({ children }: RubicksCubeContextProps) {
  const [ rubicksCubeState, setRubicksCubeState ] = useState(INITIAL_STATE.rubicksCubeState);
  const [ mustSetPieceMovement, setMustSetPieceMovement ] = useState<boolean>(true);
  const { 
    cube: { 
      pieces, 
      bottomFace, 
      backFace, 
      leftFace, 
      rightFace, 
      topFace, 
      frontFace, 
      rotate: currentRotate 
    } 
  } = rubicksCubeState;

  function horizontalCubeMovement(movementType: string) {
    const isLeft = movementType === "left";
    const yellowIsRight = rightFace.color === 'yellow';
    const yellowIsLeft = leftFace.color === 'yellow';
    const yellowIsBottom = bottomFace.color === 'yellow';
    const accountValue = isLeft ? currentRotate.y - 90 : currentRotate.y + 90;

    const newFaceColor = getNewFaceColor({
      isLeft, 
      yellowIsRight, 
      yellowIsLeft, 
      yellowIsBottom, 
      frontFace: frontFace.color, 
      backFace: backFace.color, 
      leftFace: leftFace.color, 
      rightFace: rightFace.color, 
      topFace: topFace.color, 
      bottomFace: bottomFace.color,
    })

    const newLayerPieces = getNewLayerPieces({
      pieces,
      topFaceColor: newFaceColor.topFaceColor,
      bottomFaceColor: newFaceColor.bottomFaceColor,
    })

    const newRotate = {
      ...currentRotate,
      y: accountValue,
    }

    setCubeMovementInfo({ cube: { faceColor: newFaceColor, rotate: newRotate, pieces: newLayerPieces } });
  }

  function verticalCubeMovement(movementType: string) {
    const isTop = movementType === "top";
    const accountValue = isTop ? currentRotate.z - 90 : currentRotate.z + 90;

    const newFaceColor = {
      topFaceColor: isTop ? rightFace.color : leftFace.color,
      bottomFaceColor: isTop ? leftFace.color : rightFace.color,
      leftFaceColor: isTop ? topFace.color : bottomFace.color,
      rightFaceColor: isTop ? bottomFace.color : topFace.color,
      frontFaceColor: frontFace.color,
      backFaceColor: backFace.color,
    }
    const newLayerPieces = getNewLayerPieces({
      pieces,
      topFaceColor: newFaceColor.topFaceColor,
      bottomFaceColor: newFaceColor.bottomFaceColor,
    })
    const newRotate = {
      ...currentRotate,
      z: accountValue
    }

    setCubeMovementInfo({ cube: { faceColor: newFaceColor, rotate: newRotate, pieces: newLayerPieces } });
  }

  function setCubeMovementInfo({
    cube: {
      faceColor: {
        topFaceColor = topFace.color,
        bottomFaceColor = bottomFace.color,
        leftFaceColor = leftFace.color,
        rightFaceColor = rightFace.color,
        frontFaceColor = frontFace.color,
        backFaceColor = backFace.color,
      },
      rotate = currentRotate,
      pieces
    }
  }: SetInfoCubeProps) {
    setRubicksCubeState({
      ...rubicksCubeState,
      cube: {
        ...rubicksCubeState.cube,
        topFace: { ...topFace, color: topFaceColor },
        bottomFace: { ...bottomFace, color: bottomFaceColor },
        leftFace: { ...leftFace, color: leftFaceColor },
        rightFace: { ...rightFace, color: rightFaceColor },
        frontFace: { ...frontFace, color: frontFaceColor },
        backFace: { ...backFace, color: backFaceColor },
        rotate,
        pieces: pieces
      }
    })
  }

  async function rightPiecesMovement(movementType: string) {
    const { centerPieces, middlePieces, cornerPieces, rotateAxle, faceColor: { color } } = rightFace;

    const newPieces = getNewPieces({
      pieces,
      centerPieces,
      middlePieces,
      cornerPieces,
      movementType,
      faceColor: color,
      rotateAxle,
      rotateMovementType: 'right',
    });

    setPieceMovement(newPieces, 'green', movementType, rotateAxle);

  }

  async function leftPiecesMovement(movementType: string) {
    const { centerPieces, middlePieces, cornerPieces, rotateAxle, faceColor: { color } } = leftFace;

    const newPieces = getNewPieces({
      pieces,
      centerPieces,
      middlePieces,
      cornerPieces,
      movementType,
      faceColor: color,
      rotateAxle,
      rotateMovementType: 'left',
    });

    setPieceMovement(newPieces, 'blue', movementType, rotateAxle);

  }

  async function topPiecesMovement(movementType: string) {
    const { centerPieces, middlePieces, cornerPieces, rotateAxle, faceColor: { color } } = topFace;

    const newPieces = getNewPieces({
      pieces,
      centerPieces,
      middlePieces,
      cornerPieces,
      movementType,
      faceColor: color,
      rotateAxle,
      rotateMovementType: 'top',
    });

    setPieceMovement(newPieces, 'yellow', movementType, rotateAxle);

  }

  async function bottomPiecesMovement(movementType: string) {
    const { centerPieces, middlePieces, cornerPieces, rotateAxle, faceColor: { color } } = bottomFace;

    const newPieces = getNewPieces({
      pieces,
      centerPieces,
      middlePieces,
      cornerPieces,
      movementType,
      faceColor: color,
      rotateAxle,
      rotateMovementType: 'bottom',
    });

        setPieceMovement(newPieces, 'white', movementType, rotateAxle);

  }

  async function frontPiecesMovement(movementType: string) {
    const { centerPieces, middlePieces, cornerPieces, rotateAxle, faceColor: { color } } = frontFace;

    const newPieces = getNewPieces({
      pieces,
      centerPieces,
      middlePieces,
      cornerPieces,
      movementType,
      faceColor: color,
      rotateAxle,
      rotateMovementType: 'front',
    });

    setPieceMovement(newPieces, 'red', movementType, rotateAxle);
  }

  function backPiecesMovement(movementType: string) {
    const { centerPieces, middlePieces, cornerPieces, rotateAxle, faceColor: { color } } = backFace;

    const newPieces = getNewPieces({
      pieces,
      centerPieces,
      middlePieces,
      cornerPieces,
      movementType,
      faceColor: color,
      rotateAxle,
      rotateMovementType: 'back',
    });

    setPieceMovement(newPieces, 'orange', movementType, rotateAxle);
  }

  function setPieceMovement(newPieces: Piece[], movementTypeColor: string, movementType: string, rotateAxle: 'x' | 'y' | 'z') {
    if(!mustSetPieceMovement) return;

    setMustSetPieceMovement(false);

    setRubicksCubeState({ cube: { ...rubicksCubeState.cube, pieces: newPieces } });

    setTimeout(() => {
      const oldPieces = INITIAL_STATE.rubicksCubeState.cube.pieces;

      const oldPiecesWithRotation = getOldPiecesWithRotation({
        oldPieces,
        newPieces,
        movementTypeColor,
        rotateAxle,
        isTop: movementType === 'top'
      });

      setRubicksCubeState({ cube: { ...rubicksCubeState.cube, pieces: oldPiecesWithRotation } });

      setMustSetPieceMovement(true);
    }, 500);
  }

  /*
    Para deixar customizado os dados do cubo, fazer uma função onde recebe 
    um objeto com os dados a ser alterado e nesse aquivo fazer a regra de negócio
  */

  return(
    <Context.Provider value={{
      rubicksCubeState,
      horizontalCubeMovement,
      verticalCubeMovement,
      rightPiecesMovement,
      leftPiecesMovement,
      topPiecesMovement,
      bottomPiecesMovement,
      frontPiecesMovement,
      backPiecesMovement,
    }}>
      {children}
    </Context.Provider>
  )
}

export default RubicksCubeContext;
