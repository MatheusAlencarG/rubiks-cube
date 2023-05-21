import React, { useContext } from "react";
import './styles.css';

import 'swiper/swiper.css';
import Swiper from 'react-id-swiper';

import data from './content.json';
import { SwiperParams } from '../../../types/index';

import { Context } from "../../../Contexts/GeneralConfigContext/Context";

function TutorialParts() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const content = data.content[currentLanguage];
  const swiperParams: SwiperParams = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    },
    activeSlideKey: '0'
  }
  const { description } = allLanguages[currentLanguage].tutorialParts;

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
      <p>{description}</p>
    </div>
  );
}

export default TutorialParts;