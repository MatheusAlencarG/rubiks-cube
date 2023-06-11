import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

import Header from "../Header";
import Footer from "../Footer";
import GeneralConfigs from "../GeneralConfigs";
import PaginationContext from "../../Contexts/PaginationContext/PaginationContext";
import { Context } from "../../Contexts/GeneralConfigContext/Context";
import RubicksCube3x3Context from "../../Contexts/RubicksCubeContext/RubicksCube3x3Context";

function PageRender({ page }: { page: React.ReactElement }) {
  const params = useParams();
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { projectTitle } = allLanguages[currentLanguage].global;

  const clonePage = React.cloneElement(
    page,
    {
      ...params,
      ...page.props
    }
  );

  return(
      <div className="pageRender">
        <GeneralConfigs />
        <h1 className="projectTitle">{projectTitle}</h1>
        <div className="pageContainer">
          <RubicksCube3x3Context>
            <PaginationContext>
              <Header />
              {clonePage}
              <Footer />
            </PaginationContext>
          </RubicksCube3x3Context>
        </div>
      </div>
  );
}

export default PageRender;
