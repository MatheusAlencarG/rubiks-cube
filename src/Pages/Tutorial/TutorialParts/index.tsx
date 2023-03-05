import React from "react";
import './styles.css';

function TutorialParts() {
  return(
    <div className="tutorialPartsContainer">
      <div className="tutorialPartsDescription">
        <h2>Cube parts names and positions</h2>
        <p className="description">
          We have <strong>3</strong> diferents parts on the cube, first of then is the <strong>corner</strong>, the second is the <strong>middle</strong>, and the last one is the <strong>center</strong>.
        </p>
      </div>
      <div className="cubeParts">
        <div className="partContainer">
          <h3>Corner</h3>
          <img src="/images/cube-corner.png" alt="Corner" />
          <p className="partDescription">This is a part of the cube that have 3 colors on total</p>
        </div>
        <div className="partContainer">
          <h3>Middle</h3>
          <img src="/images/cube-middle.png" alt="Middle" />
          <p className="partDescription">This is a part of the cube that have 2 colors on total</p>
        </div>
        <div className="partContainer">
          <h3>Center</h3>
          <img src="/images/cube-center.png" alt="Center" />
          <p className="partDescription">This is a part of the cube that has only 1 color, it is a fixed part, it defines where the colored face is</p>
        </div>
      </div>
    </div>
  );
}

export default TutorialParts;