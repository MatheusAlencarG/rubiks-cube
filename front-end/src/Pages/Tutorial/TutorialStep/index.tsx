import React, { useContext } from 'react';
import './styles.css';

import TutorialCarousel from '../../../Components/TutorialCarousel';

import { useTutorials } from '../../../api/hooks';
import { mediaUrl } from '../../../api/client';
import Disclosure from '../../../Components/Disclosure';
import RemoteContent, { RichText } from '../../../Components/RemoteContent';
import { useParams } from 'react-router-dom';

import { Context } from '../../../Contexts/GeneralConfigContext/Context';

function TutorialStep() {
  const { id } = useParams();
  const { allLanguages, currentLanguage } = useContext(Context).language;
  const { data, error, isLoading, mutate } = useTutorials();
  const pageContent = data?.find(item => item.kind === 'step' && item.stepNumber === Number(id));
  const { part: partLanguage, videoDescription } = allLanguages[currentLanguage].tutorialSteps;
  if (!pageContent) return <RemoteContent loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialStepContainer">
      <div className="tutorialStepDescription">
        <h2>{pageContent.title}</h2>
        <div>
          <RichText value={pageContent.description} />
        </div>
      </div>
      <TutorialCarousel key={`${currentLanguage}-${pageContent.documentId}`}>
        {pageContent.parts.map((part, index) => (
          <div key={part.id} className="partContainer">
            <div className="partBackground">
              <h3>{part.title}</h3>
              <div>
                <RichText value={part.description} />
              </div>
              {part.image && (
                <img src={mediaUrl(part.image.url)} alt={part.imageAlt || part.title} />
              )}
              <div className="partId">
                {partLanguage} {index + 1}
              </div>
            </div>
          </div>
        ))}
      </TutorialCarousel>
      {pageContent.videos.length > 0 && (
        <div className="videosContainer">
          <div className="videoContentMain">
            <Disclosure
              title={videoDescription}
              buttonClass="videosTitle"
              contentClass="videoContent"
              arrowClass="videoArrow"
              arrowSrc="/images/simple-arrow-white.svg"
              arrowAlt="Simple Arrow"
            >
              {pageContent.videos.map(video => (
                <iframe
                  key={video.id}
                  width="374"
                  height="210"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              ))}
            </Disclosure>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorialStep;
