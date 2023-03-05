import React from "react";
import "./styles.css";

function MainTutorial() {
  return(
    <div className="tutorialContainer">
      <h2>Game Commands</h2>
      <div className="tutorialContent">
        <div>
          <div>
            <b>W</b> = Front move<br />
          </div>
          <div>
            <b>A</b> = Left move<br />
          </div>
          <div>
            <b>S</b> = Back move<br />
          </div>
          <div>
            <b>D</b> = Rigth move<br />
          </div>
          <div>
            <b>Q</b> = Top move<br />
          </div>
          <div>
            <b>E</b> = Botton move<br />
          </div>
        </div>
        <div className="movementCommands">
          <div className="movementCommandsContainer">
            <img className="bottom" src="/images/arrow.svg" alt="Botton Arrow" /> = Cube bottom movement<br />
          </div>
          <div className="movementCommandsContainer">
            <img className="left" src="/images/arrow.svg" alt="Left Arrow" /> = Cube left movement<br />
          </div>
          <div className="movementCommandsContainer">
            <img className="top" src="/images/arrow.svg" alt="Top Arrow" /> = Cube top movement<br />
          </div>
          <div className="movementCommandsContainer">
            <img className="rigth" src="/images/arrow.svg" alt="Rigth Arrow" /> = Cube rigth movement<br />
          </div>
        </div>
      </div>
      <p className="tutorialDescription">Next tutorial step, we have a explanation of parts positions, and step by step to finish a cube 3X3.</p>
    </div>
  );
}

export default MainTutorial;
