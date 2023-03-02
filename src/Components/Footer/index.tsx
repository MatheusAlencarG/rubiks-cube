import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

function Footer() {

  function verifyPage(): boolean {
    return window.location.pathname.includes('tutorial');
  }

  return (
    <div className="footerContainer">
      {verifyPage() && (
        <div className="prevPage">
          <Link className="footerLink" to="/tutorial">
            🠸
          </Link>
        </div>
      )}
      <p className="copyrightText">© 2023 Matheus Alencar Garcia, Portugal, Braga</p>
      {verifyPage() && (
        <div className="nextPage">
          <Link className="footerLink" to="/tutorial/1">
            🠺
          </Link>
      </div>
      )}
      
    </div>
  );
}

export default Footer;
