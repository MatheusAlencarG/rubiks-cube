import React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

import Header from "../Header";
import Footer from "../Footer";
import PaginationContext from "../../Contexts/PaginationContext/PaginationContext";
import RubicksCubeContext from "../../Contexts/RubicksCubeContext/RubicksCubeContext";

function PageRender({ page }: { page: React.ReactElement }) {
  const params = useParams();
  
  const clonePage = React.cloneElement(
    page,
    {
      ...params,
      ...page.props
    }
  );

  return(
    <div className="pageRender">
      <h1 className="projectTitle">Rubick's Cube Project</h1>
      <div className="pageContainer">
        <PaginationContext>
          <RubicksCubeContext>
            <Header />
            {clonePage}
            <Footer />
          </RubicksCubeContext>
        </PaginationContext>
      </div>
    </div>
  );
}

export default PageRender;
