import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { useTutorials } from './useTutorials';
import type { Tutorial } from './tutorialTypes';
import Disclosure from '../../shared/ui/Disclosure';
import TutorialContentState, { RichText } from './TutorialContentState';
import TutorialCarousel from './TutorialCarousel';
import TutorialCard from './TutorialCard';
import { PreferencesContext } from '../preferences/PreferencesContext';

function TutorialStepPage() {
  const { id } = useParams();
  const { allLanguages, currentLanguage } = useContext(PreferencesContext).language;
  const { data, error, isLoading, mutate } = useTutorials();

  const stepNumber = Number(id);
  const step = data?.find(item => item.kind === 'step' && item.stepNumber === stepNumber);
  const { part: partLabel, videoDescription } = allLanguages[currentLanguage].tutorialSteps;

  if (!step) return <TutorialContentState loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialStepContainer box-border min-h-0 w-full flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
      <div className="tutorialStepDescription mx-auto max-w-3xl space-y-2 text-center">
        <h2 className="m-0 text-center font-medium">{step.title}</h2>
        <div className="leading-relaxed text-muted-ink [&_p]:m-0">
          <RichText value={step.description} />
        </div>
      </div>

      <TutorialCarousel key={`${currentLanguage}-${step.documentId}`}>
        {step.parts.map((part, index) => (
          <div key={part.id}>
            <TutorialCard part={part} label={`${partLabel} ${index + 1}`} />
          </div>
        ))}
      </TutorialCarousel>

      {step.videos.length > 0 && <StepVideos title={videoDescription} videos={step.videos} />}
    </div>
  );
}

function StepVideos({ title, videos }: { title: string; videos: Tutorial['videos'] }) {
  return (
    <div className="videosContainer rounded-2xl border border-solid border-detail bg-canvas">
      <Disclosure
        title={title}
        buttonClass="videosTitle flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3 text-left text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        contentClass="videoContent grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 motion-reduce:transition-none [&.active]:grid-rows-[1fr]"
        arrowClass="h-5 w-5 shrink-0"
      >
        <div className="min-h-0 overflow-hidden rounded-b-2xl">
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {videos.map(video => (
              <iframe
                key={video.id}
                className="aspect-video w-full max-w-[374px] rounded-lg border-0"
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ))}
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default TutorialStepPage;
