import React, { useContext } from 'react';

import { Context } from '../../../Contexts/GeneralConfigContext/Context';

function MainTutorial() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const {
    title,
    commandA,
    commandD,
    commandE,
    commandQ,
    commandS,
    commandW,
    commandArrowDown,
    commandArrowLeft,
    commandArrowRight,
    commandArrowUp,
    description,
  } = allLanguages[currentLanguage].tutorialPage;

  return (
    <div className="tutorialContainer flex h-full w-[calc(100%_-_70px)] flex-col justify-evenly px-[35px] py-0">
      <h2 className="m-0 text-center font-medium">{title}</h2>
      <div className="tutorialContent flex justify-around mobile:flex-col mobile:items-center mobile:gap-5 mobile:py-5">
        <div>
          <div>
            <b>W</b> = {commandW}
            <br />
          </div>
          <div>
            <b>A</b> = {commandA}
            <br />
          </div>
          <div>
            <b>S</b> = {commandS}
            <br />
          </div>
          <div>
            <b>D</b> = {commandD}
            <br />
          </div>
          <div>
            <b>Q</b> = {commandQ}
            <br />
          </div>
          <div>
            <b>E</b> = {commandE}
            <br />
          </div>
        </div>
        <div className="movementCommands flex flex-col justify-center">
          <div className="movementCommandsContainer">
            <img className="bottom w-[14px] rotate-90" src="/images/arrow.svg" alt="Botton Arrow" />{' '}
            = {commandArrowDown}
            <br />
          </div>
          <div className="movementCommandsContainer">
            <img className="left w-[14px] rotate-180" src="/images/arrow.svg" alt="Left Arrow" /> ={' '}
            {commandArrowLeft}
            <br />
          </div>
          <div className="movementCommandsContainer">
            <img className="top w-[14px] rotate-[270deg]" src="/images/arrow.svg" alt="Top Arrow" />{' '}
            = {commandArrowUp}
            <br />
          </div>
          <div className="movementCommandsContainer">
            <img className="rigth w-[14px]" src="/images/arrow.svg" alt="Rigth Arrow" /> ={' '}
            {commandArrowRight}
            <br />
          </div>
        </div>
      </div>
      <p className="tutorialDescription m-0 text-center">{description}</p>
    </div>
  );
}

export default MainTutorial;
