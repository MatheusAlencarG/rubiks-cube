import React from "react";
import "./styles.css";

function Tutorial() {
  return(
    <div className="tutorialConatiner">
      <h2>Game Commands</h2>
      <div className="tutorialContent">
        <p>
          <div><b>W</b> = Front move<br /></div>
          <div><b>A</b> = Left move<br /></div>
          <div><b>S</b> = Back move<br /></div>
          <div><b>D</b> = Rigth move<br /></div>
          <div><b>Q</b> = Top move<br /></div>
          <div><b>E</b> = Botton move<br /></div>
        </p>
        <p>
          🠻 = Cube bottom movement<br />
          🠸 = Cube left movement<br />
          🠹 = Cube top movement<br />
          🠺 = Cube rigth movement<br />
        </p>
      </div>
      <p className="tutorialDescription">Next step of the tutorial, we have a step by step to finish a cube 3X3.</p>
    </div>
  );
}

export default Tutorial;
