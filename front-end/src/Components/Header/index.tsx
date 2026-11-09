import React, { useContext } from 'react';
import './styles.css';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../../Contexts/PaginationContext/Context';
import { Context as LanguageContext } from '../../Contexts/GeneralConfigContext/Context';

const linkClass = 'headerLinkContainer bg-surface text-center capitalize text-ink no-underline';
function Header() {
  const { pageState } = useContext(Context);
  const { allLanguages, currentLanguage } = useContext(LanguageContext).language;
  const { pathname } = useLocation();
  const cubeActive = pathname === '/rubicksCube';
  const { tabOne, tabTwo } = allLanguages[currentLanguage].global;
  return (
    <div className="headerContainer z-[1] flex w-full">
      <Link
        className={`${linkClass} tutorial ${cubeActive ? '' : 'active'}`}
        to={pageState.listOfPages[pageState.currentPageIndex] ?? '/tutorial'}
        aria-current={cubeActive ? undefined : 'page'}
      >
        <div className="py-[13px]">{tabOne}</div>
      </Link>
      <Link
        className={`${linkClass} rubick ${cubeActive ? 'active' : ''}`}
        to="/rubicksCube"
        aria-current={cubeActive ? 'page' : undefined}
      >
        <div className="py-[13px]">{tabTwo}</div>
      </Link>
    </div>
  );
}
export default Header;
