import styled from 'styled-components';

import { CubeProps, PieceProps, PieceFaceProps } from './RubiksCubeTypes';

const CubeContainer = styled.div`
  perspective: 3000px;
  transform-style: preserve-3d;
  transform: rotateX(-45deg) rotateY(-45deg);
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  z-index: 0;
`;

const Cube = styled.div<CubeProps>`
  position: absolute;
  top: calc(50% - 105px);
  left: calc(50% - 120px);
  width: ${props => {return props.widthCustom + 'px'}};
  height: ${props => {return props.heightCustom + 'px'}};
  transform-style: preserve-3d;
  transition: .5s;
  transform: ${porps => {
    return `rotateX(${porps.rotateX}deg) rotateY(${porps.rotateY}deg) rotateZ(${porps.rotateZ}deg)`}
  };
`;

const Piece = styled.div<PieceProps>`
  position: absolute;
  width: ${props => {return props.widthCustom + 'px'}};
  height: ${props => {return props.heightCustom + 'px'}};
  transform-style: preserve-3d;
  transition: .5s;
  background-color: black;
  transform-origin: ${props => {
    return `
      ${props.transformOriginX}px 
      ${props.transformOriginY}px 
      ${props.transformOriginZ}px
    `
  }};
  transform: ${props => {
    return `
      translateX(${props.translateX}px) 
      translateY(${props.translateY}px) 
      translateZ(${props.translateZ + props.widthCustom}px)
      rotateX(${props.rotateX})
      rotateY(${props.rotateY})
      rotateZ(${props.rotateZ})
    `
  }};

  div {
    background-color: black;
  }

  &[data-piecetype="corner"][data-firstcolor="yellow"] .top,
  &[data-piecetype="corner"][data-secondcolor="yellow"] .top,
  &[data-piecetype="corner"][data-thirdcolor="yellow"] .top,
  &[data-piecetype="middle"][data-firstcolor="yellow"] .top,
  &[data-piecetype="middle"][data-secondcolor="yellow"] .top,
  &[data-piecetype="center"][data-firstcolor="yellow"] .top {
    background-color: ${props => {return props.firstFace}};
  }

  &[data-piecetype="corner"][data-firstcolor="red"] .front,
  &[data-piecetype="corner"][data-secondcolor="red"] .front,
  &[data-piecetype="corner"][data-thirdcolor="red"] .front,
  &[data-piecetype="middle"][data-firstcolor="red"] .front,
  &[data-piecetype="middle"][data-secondcolor="red"] .front,
  &[data-piecetype="center"][data-firstcolor="red"] .front {
    background-color: ${props => {return props.thirdFace}};
  }

  &[data-piecetype="corner"][data-firstcolor="green"] .right,
  &[data-piecetype="corner"][data-secondcolor="green"] .right,
  &[data-piecetype="corner"][data-thirdcolor="green"] .right,
  &[data-piecetype="middle"][data-firstcolor="green"] .right,
  &[data-piecetype="middle"][data-secondcolor="green"] .right,
  &[data-piecetype="center"][data-firstcolor="green"] .right {
    background-color: ${props => {return props.sixthFace}};
  }

  &[data-piecetype="corner"][data-firstcolor="white"] .bottom,
  &[data-piecetype="corner"][data-secondcolor="white"] .bottom,
  &[data-piecetype="corner"][data-thirdcolor="white"] .bottom,
  &[data-piecetype="middle"][data-firstcolor="white"] .bottom,
  &[data-piecetype="middle"][data-secondcolor="white"] .bottom,
  &[data-piecetype="center"][data-firstcolor="white"] .bottom {
    background-color: ${props => {return props.secondFace}};
  }

  &[data-piecetype="corner"][data-firstcolor="orange"] .back,
  &[data-piecetype="corner"][data-secondcolor="orange"] .back,
  &[data-piecetype="corner"][data-thirdcolor="orange"] .back,
  &[data-piecetype="middle"][data-firstcolor="orange"] .back,
  &[data-piecetype="middle"][data-secondcolor="orange"] .back,
  &[data-piecetype="center"][data-firstcolor="orange"] .back {
    background-color: ${props => {return props.fourthFace}};
  }

  &[data-piecetype="corner"][data-firstcolor="blue"] .left,
  &[data-piecetype="corner"][data-secondcolor="blue"] .left,
  &[data-piecetype="corner"][data-thirdcolor="blue"] .left,
  &[data-piecetype="middle"][data-firstcolor="blue"] .left,
  &[data-piecetype="middle"][data-secondcolor="blue"] .left,
  &[data-piecetype="center"][data-firstcolor="blue"] .left {
    background-color: ${props => {return props.fivethFace}};
  }
`;

const PieceFace = styled.div<PieceFaceProps>`
  position: absolute;
  width: ${props => {return props.widthCustom + 'px'}};
  height: ${props => {return props.heightCustom + 'px'}};
  line-height: ${props => {return props.lineHeight + 'px'}};
  border-radius: ${props => {return props.pieceRadius + 'px'}};
  
  &.front {
    transform: ${props => {return `translateZ(${props.translateZ + 1}px)`}};
  }

  &.back {
    transform: ${props => {return `rotateY(180deg) translateZ(${props.translateZ + 1}px)`}};
  }

  &.right {
    transform: ${props => {return `rotateY(90deg) translateZ(${props.translateZ + 1}px)`}};
  }

  &.left {
    transform: ${props => {return `rotateY(-90deg) translateZ(${props.translateZ + 1}px)`}};
  }

  &.top {
    transform: ${props => {return `rotateX(90deg) translateZ(${props.translateZ + 1}px)`}};
  }

  &.bottom {
    transform: ${props => {return `rotateX(-90deg) translateZ(${props.translateZ + 1}px)`}};
  }


`;

export {
  Cube,
  Piece,
  PieceFace,
  CubeContainer
}