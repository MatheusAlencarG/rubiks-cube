import React, { useEffect, useRef } from "react";
import "./styles.css";

import { Link, useLocation  } from "react-router-dom";

function Header() {
  const tutorialRef = useRef<HTMLDivElement>(null);
  const rubickRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  function detectPage(event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | undefined): void {
    const tutorialParent = tutorialRef.current?.parentNode as Element;
    const rubickParent = rubickRef.current?.parentNode as Element;

    if (!event) {
      const pathName = window.location.pathname;

      if (pathName === '/' || pathName === '/tutorial') {
        tutorialParent?.classList.add('active');
        rubickParent?.classList.remove('active');
      } else if (pathName === '/rubicksCube') {
        rubickParent?.classList.add('active');
        tutorialParent?.classList.remove('active');
      }

      return;
    }

    const target = event.target as HTMLAnchorElement;
    const parent = target.parentNode as HTMLElement;
    
    parent?.classList.add('active');

    if (parent === rubickParent) {
      tutorialParent?.classList.remove('active');
    } else {
      rubickParent?.classList.remove('active');
    }
  }

  useEffect(() => {
    console.log('teste');
    detectPage(undefined);
  }, [location])

  return (
    <div className="headerContainer">
        <Link 
          className="headerLinkContainer tutorial active" 
          to="/tutorial" 
          onClick={detectPage}
        >
          <div ref={tutorialRef}>Tutorial</div>
        </Link>
        <Link 
          className="headerLinkContainer rubick" 
          to="/rubicksCube"
          onClick={detectPage} 
        >
          <div ref={rubickRef}>Rubicks Cube</div>
        </Link>
    </div>
  );
}

export default Header;
