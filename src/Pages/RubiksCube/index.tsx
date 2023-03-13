/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useContext, useEffect } from "react";
import "./styles.css";
import classNames from "classnames";

import { Context } from "../../Contexts/RubicksCubeContext/Context";
import { RenderPieceFaceProps } from "./RubiksCubeTypes";
import { Cube, Piece, PieceFace, CubeContainer } from "./styles";

var keyPressed: any = {};

function RubicksCube() {
  const { 
    rubicksCubeState: { cube }, 
    horizontalCubeMovement,
    verticalCubeMovement,
    rightPiecesMovement,
    leftPiecesMovement,
    topPiecesMovement,
    bottomPiecesMovement,
    frontPiecesMovement,
    backPiecesMovement,
    // minhaFuncaoPrincipal
  } = useContext(Context);
  
  console.log('cube', cube);
  
  function renderPieceFace({ pieceFaceType, piece }: RenderPieceFaceProps): ReactNode {
    const pieceFaceClassName = classNames(pieceFaceType);
    return <PieceFace
      className={pieceFaceClassName}
      widthCustom={piece.faces.width}
      heightCustom={piece.faces.height}
      lineHeight={piece.faces.lineHeight}
      translateZ={piece.faces.translate.z}
      pieceRadius={cube.pieceRadius}
    >{pieceFaceType}</PieceFace>
  }

  function keydownListener(event: KeyboardEvent) {
    keyPressed[event.key] = true;
    console.log('keyPressed', keyPressed, event.key);

    switch (true) {
      case keyPressed['ArrowLeft']:
        horizontalCubeMovement('left');
        keyPressed = {};
        break;
      case keyPressed['ArrowRight']:
        horizontalCubeMovement('right');
        keyPressed = {};
        break;
      case keyPressed['ArrowUp']:
        verticalCubeMovement('top');
        keyPressed = {};
        break;
      case keyPressed['ArrowDown']:
        verticalCubeMovement('bottom');
        keyPressed = {};
        break;
      case keyPressed['Shift'] && keyPressed['W']:
        frontPiecesMovement('top');
        delete keyPressed['W'];
        break;
      case keyPressed['Shift'] && keyPressed['A']:
        leftPiecesMovement('bottom');
        delete keyPressed['A'];
        break;
      case keyPressed['Shift'] && keyPressed['S']:
        backPiecesMovement('bottom');
        delete keyPressed['S'];
        break;
      case keyPressed['Shift'] && keyPressed['D']:
        rightPiecesMovement('top');
        delete keyPressed['D'];
        break;
      case keyPressed['Shift'] && keyPressed['Q']:
        topPiecesMovement('bottom');
        delete keyPressed['Q'];
        break;
      case keyPressed['Shift'] && keyPressed['E']:
        bottomPiecesMovement('top');
        delete keyPressed['E'];
        break;
      case keyPressed['w']:
        frontPiecesMovement('bottom');
        keyPressed = {};
        break;
      case keyPressed['a']:
        leftPiecesMovement('top');
        keyPressed = {};
        break;
      case keyPressed['s']:
        backPiecesMovement('top');
        keyPressed = {};
        break;
      case keyPressed['d']:
        rightPiecesMovement('bottom');
        keyPressed = {};
        break;
      case keyPressed['q']:
        topPiecesMovement('top');
        keyPressed = {};
        break;
      case keyPressed['e']:
        bottomPiecesMovement('bottom');
        keyPressed = {};
        break;
      case keyPressed['Shift']:
        break;
      default:
        keyPressed = {};
        break;
    }
  }

  function removeShift(event: KeyboardEvent) {
    const key = event.key;
    if(key === 'Shift') {
      delete keyPressed['Shift'];
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", keydownListener);
    document.addEventListener("keyup", removeShift);
    
    return () => {
      document.removeEventListener('keydown', keydownListener);
      document.addEventListener("keyup", removeShift);
    };
  }, [cube])

  return(
    <CubeContainer className="rubicksCubeContainer">
      <Cube 
        widthCustom={cube.width} 
        heightCustom={cube.height} 
        rotateX={cube.rotate.x} 
        rotateY={cube.rotate.y} 
        rotateZ={cube.rotate.z} 
        data-frontface={cube.frontFace.color} 
        data-backface={cube.backFace.color} 
        data-topface={cube.topFace.color} 
        data-bottomface={cube.bottomFace.color} 
        data-rightface={cube.rightFace.color} 
        data-leftface={cube.leftFace.color} 
      >
        {cube.pieces.map((piece, index) => (
          <Piece
            key={index}
            widthCustom={piece.width}
            heightCustom={piece.height}
            transformOriginX={piece.transformOrigin.x}
            transformOriginY={piece.transformOrigin.y}
            transformOriginZ={piece.transformOrigin.z}
            translateX={piece.translate.x}
            translateY={piece.translate.y}
            translateZ={piece.translate.z}
            rotateX={piece.rotate.x}
            rotateY={piece.rotate.y}
            rotateZ={piece.rotate.z}
            topFaceColor={cube.topFace.faceColor.hexadecimal}
            bottomFaceColor={cube.bottomFace.faceColor.hexadecimal}
            leftFaceColor={cube.leftFace.faceColor.hexadecimal}
            rightFaceColor={cube.rightFace.faceColor.hexadecimal}
            frontFaceColor={cube.frontFace.faceColor.hexadecimal}
            backFaceColor={cube.backFace.faceColor.hexadecimal}
            data-layer={piece.data.layer}
            data-firstcolor={piece.data.colors.firstColor.color}
            data-secondcolor={piece.data.colors.secondColor?.color}
            data-thirdcolor={piece.data.colors.thirdColor?.color}
            data-firstcolorface={piece.data.colors.firstColor.face}
            data-secondcolorface={piece.data.colors.secondColor?.face}
            data-thirdcolorface={piece.data.colors.thirdColor?.face}
            data-piecetype={piece.data.type}
          >
            {renderPieceFace({ pieceFaceType: 'front', piece })}
            {renderPieceFace({ pieceFaceType: 'back', piece })}
            {renderPieceFace({ pieceFaceType: 'right', piece })}
            {renderPieceFace({ pieceFaceType: 'left', piece })}
            {renderPieceFace({ pieceFaceType: 'top', piece })}
            {renderPieceFace({ pieceFaceType: 'bottom', piece })}
          </Piece>
        ))}
      </Cube>
    </CubeContainer>
  );
}

export default RubicksCube;
