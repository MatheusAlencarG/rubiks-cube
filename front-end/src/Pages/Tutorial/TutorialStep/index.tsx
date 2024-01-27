import React, { useContext } from "react";
import './styles.css';

import 'swiper/swiper.css';
import Swiper from 'react-id-swiper';

import data from './content.json'
import { SwiperParams, TutorialStepProps } from '../../../types/index';

import { Context } from "../../../Contexts/GeneralConfigContext/Context";

function TutorialStep({ id }: TutorialStepProps) {
  const { allLanguages, currentLanguage } = useContext(Context).language;
  const pageId = Number(id) -1;
  const pageContent = data.content[currentLanguage][pageId];
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
  };
  const { part: partLanguage, videoDescription } = allLanguages[currentLanguage].tutorialSteps;

  function toggleVideo(event: React.MouseEvent<HTMLElement>) {
    const configContainer = event.currentTarget.parentNode as Element;
    const currentArrow = event.currentTarget.childNodes.item(1) as Element;
    const configContent = configContainer.childNodes.item(1) as Element;

    if (currentArrow.classList.value.includes('active')) {
      currentArrow.classList.remove('active');
      configContent.classList.remove('active');
    } else {
      currentArrow.classList.add('active');
      configContent.classList.add('active');
    }
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
                {partLanguage} {part.id}
              </div>
            </div>
          </div>
        ))}
      </Swiper>
      <div className="videosContainer">
        <div className="videoContentMain">
          <p className="videosTitle" onClick={toggleVideo}>
            {videoDescription}
            <img className="videoArrow" src="/images/simple-arrow-white.svg" alt="Simple Arrow" />
          </p>
          <div className="videoContent">
            <iframe 
              width="374" 
              height="210" 
              src={pageContent.videoURLOne} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              frameBorder="0"
              >
            </iframe>
            {
              pageContent.videoURLTwo ? <iframe 
                width="374" 
                height="210" 
                src={pageContent.videoURLTwo} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                frameBorder="0"
                >
              </iframe> : ''
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialStep;