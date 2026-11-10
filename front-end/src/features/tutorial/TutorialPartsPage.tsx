import React, { useContext } from 'react';

import { useTutorials } from './useTutorials';
import TutorialContentState, { RichText } from './TutorialContentState';
import TutorialCarousel from './TutorialCarousel';
import TutorialCard from './TutorialCard';
import { PreferencesContext } from '../preferences/PreferencesContext';

function TutorialPartsPage() {
  const { currentLanguage, allLanguages } = useContext(PreferencesContext).language;
  const { data, error, isLoading, mutate } = useTutorials();
  const content = data?.find(item => item.kind === 'parts');
  const { description } = allLanguages[currentLanguage].tutorialParts;

  if (!content)
    return <TutorialContentState loading={isLoading} error={error} empty retry={mutate} />;

  return (
    <div className="tutorialPartsContainer box-border min-h-0 w-full flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-8">
      <div className="tutorialPartsDescription mx-auto max-w-3xl space-y-2 text-center">
        <h2 className="m-0 font-medium">{content.title}</h2>
        <div className="description leading-relaxed text-muted-ink [&_p]:m-0">
          <RichText value={content.description} />
        </div>
      </div>

      <TutorialCarousel key={`${currentLanguage}-${content.documentId}`}>
        {content.parts.map(part => (
          <div key={part.id}>
            <TutorialCard part={part} />
          </div>
        ))}
      </TutorialCarousel>

      <p className="m-0 text-center">{description}</p>
    </div>
  );
}

export default TutorialPartsPage;
