import React, { useContext } from 'react';
import './styles.css';

import TutorialCarousel from '../../../Components/TutorialCarousel';

import { useTutorials } from '../../../api/hooks';
import { mediaUrl } from '../../../api/client';
import RemoteContent, { RichText } from '../../../Components/RemoteContent';

import { Context } from '../../../Contexts/GeneralConfigContext/Context';

function TutorialParts() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { data, error, isLoading, mutate } = useTutorials();
  const content = data?.find(item => item.kind === 'parts');
  const { description } = allLanguages[currentLanguage].tutorialParts;
  if (!content) return <RemoteContent loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialPartsContainer">
      <div className="tutorialPartsDescription">
        <h2>{content.title}</h2>
        <div className="description">
          <RichText value={content.description} />
        </div>
      </div>
      <TutorialCarousel key={`${currentLanguage}-${content.documentId}`}>
        {content.parts.map(part => (
          <div key={part.id} className="partContainer">
            <div className="partBackground">
              <h3>{part.title}</h3>
              {part.image && (
                <img src={mediaUrl(part.image.url)} alt={part.imageAlt || part.title} />
              )}
              <div className="partDescription">
                <RichText value={part.description} />
              </div>
            </div>
          </div>
        ))}
      </TutorialCarousel>
      <p>{description}</p>
    </div>
  );
}

export default TutorialParts;
