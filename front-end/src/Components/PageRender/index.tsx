import React, { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header';
import Footer from '../Footer';
import GeneralConfigs from '../GeneralConfigs';
import PaginationContext from '../../Contexts/PaginationContext/PaginationContext';
import { Context } from '../../Contexts/GeneralConfigContext/Context';

function PageRender() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { projectTitle } = allLanguages[currentLanguage].global;

  return (
    <div className="pageRender relative flex h-screen w-screen flex-col items-center justify-center compact-screen:h-auto compact-screen:w-auto">
      <GeneralConfigs />
      <h1 className="projectTitle text-center font-normal capitalize text-on-canvas mobile:mt-[55px]">
        {projectTitle}
      </h1>
      <div className="pageContainer flex h-[76vh] w-[70vw] flex-col items-center justify-between overflow-hidden rounded-[15px] border-2 border-solid border-accent bg-surface short-screen:w-[90vw] compact-screen:mb-[30px] compact-screen:h-full compact-screen:min-h-[550px] mobile:w-[90vw]">
        <PaginationContext>
          <Header />
          <Suspense
            fallback={
              <p role="status">{currentLanguage === 'en-us' ? 'Loading…' : 'Carregando…'}</p>
            }
          >
            <Outlet />
          </Suspense>
          <Footer />
        </PaginationContext>
      </div>
    </div>
  );
}

export default PageRender;
