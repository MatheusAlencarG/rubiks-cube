import React, { useContext } from 'react';

import { useTutorials } from '../../../api/hooks';
import { mediaUrl } from '../../../api/client';
import type { Tutorial } from '../../../api/types';
import RemoteContent, { RichText } from '../../../Components/RemoteContent';
import TutorialCarousel from '../../../Components/TutorialCarousel';
import { Context } from '../../../Contexts/GeneralConfigContext/Context';

function TutorialParts() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { data, error, isLoading, mutate } = useTutorials();
  const content = data?.find(item => item.kind === 'parts');
  const { description } = allLanguages[currentLanguage].tutorialParts;

  if (!content) return <RemoteContent loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialPartsContainer flex h-full w-[calc(100%_-_70px)] flex-col justify-evenly px-[35px] py-[20px]">
      <div className="tutorialPartsDescription">
        <h2 className="m-0 mb-[25px] text-center font-medium">{content.title}</h2>
        <div className="description text-center">
          <RichText value={content.description} />
        </div>
      </div>

      <TutorialCarousel key={`${currentLanguage}-${content.documentId}`}>
        {content.parts.map(renderPartSlide)}
      </TutorialCarousel>

      <p className="m-0 text-center">{description}</p>
    </div>
  );
}

function renderPartSlide(part: Tutorial['parts'][number]) {
  return (
    <div key={part.id} className="partContainer !flex items-center justify-center">
      <div className="partBackground flex h-[174px] w-[70%] flex-col items-center justify-between rounded-[16px] border-2 border-solid border-accent bg-canvas text-center opacity-50 [transition:0.6s] mobile:w-4/5 [.swiper-slide-active_&]:h-full [.swiper-slide-active_&]:w-full [.swiper-slide-active_&]:opacity-100">
        <h3 className="mx-0 my-[15px] text-accent">{part.title}</h3>
        {part.image && (
          <img
            className="w-[120px]"
            src={mediaUrl(part.image.url)}
            alt={part.imageAlt || part.title}
          />
        )}
        <div className="partDescription m-0 flex h-[61px] items-center p-[5px] text-[13px] text-on-canvas opacity-0 [.swiper-slide-active_&]:opacity-100">
          <RichText value={part.description} />
        </div>
      </div>
    </div>
  );
}

export default TutorialParts;
