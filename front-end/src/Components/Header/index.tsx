import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Context } from '../../Contexts/PaginationContext/Context';
import { Context as LanguageContext } from '../../Contexts/GeneralConfigContext/Context';

const linkClass =
  'headerLinkContainer flex-1 rounded-[10px] border border-solid text-center capitalize no-underline transition-colors duration-150 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const selectedLinkClass =
  'active border-accent bg-accent text-[19px] font-bold text-on-accent mobile:text-[18px]';
const inactiveLinkClass =
  'border-transparent bg-surface text-[17px] font-medium text-ink mobile:text-[16px]';

function Header() {
  const { pageState } = useContext(Context);
  const { allLanguages, currentLanguage } = useContext(LanguageContext).language;
  const { pathname } = useLocation();

  const cubeActive = pathname === '/rubicksCube';
  const tutorialPath = pageState.listOfPages[pageState.currentPageIndex] ?? '/tutorial';
  const { tabOne, tabTwo } = allLanguages[currentLanguage].global;

  return (
    <div className="headerContainer z-[1] box-border flex w-full gap-2 p-2">
      <Link
        className={`${linkClass} tutorial ${cubeActive ? inactiveLinkClass : selectedLinkClass}`}
        to={tutorialPath}
        aria-current={cubeActive ? undefined : 'page'}
      >
        <div className="py-[13px]">{tabOne}</div>
      </Link>
      <Link
        className={`${linkClass} rubick ${cubeActive ? selectedLinkClass : inactiveLinkClass}`}
        to="/rubicksCube"
        aria-current={cubeActive ? 'page' : undefined}
      >
        <div className="py-[13px]">{tabTwo}</div>
      </Link>
    </div>
  );
}
export default Header;
