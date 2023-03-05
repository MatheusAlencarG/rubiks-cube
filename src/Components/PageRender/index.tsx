import React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

import Header from "../Header";
import Footer from "../Footer";

type PageRenderProps = {
  page: React.ReactElement;
}

function PageRender({ page }: PageRenderProps) {
  const params = useParams();
  
  const clonePage = React.cloneElement(
    page,
    {
      ...params,
      ...page.props
    }
  )

  return(
    <div className="pageRender">
      <h1 className="projectTitle">Rubick's Cube Project</h1>
      <div className="pageContainer">
        <Header />
        {clonePage}
        <Footer />
      </div>
    </div>
  );
}

export default PageRender;
