import React from "react";
import './styles.css';

import data from './content.json'

type TutorialStepProps = {
  id?: string;
}

function TutorialStep({ id }: TutorialStepProps) {
  const pageId = Number(id) -1;

  return <>{data.content[pageId].title}</>;
}

export default TutorialStep;