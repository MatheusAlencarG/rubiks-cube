import React, { useEffect, useRef } from "react";
import "./styles.css";

import { Link, useLocation } from "react-router-dom";

function Header() {
  const tutorialRef = useRef<HTMLDivElement>(null);
  const rubickRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  function detectPage(): void {
    const tutorialParent = tutorialRef.current?.parentNode as Element;
    const rubickParent = rubickRef.current?.parentNode as Element;
    const pathName = window.location.pathname;

    if (pathName === '/' || pathName === '/tutorial') {
      tutorialParent?.classList.add('active');
      rubickParent?.classList.remove('active');
    } else if (pathName === '/rubicksCube') {
      rubickParent?.classList.add('active');
      tutorialParent?.classList.remove('active');
    }
  }
  
  useEffect(() => {
    detectPage();
  }, [location])

  return (
    <div className="headerContainer">
        <Link 
          className="headerLinkContainer tutorial active" 
          to="/tutorial" 
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
