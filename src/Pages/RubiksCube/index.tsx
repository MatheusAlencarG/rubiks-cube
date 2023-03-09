import React, { ReactNode, useContext, useEffect } from "react";
import "./styles.css";
import classNames from "classnames";

import { Context } from "../../Contexts/RubicksCubeContext/Context";
import { RenderPieceFaceProps } from "./RubiksCubeTypes";
import { Cube, Piece, PieceFace, CubeContainer } from "./styles";

function RubicksCube() {
  const { 
    rubicksCubeState: { cube }, 
    horizontalMovement,
    verticalMovement 
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
    switch (event.key) {
      case 'ArrowLeft':
        horizontalMovement('left');
        break;
      case 'ArrowRight':
        horizontalMovement('right');
        break;
      case 'ArrowUp':
        verticalMovement('top');
        break;
      case 'ArrowDown':
        verticalMovement('bottom');
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", keydownListener)
    
    return () => {
      document.removeEventListener('keydown', keydownListener);
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
            firstFace={cube.firstFace}
            secondFace={cube.secondFace}
            thirdFace={cube.thirdFace}
            fourthFace={cube.fourthFace}
            fivethFace={cube.fivethFace}
            sixthFace={cube.sixthFace}
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
