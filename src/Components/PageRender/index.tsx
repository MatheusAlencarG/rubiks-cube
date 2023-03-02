import React from "react";
import "./styles.css";

import Header from "../Header";
import Footer from "../Footer";

type PageRenderProps = {
  page: React.ReactElement | null;
}

function PageRender({ page }: PageRenderProps) {
  return(
    <div className="pageRender">
      <h1 className="projectTitle">Rubick's Cube Project</h1>
      <div className="pageContainer">
        <Header />
        {page}
        <Footer />
      </div>
    </div>
  );
}

export default PageRender;
