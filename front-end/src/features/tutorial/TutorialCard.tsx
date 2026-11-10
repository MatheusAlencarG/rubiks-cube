import { mediaUrl } from '../../shared/api/strapiClient';
import { RichText } from './TutorialContentState';
import type { Tutorial } from './tutorialTypes';

interface TutorialCardProps {
  part: Tutorial['parts'][number];
  label?: string;
}

export default function TutorialCard({ part, label }: TutorialCardProps) {
  return (
    <article className="partBackground box-border flex w-full min-w-0 flex-col gap-3 rounded-xl border-2 border-solid border-detail bg-surface p-4 text-ink [.swiper-slide-active_&]:border-accent">
      <h3 className="m-0 text-center text-base font-semibold [overflow-wrap:anywhere]">
        {part.title}
      </h3>
      <div className="partDescription text-sm leading-relaxed [overflow-wrap:anywhere] [&_p]:my-2">
        <RichText value={part.description} highlightMoves />
      </div>
      {(part.image || label) && (
        <div className="mt-auto flex flex-col gap-3">
          {part.image && (
            <img
              className="mx-auto h-36 w-40 max-w-full object-contain"
              src={mediaUrl(part.image.url)}
              alt={part.imageAlt || part.title}
              draggable={false}
            />
          )}
          {label && (
            <span className="partId self-end rounded-md border border-solid border-detail bg-canvas px-2 py-1 text-xs font-medium text-on-canvas">
              {label}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
