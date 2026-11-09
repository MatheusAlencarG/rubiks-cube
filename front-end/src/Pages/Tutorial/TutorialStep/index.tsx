import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useTutorials } from '../../../api/hooks';
import { mediaUrl } from '../../../api/client';
import type { Tutorial } from '../../../api/types';
import Disclosure from '../../../Components/Disclosure';
import RemoteContent, { RichText } from '../../../Components/RemoteContent';
import TutorialCarousel from '../../../Components/TutorialCarousel';
import { Context } from '../../../Contexts/GeneralConfigContext/Context';

function TutorialStep() {
  const { id } = useParams();
  const { allLanguages, currentLanguage } = useContext(Context).language;
  const { data, error, isLoading, mutate } = useTutorials();

  const stepNumber = Number(id);
  const step = data?.find(item => item.kind === 'step' && item.stepNumber === stepNumber);
  const { part: partLabel, videoDescription } = allLanguages[currentLanguage].tutorialSteps;

  if (!step) return <RemoteContent loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialStepContainer w-[calc(100%_-_70px)] overflow-auto px-[35px] py-[20px] short-screen:px-0 compact-screen:h-auto mobile:w-[calc(100%_-_40px)] mobile:px-[20px]">
      <div className="tutorialStepDescription [&_p]:text-center">
        <h2 className="m-0 text-center font-medium">{step.title}</h2>
        <div>
          <RichText value={step.description} />
        </div>
      </div>

      <TutorialCarousel
        key={`${currentLanguage}-${step.documentId}`}
        className="h-[500px] min-h-[500px] overflow-hidden rounded-[16px] border-2 border-solid border-accent bg-canvas p-[20px] mobile:w-[calc(100%_-_44px)]"
      >
        {step.parts.map((part, index) => renderStepSlide(part, `${partLabel} ${index + 1}`))}
      </TutorialCarousel>

      {step.videos.length > 0 && <StepVideos title={videoDescription} videos={step.videos} />}
    </div>
  );
}

function renderStepSlide(part: Tutorial['parts'][number], label: string) {
  return (
    <div
      key={part.id}
      className="partContainer flex flex-col items-center justify-evenly [&.swiper-slide-active_p]:h-auto [&.swiper-slide-active_p]:overflow-auto mobile:[&.swiper-slide-active_p]:text-center [&_p]:h-0 [&_p]:overflow-hidden"
    >
      <div className="partBackground relative flex h-[60%] w-[60%] flex-col items-center justify-evenly rounded-[16px] border-2 border-solid border-accent bg-surface p-[20px] opacity-50 [transition:0.6s] mobile:w-[83%] mobile:p-[10px] [.swiper-slide-active_&]:h-[calc(100%_-_40px)] [.swiper-slide-active_&]:w-full [.swiper-slide-active_&]:opacity-100 mobile:[.swiper-slide-active_&]:w-[calc(100%_-_20px)]">
        <h3 className="m-0 text-center font-medium">{part.title}</h3>
        <div>
          <RichText value={part.description} />
        </div>
        {part.image && (
          <img
            className="w-[160px]"
            src={mediaUrl(part.image.url)}
            alt={part.imageAlt || part.title}
          />
        )}
        <div className="partId absolute bottom-[8px] right-[10px] rounded-[10px] border-2 border-solid border-accent bg-canvas p-[3px] text-accent">
          {label}
        </div>
      </div>
    </div>
  );
}

function StepVideos({ title, videos }: { title: string; videos: Tutorial['videos'] }) {
  return (
    <div className="videosContainer flex flex-col items-center">
      <div className="videoContentMain mt-[20px] w-full rounded-[15px] border-2 border-solid border-accent bg-canvas">
        <Disclosure
          title={title}
          buttonClass="videosTitle relative m-0 cursor-pointer rounded-[15px] bg-canvas px-0 py-[15px] text-center text-accent mobile:pr-[30px]"
          contentClass="videoContent flex h-0 flex-col items-center gap-[15px] overflow-hidden rounded-[15px] p-0 [transition:0.5s] [&.active]:h-auto [&.active]:px-0 [&.active]:py-[20px]"
          arrowClass="absolute right-[10px] top-[calc(50%-15px)] w-[30px] [filter:var(--canvas-icon-filter)] [transform:rotate(90deg)] [transition:0.5s] [&.active]:[transform:rotate(270deg)]"
          arrowSrc="/images/simple-arrow-white.svg"
          arrowAlt="Simple Arrow"
        >
          {videos.map(video => (
            <iframe
              key={video.id}
              className="mobile:h-auto mobile:w-[90%]"
              width="374"
              height="210"
              src={video.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              frameBorder="0"
            />
          ))}
        </Disclosure>
      </div>
    </div>
  );
}

export default TutorialStep;
