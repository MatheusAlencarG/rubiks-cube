import React, { useContext } from "react";
import "./styles.css";
import { Context } from "./FooterContext/Context";

import { Link } from "react-router-dom";

function Footer() {
  const { pageState, nextPage, prevPage, changePageState } = useContext(Context);

  console.log(pageState);
  
  function verifyPage(): boolean {
    return window.location.pathname.includes('tutorial') || window.location.pathname === '/';
  }

  function verifyPrevPage(): boolean {
    return pageState.prevPage !== ''
  }

  function verifyNextPage(): boolean {
    return pageState.nextPage !== ''
  }

  return (
    <div className="footerContainer">
      {verifyPage() && (
        <div className="navigatorContainer">
          {verifyPrevPage() ? (
            <div className="prevPage active">
              <Link onClick={prevPage} className="footerLink" to={pageState.prevPage}>
                <img className="pageImage" src="/images/simple-arrow.svg" alt="Prev Arrow" />
              </Link>
            </div>
          ) : (
            <div className="prevPage">
              <img className="pageImage" src="/images/simple-arrow-grey.svg" alt="Prev Arrow" />
            </div>
          )}
          {pageState.listOfPages.map((page, index) => {
            if (pageState.listOfPages.indexOf(page) === pageState.currentPageIndex) {
              return <Link to={page} onClick={() => changePageState({newcurrentPageIndex: index})}> 
                <div 
                  key={index} 
                  className="page active">
                </div>
              </Link>
            } 

            return <Link to={page} onClick={() => changePageState({newcurrentPageIndex: index})}>
              <div key={index} className="page"></div>
            </Link>
          })}
          {verifyNextPage() ? (
            <div className="nextPage active">
              <Link onClick={nextPage} className="footerLink" to={pageState.nextPage}>
                <img className="pageImage" src="/images/simple-arrow.svg" alt="Next Arrow" />
              </Link>
            </div>
          ) : (
            <div className="nextPage">
              <img className="pageImage" src="/images/simple-arrow-grey.svg" alt="Prev Arrow" />
            </div>
          )}
        </div>
      )}
      <p className="copyrightText">© 2023 Matheus Alencar Garcia, Codeby</p>
    </div>
  );
}

export default Footer;
