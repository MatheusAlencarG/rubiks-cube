import React, { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import AccountDialog from '../features/account/AccountDialog';
import PreferencesDialog from '../features/preferences/PreferencesDialog';
import TutorialNavigationProvider from '../features/tutorial/TutorialNavigationProvider';
import { PreferencesContext } from '../features/preferences/PreferencesContext';

function AppLayout() {
  const { currentLanguage, allLanguages } = useContext(PreferencesContext).language;
  const { projectTitle } = allLanguages[currentLanguage].global;

  return (
    <div className="pageRender relative flex h-screen w-screen flex-col items-center justify-center compact-screen:w-auto">
      <AccountDialog />
      <PreferencesDialog />
      <h1 className="projectTitle text-center font-normal capitalize text-on-canvas mobile:mt-[55px]">
        {projectTitle}
      </h1>
      <div className="pageContainer flex h-[76vh] w-[70vw] flex-col items-center justify-between overflow-hidden rounded-[15px] border-2 border-solid border-accent bg-surface short-screen:w-[90vw] compact-screen:mb-[30px] compact-screen:h-full compact-screen:min-h-[550px] mobile:w-[90vw]">
        <TutorialNavigationProvider>
          <AppHeader />
          <Suspense
            fallback={
              <p role="status">{currentLanguage === 'en-us' ? 'Loading…' : 'Carregando…'}</p>
            }
          >
            <Outlet />
          </Suspense>
          <AppFooter />
        </TutorialNavigationProvider>
      </div>
    </div>
  );
}

export default AppLayout;
