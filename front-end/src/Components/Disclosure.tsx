import React, { useId, useState } from 'react';

interface DisclosureProps {
  title: React.ReactNode;
  children: React.ReactNode;
  buttonClass: string;
  contentClass: string;
  arrowClass: string;
  arrowSrc: string;
  arrowAlt: string;
}
export default function Disclosure({
  title,
  children,
  buttonClass,
  contentClass,
  arrowClass,
  arrowSrc,
  arrowAlt,
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
        <img
          className={`${arrowClass} ${expanded ? 'active' : ''}`}
          src={arrowSrc}
          alt={arrowAlt}
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
