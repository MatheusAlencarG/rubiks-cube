import React from "react";
import './styles.css';

import 'swiper/swiper.css';
import Swiper from 'react-id-swiper';

import data from './content.json';
import { SwiperParams } from '../../../types/index';

function TutorialParts() {
  const content = data.content;
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
    <div className="tutorialPartsContainer">
      <div className="tutorialPartsDescription">
        <h2>{content.title}</h2>
        <p className="description" dangerouslySetInnerHTML={{ __html: content.description }}></p>
      </div>
      <Swiper { ...swiperParams }>
        {content.parts.map((part, index) => (
          <div key={index} className="partContainer">
            <div className="partBackground">
              <h3>{part.title}</h3>
              <img src={part.imgURL} alt="Part" />
              <p className="partDescription">{part.partDescription}</p>
            </div>
          </div>
        ))}
      </Swiper>
      <p>
        Keep all this in mind, we will use everything to the next page, you will find a step by step to finish a cube
      </p>
    </div>
  );
}

export default TutorialParts;