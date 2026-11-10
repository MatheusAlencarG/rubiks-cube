import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { TutorialNavigationContext } from '../features/tutorial/TutorialNavigationContext';
import { PreferencesContext } from '../features/preferences/PreferencesContext';

const linkClass =
  'headerLinkContainer flex min-w-0 flex-1 items-center justify-center rounded-[10px] border border-solid px-1 py-[13px] text-center capitalize no-underline transition-colors duration-150 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const selectedLinkClass =
  'active border-accent bg-accent text-[19px] font-bold text-on-accent mobile:text-[15px]';
const inactiveLinkClass =
  'border-transparent bg-surface text-[17px] font-medium text-ink mobile:text-[14px]';

function AppHeader() {
  const { pageState } = useContext(TutorialNavigationContext);
  const { allLanguages, currentLanguage } = useContext(PreferencesContext).language;
  const { pathname } = useLocation();

  const tutorialPath = pageState.listOfPages[pageState.currentPageIndex] ?? '/tutorial';
  const { tabOne, tabTwo } = allLanguages[currentLanguage].global;
  const tabs = [
    {
      label: tabOne,
      path: tutorialPath,
      className: 'tutorial',
      active: pathname === '/' || pathname.startsWith('/tutorial'),
    },
    {
      label: tabTwo,
      path: '/rubicksCube',
      className: 'rubick',
      active: pathname === '/rubicksCube',
    },
    { label: 'Ranking', path: '/ranking', className: 'ranking', active: pathname === '/ranking' },
  ];

  return (
    <nav
      aria-label={currentLanguage === 'en-us' ? 'Main navigation' : 'Navegação principal'}
      className="headerContainer z-[1] box-border flex w-full gap-2 p-2"
    >
      {tabs.map(tab => (
        <Link
          key={tab.className}
          className={`${linkClass} ${tab.className} ${tab.active ? selectedLinkClass : inactiveLinkClass}`}
          to={tab.path}
          aria-current={tab.active ? 'page' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
export default AppHeader;
