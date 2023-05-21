import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

import Header from "../Header";
import Footer from "../Footer";
import GeneralConfigs from "../GeneralConfigs";
import PaginationContext from "../../Contexts/PaginationContext/PaginationContext";
import RubicksCubeContext from "../../Contexts/RubicksCubeContext/RubicksCubeContext";
import { Context } from "../../Contexts/GeneralConfigContext/Context";

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
