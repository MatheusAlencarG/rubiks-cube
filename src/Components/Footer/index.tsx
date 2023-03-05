import React, { useContext } from "react";
import "./styles.css";
import { Context } from "./FooterContext";

import { Link } from "react-router-dom";

function Footer() {
  const { pageState, nextPage, prevPage } = useContext(Context);

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
      {verifyPage() && verifyPrevPage() && (
        <div className="prevPage">
          <Link onClick={prevPage} className="footerLink" to={pageState.prevPage}>
            <img src="/images/simple-arrow.svg" alt="Prev Arrow" />
          </Link>
        </div>
      )}
      <p className="copyrightText">© 2023 Matheus Alencar Garcia, Codeby</p>
      {verifyPage() && verifyNextPage() && (
        <div className="nextPage">
          <Link onClick={nextPage} className="footerLink" to={pageState.nextPage}>
            <img src="/images/simple-arrow.svg" alt="Next Arrow" />
          </Link>
      </div>
      )}
      
    </div>
  );
}

export default Footer;
