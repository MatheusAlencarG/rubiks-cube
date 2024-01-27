import React, { useContext } from "react";
import "./styles.css";

import { Context } from "../../../Contexts/GeneralConfigContext/Context";

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
    description
  } = allLanguages[currentLanguage].tutorialPage;

  return(
    <div className="tutorialContainer">
      <h2>{title}</h2>
      <div className="tutorialContent">
        <div>
          <div>
            <b>W</b> = {commandW}<br />
          </div>
          <div>
            <b>A</b> = {commandA}<br />
          </div>
          <div>
            <b>S</b> = {commandS}<br />
          </div>
          <div>
            <b>D</b> = {commandD}<br />
          </div>
          <div>
            <b>Q</b> = {commandQ}<br />
          </div>
          <div>
            <b>E</b> = {commandE}<br />
          </div>
        </div>
        <div className="movementCommands">
          <div className="movementCommandsContainer">
            <img className="bottom" src="/images/arrow.svg" alt="Botton Arrow" /> = {commandArrowDown}<br />
          </div>
          <div className="movementCommandsContainer">
            <img className="left" src="/images/arrow.svg" alt="Left Arrow" /> = {commandArrowLeft}<br />
          </div>
          <div className="movementCommandsContainer">
            <img className="top" src="/images/arrow.svg" alt="Top Arrow" /> = {commandArrowUp}<br />
          </div>
          <div className="movementCommandsContainer">
            <img className="rigth" src="/images/arrow.svg" alt="Rigth Arrow" /> = {commandArrowRight}<br />
          </div>
        </div>
      </div>
      <p className="tutorialDescription">{description}</p>
    </div>
  );
}

export default MainTutorial;
