import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import Header from '../Header';
import Footer from '../Footer';
import GeneralConfigs from '../GeneralConfigs';
import PaginationContext from '../../Contexts/PaginationContext/PaginationContext';
import { Context } from '../../Contexts/GeneralConfigContext/Context';
import RubicksCube3x3Context from '../../Contexts/RubicksCubeContext/RubicksCube3x3Context';

function PageRender({ page }: { page: React.ReactElement }) {
  const params = useParams();
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { projectTitle } = allLanguages[currentLanguage].global;

  const clonePage = React.cloneElement(page, {
    ...params,
    ...page.props,
  });

  return (
    <div className="pageRender relative flex h-screen w-screen flex-col items-center justify-center compact-screen:h-auto compact-screen:w-auto">
      <GeneralConfigs />
      <h1 className="projectTitle text-center font-normal capitalize text-surface mobile:mt-[55px]">
        {projectTitle}
      </h1>
      <div className="pageContainer flex h-[76vh] w-[70vw] flex-col items-center justify-between overflow-hidden rounded-[15px] border-2 border-solid border-accent bg-surface short-screen:w-[90vw] compact-screen:mb-[30px] compact-screen:h-full compact-screen:min-h-[550px] mobile:w-[90vw]">
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
