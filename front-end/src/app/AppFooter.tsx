import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { TutorialNavigationContext } from '../features/tutorial/TutorialNavigationContext';
import { PreferencesContext } from '../features/preferences/PreferencesContext';

const navigationLinkClass =
  'inline-grid h-8 shrink-0 place-items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent';

function PageArrow({
  destination,
  label,
  previous = false,
}: {
  destination: string;
  label: string;
  previous?: boolean;
}) {
  const Icon = previous ? ChevronLeft : ChevronRight;
  const icon = <Icon className="h-6 w-6" aria-hidden="true" />;

  if (!destination)
    return (
      <span
        className="inline-grid h-8 w-8 shrink-0 place-items-center text-detail"
        aria-hidden="true"
      >
        {icon}
      </span>
    );

  return (
    <Link
      className={`footerLink ${navigationLinkClass} w-8 text-ink no-underline hover:text-accent`}
      to={destination}
      aria-label={label}
      title={label}
    >
      {icon}
    </Link>
  );
}

function AppFooter() {
  const { pageState } = useContext(TutorialNavigationContext);
  const { currentLanguage } = useContext(PreferencesContext).language;
  const { pathname } = useLocation();
  const isTutorial = pathname === '/' || pathname.startsWith('/tutorial');
  const en = currentLanguage === 'en-us';

  return (
    <div className="footerContainer box-border flex w-full flex-col items-center px-2">
      {isTutorial && (
        <nav
          aria-label={en ? 'Tutorial pages' : 'Páginas do tutorial'}
          className="navigatorContainer box-border flex max-w-full items-center gap-1 rounded-2xl bg-canvas px-1"
        >
          <PageArrow
            destination={pageState.prevPage}
            label={en ? 'Previous tutorial page' : 'Página anterior do tutorial'}
            previous
          />
          <div className="flex min-w-0 flex-wrap justify-center">
            {pageState.listOfPages.map((page, index) => {
              const isCurrentPage = index === pageState.currentPageIndex;
              const markerClass = isCurrentPage
                ? 'active w-5 border-accent bg-accent'
                : 'w-2.5 border-detail group-hover:border-accent group-hover:bg-accent';

              return (
                <Link
                  key={page}
                  className={`${navigationLinkClass} group w-6`}
                  to={page}
                  aria-label={`Tutorial ${index + 1}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  <span
                    className={`page box-border h-2.5 rounded-full border-2 border-solid ${markerClass}`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
          <PageArrow
            destination={pageState.nextPage}
            label={en ? 'Next tutorial page' : 'Próxima página do tutorial'}
          />
        </nav>
      )}
      <p className="copyrightText w-full text-center text-[10px] text-muted-ink">
        © Matheus Alencar Garcia
      </p>
    </div>
  );
}
export default AppFooter;
