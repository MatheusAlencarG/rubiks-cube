import React, { ReactNode, useContext, useEffect } from 'react';
import { useCube } from '../../Contexts/RubicksCubeContext/CreateRubicksCube3x3Context';
import { useAuth } from '../../Contexts/AuthContext';
import CubeControls from '../../Components/CubeControls';
import { useCubeSession } from '../../Contexts/CubeSessionContext';

import { Context as PreferencesContext } from '../../Contexts/GeneralConfigContext/Context';
import { ACTIONS, KeyboardAction, normalizeKey } from '../../preferences';
import { RenderPieceFaceProps } from '../../types/rubiksCubePage';

function RubicksCube() {
  const { user } = useAuth();
  const { keyboardBindings } = useContext(PreferencesContext).preferences.ui;
  const { session } = useCubeSession();
  const {
    rubicksCube3x3: {
      functions: {
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
    },
  } = useCube();

  function renderPieceFace({
    pieceFaceType,
    piece,
    rotateX,
    rotateY,
    translateX,
    translateY,
    translateZ,
  }: RenderPieceFaceProps): ReactNode {
    const backgroundColor =
      piece.getData('colors').includes('yellow') && pieceFaceType === 'top'
        ? cube.getColor('topColor')
        : piece.getData('colors').includes('blue') && pieceFaceType === 'left'
          ? cube.getColor('leftColor')
          : piece.getData('colors').includes('green') && pieceFaceType === 'right'
            ? cube.getColor('rightColor')
            : piece.getData('colors').includes('white') && pieceFaceType === 'bottom'
              ? cube.getColor('bottomColor')
              : piece.getData('colors').includes('orange') && pieceFaceType === 'back'
                ? cube.getColor('backColor')
                : piece.getData('colors').includes('red') && pieceFaceType === 'front'
                  ? cube.getColor('frontColor')
                  : '';

    return (
      <div
        className={`pieceFace absolute flex items-center justify-center bg-black ${pieceFaceType}`}
        style={{
          width: piece.getStyle('faceWidth'),
          height: piece.getStyle('faceHeight'),
          transform: `${translateX ? `translateX(${translateX}px)` : ''} ${translateY ? `translateY(${translateY}px)` : ''} ${translateZ ? `translateZ(${translateZ}px)` : ''} ${rotateX ? `rotateX(${rotateX}deg)` : ''} ${rotateY ? `rotateY(${rotateY}deg)` : ''}`,
          borderRadius: cube.getStyle('pieceRadius'),
          backgroundColor,
        }}
      />
    );
  }

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        document.querySelector('.generalConfigPopup.active')
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest('input, textarea, select, button, summary'))
      )
        return;
      const action = ACTIONS.find(item => keyboardBindings[item] === normalizeKey(event.key));
      if (!action) return;
      const handlers: Record<KeyboardAction, (inverse?: 'shift') => void> = {
        front: frontPiecesMovement,
        left: leftPiecesMovement,
        back: backPiecesMovement,
        right: rightPiecesMovement,
        top: topPiecesMovement,
        bottom: bottomPiecesMovement,
        viewLeft: () => horizontalCubeMovement('left'),
        viewRight: () => horizontalCubeMovement('right'),
        viewUp: () => verticalCubeMovement('top'),
        viewDown: () => verticalCubeMovement('bottom'),
      };
      event.preventDefault();
      handlers[action](event.shiftKey ? 'shift' : undefined);
    }
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [
    keyboardBindings,
    frontPiecesMovement,
    leftPiecesMovement,
    backPiecesMovement,
    rightPiecesMovement,
    topPiecesMovement,
    bottomPiecesMovement,
    horizontalCubeMovement,
    verticalCubeMovement,
  ]);

  return (
    <>
      <CubeControls key={user?.id ?? 'guest'} />
      <div
        style={{
          transform: `rotateX(${session.appearance.initialRotationX}deg) rotateY(${session.appearance.initialRotationY}deg) rotateZ(${session.appearance.initialRotationZ}deg)`,
        }}
        className="rubicksCubeContainer relative z-0 min-h-[320px] w-full flex-1 p-0 [perspective:3000px] [transform-style:preserve-3d] [transform:rotateX(-45deg)_rotateY(-45deg)]"
      >
        <div
          className="cube absolute left-[calc(50%_-_120px)] top-[calc(50%_-_105px)] select-none [transform-style:preserve-3d]"
          style={{
            width: cube.getStyle('width'),
            height: cube.getStyle('height'),
            transform: `rotateX(${cube.getStyle('rotateX')}deg) rotateY(${cube.getStyle('rotateY')}deg) rotateZ(${cube.getStyle('rotateZ')}deg) scale(${session.appearance.widthPx / 240})`,
            transition: `${cube.getStyle('transition')}s`,
          }}
        >
          {cube.getPieces().map(piece => (
            <div
              key={piece.getId()}
              className="pieceContainer absolute bg-black [transform-style:preserve-3d]"
              style={{
                width: piece.getStyle('width'),
                height: piece.getStyle('height'),
                transformOrigin: `${piece.getStyle('transformOriginX')}px ${piece.getStyle('transformOriginY')}px ${piece.getStyle('transformOriginZ')}px`,
                transform: `translateX(${piece.getStyle('translateX')}px) translateY(${piece.getStyle('translateY')}px) translateZ(${piece.getStyle('translateZ')}px) rotateX(${piece.getStyle('rotateX')}deg) rotateY(${piece.getStyle('rotateY')}deg) rotateZ(${piece.getStyle('rotateZ')}deg)`,
                transition: `${piece.getStyle('transition')}s`,
              }}
              data-id={piece.getId()}
              data-layer={piece.getData('layer')}
              data-topcolor={cube.getColor('topColor')}
              data-bottomcolor={cube.getColor('bottomColor')}
              data-leftcolor={cube.getColor('leftColor')}
              data-rightcolor={cube.getColor('rightColor')}
              data-frontcolor={cube.getColor('frontColor')}
              data-backcolor={cube.getColor('backColor')}
              data-firstcolor={piece.getData('colors')[0]}
              data-secondcolor={piece.getData('colors')[1]}
              data-thirdcolor={piece.getData('colors')[2]}
              data-firstcolorface={piece.getData('faces')[0]}
              data-secondcolorface={piece.getData('faces')[1]}
              data-thirdcolorface={piece.getData('faces')[2]}
              data-piecetype={piece.getData('type')}
            >
              <div className="piece absolute h-[80px] w-[80px] bg-black [transform-style:preserve-3d]">
                {renderPieceFace({
                  pieceFaceType: piece.getClass('frontClass') ?? 'top',
                  piece,
                  translateZ: piece.getStyle('faceTranslateZ') + 1,
                })}
                {renderPieceFace({
                  pieceFaceType: piece.getClass('backClass') ?? 'back',
                  piece,
                  rotateY: 180,
                  translateZ: piece.getStyle('faceTranslateZ') / -1 - 1,
                })}
                {renderPieceFace({
                  pieceFaceType: piece.getClass('rightClass') ?? 'right',
                  piece,
                  rotateY: 90,
                  translateX: piece.getStyle('faceTranslateX') + 1,
                })}
                {renderPieceFace({
                  pieceFaceType: piece.getClass('leftClass') ?? 'left',
                  piece,
                  rotateY: -90,
                  translateX: piece.getStyle('faceTranslateX') / -1 - 1,
                })}
                {renderPieceFace({
                  pieceFaceType: piece.getClass('topClass') ?? 'top',
                  piece,
                  rotateX: 90,
                  translateY: piece.getStyle('faceTranslateY') / -1 - 1,
                })}
                {renderPieceFace({
                  pieceFaceType: piece.getClass('bottomClass') ?? 'bottom',
                  piece,
                  rotateX: -90,
                  translateY: piece.getStyle('faceTranslateY') + 1,
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RubicksCube;
