import React from "react";
import './styles.css';

import 'swiper/swiper.css';
import Swiper from 'react-id-swiper';

import data from './content.json'
import { SwiperParams, TutorialStepProps } from '../../../types/index';

function TutorialStep({ id }: TutorialStepProps) {
  const pageId = Number(id) -1;
  const pageContent = data.content[pageId];
  const swiperParams: SwiperParams = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    },
    activeSlideKey: '0'
  }

  return(
    <div className="tutorialStepContainer">
      <div className="tutorialStepDescription">
        <h2>{pageContent.title}</h2>
        <p>{pageContent.description}</p>
      </div>
      <Swiper { ...swiperParams }>
        {pageContent.parts.map((part, index) => (
          <div key={index} className="partContainer">
            <div className="partBackground">
              <h3>{part.title}</h3>
              <p>{part.description}</p>
              <img src={part.image} alt="Part" />
              <div className="partId">
                part {part.id}
              </div>
            </div>
          </div>
        ))}
      </Swiper>
      <p className="videos">
        Any more question? Here we have some YouTube videos with more details:
        <a href={pageContent.videoURLOne}>Video</a>
        {pageContent.videoURLTwo ? <a href={pageContent.videoURLTwo}>Video</a> : ''}
      </p>
    </div>
  );
}

export default TutorialStep;