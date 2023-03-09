import React from "react";
import './styles.css';

import data from './content.json'

function TutorialParts() {
  const content = data.content;

  return(
    <div className="tutorialPartsContainer">
      <div className="tutorialPartsDescription">
        <h2>{content.title}</h2>
        <p className="description" dangerouslySetInnerHTML={{ __html: content.description }}></p>
      </div>
      <div className="cubeParts">
        {content.parts.map((part, index) => (
          <div key={index} className="partContainer">
            <h3>{part.title}</h3>
            <img src={part.imgURL} alt="Part" />
            <p className="partDescription">{part.partDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TutorialParts;