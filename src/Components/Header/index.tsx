import React from "react";
import "./styles.css";

import { Link } from "react-router-dom";

type renderLinkProps = {
  link: string;
  label: string;
}

function Header() {

  function renderLink({ link, label }: renderLinkProps) {
    return(
      <div className="headerLinkContainer">
        <Link className="headerLink" to={link}>{label}</Link>
      </div>
    );
  }

  return (
    <div className="headerContainer">
        {renderLink({ link: "/tutorial", label: "Tutorial" })}
        {renderLink({ link: "/rubicksCube", label: "Rubicks Cube" })}
    </div>
  );
}

export default Header;
