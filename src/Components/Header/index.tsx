import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.css";

import { Link, useLocation } from "react-router-dom";
import { Context } from "../../Contexts/PaginationContext/Context";

function Header() {
  const { pageState } = useContext(Context);
  const [ tutorialLink, setTutorialLink ] = useState<string>();
  const tutorialRef = useRef<HTMLDivElement>(null);
  const rubickRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  function detectPage(): void {
    const tutorialParent = tutorialRef.current?.parentNode as Element;
    const rubickParent = rubickRef.current?.parentNode as Element;
    const pathName = window.location.pathname;

    if (pathName.includes('tutorial')) {
      tutorialParent?.classList.add('active');
      rubickParent?.classList.remove('active');
    } else if (pathName === '/rubicksCube') {
      rubickParent?.classList.add('active');
      tutorialParent?.classList.remove('active');
    }
  }
  
  useEffect(() => {
    detectPage();
    setTutorialLink(pageState.listOfPages[pageState.currentPageIndex]);
  }, [location])

  return (
    <div className="headerContainer">
        <Link 
          className="headerLinkContainer tutorial active" 
          to={tutorialLink ?? '/tutorial'} 
        >
          <div ref={tutorialRef}>Tutorial</div>
        </Link>
        <Link 
          className="headerLinkContainer rubick" 
          to="/rubicksCube"
        >
          <div ref={rubickRef}>Rubicks Cube</div>
        </Link>
    </div>
  );
}

export default Header;
