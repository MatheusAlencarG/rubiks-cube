import React from "react";
import './styles.css';

import data from './content.json'

type TutorialStepProps = {
  id?: string;
}

function TutorialStep({ id }: TutorialStepProps) {
  const pageId = Number(id) -1;
  const pageContent = data.content[pageId];

  return(
    <div className="tutorialStepContainer">
      <div className="tutorialStepDescription">
        <h2>{pageContent.title}</h2>
        <p>{pageContent.description}</p>
      </div>
      <div className="partsContainer">
        {pageContent.parts.map((part, index) => (
          <div key={index} className="part">
            <h3>{part.title}</h3>
            <p>{part.description}</p>
            <img src={part.image} alt="Part" />
            <div className="partId">
              part {part.id}
            </div>
          </div>
        ))}
      </div>
      <p className="videos">
        Any more question? Here we have some YouTube videos with more details:
        <a href={pageContent.videoURLOne}>Video</a>
        {
          pageContent.videoURLTwo ? <a href={pageContent.videoURLTwo}>Video</a> : ''
        }
      </p>
    </div>
  );
}

export default TutorialStep;