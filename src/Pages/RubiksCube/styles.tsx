import styled from 'styled-components';

import { CubeProps, PieceFaceProps, PieceContainerProps } from './RubiksCubeTypes';

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
  transform: ${props => {
    return `
      rotate3d(0, 0, 1, ${props.rotateZ}deg)
      rotateX(${props.rotateX}deg)
      rotateY(${props.rotateY}deg)
    `
  }};
  user-select: none;
`;

const PieceContainer = styled.div<PieceContainerProps>`
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
      rotateX(${props.faceRotateX}deg)
      rotateY(${props.faceRotateY}deg)
      rotateZ(${props.faceRotateZ}deg)
    `
  }};

  .piece {
    position: absolute;
    width: ${props => {return props.widthCustom + 'px'}};
    height: ${props => {return props.heightCustom + 'px'}};
    transform-style: preserve-3d;
    transition: .5s;
    background-color: black;
    transform-origin: 40 40 40;
    transform: ${props => {
      return `
        rotateX(${props.pieceRotateX}deg)
        rotateY(${props.pieceRotateY}deg)
        rotateZ(${props.pieceRotateZ}deg)
      `
    }};

    div {
      background-color: black;
    }
  }

  &[data-piecetype="corner"][data-firstcolor="yellow"] .piece .top,
  &[data-piecetype="corner"][data-secondcolor="yellow"] .piece .top,
  &[data-piecetype="corner"][data-thirdcolor="yellow"] .piece .top,
  &[data-piecetype="middle"][data-firstcolor="yellow"] .piece .top,
  &[data-piecetype="middle"][data-secondcolor="yellow"] .piece .top,
  &[data-piecetype="center"][data-firstcolor="yellow"] .piece .top {
    background-color: ${props => {return props.topFaceColor}};
  }

  &[data-piecetype="corner"][data-firstcolor="red"] .piece .front,
  &[data-piecetype="corner"][data-secondcolor="red"] .piece .front,
  &[data-piecetype="corner"][data-thirdcolor="red"] .piece .front,
  &[data-piecetype="middle"][data-firstcolor="red"] .piece .front,
  &[data-piecetype="middle"][data-secondcolor="red"] .piece .front,
  &[data-piecetype="center"][data-firstcolor="red"] .piece .front {
    background-color: ${props => {return props.frontFaceColor}};
  }

  &[data-piecetype="corner"][data-firstcolor="green"] .piece .right,
  &[data-piecetype="corner"][data-secondcolor="green"] .piece .right,
  &[data-piecetype="corner"][data-thirdcolor="green"] .piece .right,
  &[data-piecetype="middle"][data-firstcolor="green"] .piece .right,
  &[data-piecetype="middle"][data-secondcolor="green"] .piece .right,
  &[data-piecetype="center"][data-firstcolor="green"] .piece .right {
    background-color: ${props => {return props.rightFaceColor}};
  }

  &[data-piecetype="corner"][data-firstcolor="white"] .piece .bottom,
  &[data-piecetype="corner"][data-secondcolor="white"] .piece .bottom,
  &[data-piecetype="corner"][data-thirdcolor="white"] .piece .bottom,
  &[data-piecetype="middle"][data-firstcolor="white"] .piece .bottom,
  &[data-piecetype="middle"][data-secondcolor="white"] .piece .bottom,
  &[data-piecetype="center"][data-firstcolor="white"] .piece .bottom {
    background-color: ${props => {return props.bottomFaceColor}};
  }

  &[data-piecetype="corner"][data-firstcolor="orange"] .piece .back,
  &[data-piecetype="corner"][data-secondcolor="orange"] .piece .back,
  &[data-piecetype="corner"][data-thirdcolor="orange"] .piece .back,
  &[data-piecetype="middle"][data-firstcolor="orange"] .piece .back,
  &[data-piecetype="middle"][data-secondcolor="orange"] .piece .back,
  &[data-piecetype="center"][data-firstcolor="orange"] .piece .back {
    background-color: ${props => {return props.backFaceColor}};
  }

  &[data-piecetype="corner"][data-firstcolor="blue"] .piece .left,
  &[data-piecetype="corner"][data-secondcolor="blue"] .piece .left,
  &[data-piecetype="corner"][data-thirdcolor="blue"] .piece .left,
  &[data-piecetype="middle"][data-firstcolor="blue"] .piece .left,
  &[data-piecetype="middle"][data-secondcolor="blue"] .piece .left,
  &[data-piecetype="center"][data-firstcolor="blue"] .piece .left {
    background-color: ${props => {return props.leftFaceColor}};
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
  PieceFace,
  CubeContainer,
  PieceContainer
}