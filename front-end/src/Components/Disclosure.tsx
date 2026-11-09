import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DisclosureProps {
  title: React.ReactNode;
  children: React.ReactNode;
  buttonClass: string;
  contentClass: string;
  arrowClass: string;
}

export default function Disclosure({
  title,
  children,
  buttonClass,
  contentClass,
  arrowClass,
}: DisclosureProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <>
      <button
        type="button"
        id={`${contentId}-trigger`}
        className={`box-border w-full border-0 [font-family:inherit] [font-size:inherit] ${buttonClass}`}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded(previous => !previous)}
      >
        {title}
        <ChevronDown
          className={`${arrowClass} transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={`${contentId}-trigger`}
        className={`${contentClass} ${expanded ? 'active' : ''}`}
        aria-hidden={!expanded}
        {...(expanded ? {} : { inert: '' })}
      >
        {children}
      </div>
    </>
  );
}
