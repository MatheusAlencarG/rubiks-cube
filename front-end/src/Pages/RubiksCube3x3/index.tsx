/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useContext, useEffect } from "react";
import { Context } from "../../Contexts/RubicksCubeContext/CreateRubicksCube3x3Context";
import classNames from "classnames";
import "./styles.css"

import { RenderPieceFaceProps } from "../../types/index";

let keyPressed: any = {};

function RubicksCube() {
  const { rubicksCube3x3: { functions: {
    horizontalCubeMovement,
    verticalCubeMovement,
    rightPiecesMovement,
    topPiecesMovement,
    bottomPiecesMovement,
    frontPiecesMovement,
    leftPiecesMovement,
    backPiecesMovement,
  },
  cube,
}} = useContext(Context);
  
  console.log('rubicksCube3x3', cube);
  
  function renderPieceFace({
    pieceFaceType, 
    piece, 
    rotateX, 
    rotateY, 
    translateX, 
    translateY, 
    translateZ
  }: RenderPieceFaceProps): ReactNode {
    const pieceFaceClassName = classNames(pieceFaceType);
    const backgroundColor = 
      piece.getData("colors").includes('yellow') && pieceFaceType === 'top' ? cube.getColor("topColor") : 
      piece.getData("colors").includes('blue') && pieceFaceType === 'left' ? cube.getColor("leftColor") : 
      piece.getData("colors").includes('green') && pieceFaceType === 'right' ? cube.getColor("rightColor") : 
      piece.getData("colors").includes('white') && pieceFaceType === 'bottom' ? cube.getColor("bottomColor") : 
      piece.getData("colors").includes('orange') && pieceFaceType === 'back' ? cube.getColor("backColor") : 
      piece.getData("colors").includes('red') && pieceFaceType === 'front' ? cube.getColor("frontColor") : ''

    return <div
      className={`pieceFace ${pieceFaceClassName}`}
      style={{
        width: piece.getStyle("faceWidth"),
        height: piece.getStyle("faceHeight"),
        transform: `${translateX ? `translateX(${translateX}px)` : ''} ${translateY ? `translateY(${translateY}px)` : ''} ${translateZ ? `translateZ(${translateZ}px)` : ''} ${rotateX ? `rotateX(${rotateX}deg)` : ''} ${rotateY ? `rotateY(${rotateY}deg)` : ''}`,
        borderRadius: cube.getStyle("pieceRadius"),
        backgroundColor,
      }}
    />
  }

  function keydownListener(event: KeyboardEvent) {
    keyPressed[event.key] = true;

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
        frontPiecesMovement('shift');
        delete keyPressed['W'];
        break;
      case keyPressed['Shift'] && keyPressed['A']:
        leftPiecesMovement('shift');
        delete keyPressed['A'];
        break;
      case keyPressed['Shift'] && keyPressed['S']:
        backPiecesMovement('shift');
        delete keyPressed['S'];
        break;
      case keyPressed['Shift'] && keyPressed['D']:
        rightPiecesMovement('shift');
        delete keyPressed['D'];
        break;
      case keyPressed['Shift'] && keyPressed['Q']:
        topPiecesMovement('shift');
        delete keyPressed['Q'];
        break;
      case keyPressed['Shift'] && keyPressed['E']:
        bottomPiecesMovement('shift');
        delete keyPressed['E'];
        break;
      case keyPressed['w']:
        frontPiecesMovement();
        keyPressed = {};
        break;
      case keyPressed['a']:
        leftPiecesMovement();
        keyPressed = {};
        break;
      case keyPressed['s']:
        backPiecesMovement();
        keyPressed = {};
        break;
      case keyPressed['d']:
        rightPiecesMovement();
        keyPressed = {};
        break;
      case keyPressed['q']:
        topPiecesMovement();
        keyPressed = {};
        break;
      case keyPressed['e']:
        bottomPiecesMovement();
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
  }, [])

  return(
    <div className="rubicksCubeContainer">
      <div 
        className="cube"
        style={{
          width: cube.getStyle("width"),
          height: cube.getStyle("height"),
          transform: `rotateX(${cube.getStyle("rotateX")}deg) rotateY(${cube.getStyle("rotateY")}deg) rotateZ(${cube.getStyle("rotateZ")}deg)`,
          transition: `${cube.getStyle("transition")}s`,
        }}
      >
        {cube.getPieces().map((piece, index) => (
          <div
            key={index}
            className="pieceContainer"
            style={{
              width: piece.getStyle("width"),
              height: piece.getStyle("height"),
              transformOrigin: `${piece.getStyle("transformOriginX")}px ${piece.getStyle("transformOriginY")}px ${piece.getStyle("transformOriginZ")}px`,
              transform: `translateX(${piece.getStyle("translateX")}px) translateY(${piece.getStyle("translateY")}px) translateZ(${piece.getStyle("translateZ")}px) rotateX(${piece.getStyle("rotateX")}deg) rotateY(${piece.getStyle("rotateY")}deg) rotateZ(${piece.getStyle("rotateZ")}deg)`,
              transition: `${piece.getStyle("transition")}s`,
            }}
            data-id={piece.getId()}
            data-layer={piece.getData("layer")}
            data-topcolor={cube.getColor("topColor")}
            data-bottomcolor={cube.getColor("bottomColor")}
            data-leftcolor={cube.getColor("leftColor")}
            data-rightcolor={cube.getColor("rightColor")}
            data-frontcolor={cube.getColor("frontColor")}
            data-backcolor={cube.getColor("backColor")}
            data-firstcolor={piece.getData("colors")[0]}
            data-secondcolor={piece.getData("colors")[1]}
            data-thirdcolor={piece.getData("colors")[2]}
            data-firstcolorface={piece.getData("faces")[0]}
            data-secondcolorface={piece.getData("faces")[1]}
            data-thirdcolorface={piece.getData("faces")[2]}
            data-piecetype={piece.getData("type")}
          >
            <div className="piece">
              {renderPieceFace({ pieceFaceType: piece.getClass("frontClass") ?? 'top', piece, translateZ: piece.getStyle("faceTranslateZ") + 1 })}
              {renderPieceFace({ pieceFaceType: piece.getClass("backClass") ?? 'back', piece, rotateY: 180, translateZ: piece.getStyle("faceTranslateZ") / -1 -1 })}
              {renderPieceFace({ pieceFaceType: piece.getClass("rightClass") ?? 'right', piece, rotateY: 90, translateX: piece.getStyle("faceTranslateX") + 1 })}
              {renderPieceFace({ pieceFaceType: piece.getClass("leftClass") ?? 'left', piece, rotateY: -90, translateX: piece.getStyle("faceTranslateX") / -1 -1 })}
              {renderPieceFace({ pieceFaceType: piece.getClass("topClass") ?? 'top', piece, rotateX: 90, translateY: piece.getStyle("faceTranslateY") / -1 -1 })}
              {renderPieceFace({ pieceFaceType: piece.getClass("bottomClass") ?? 'bottom', piece, rotateX: -90, translateY: piece.getStyle("faceTranslateY") + 1 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RubicksCube;
