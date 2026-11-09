import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PageRender from './Components/PageRender';
import MainTutorial from './Pages/Tutorial/MainTutorial';
import PageNotFound from './Pages/PageNotFound';

import GeneralConfigContext from './Contexts/GeneralConfigContext/GeneralConfigContext';
import AuthProvider from './Contexts/AuthContext';
import { SWRConfig } from 'swr';
import RubicksCube3x3Context from './Contexts/RubicksCubeContext/RubicksCube3x3Context';

const RubicksCube = lazy(() => import('./Pages/RubiksCube3x3'));
const TutorialParts = lazy(() => import('./Pages/Tutorial/TutorialParts'));
const TutorialStep = lazy(() => import('./Pages/Tutorial/TutorialStep'));
const swrConfig = { provider: () => new Map(), errorRetryCount: 1, revalidateOnFocus: false };

function App() {
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <GeneralConfigContext>
          <RubicksCube3x3Context>
            <Router>
              <Routes>
                <Route element={<PageRender />}>
                  <Route index element={<MainTutorial />} />
                  <Route path="tutorial" element={<MainTutorial />} />
                  <Route path="tutorial/parts" element={<TutorialParts />} />
                  <Route path="tutorial/step/:id" element={<TutorialStep />} />
                  <Route path="rubicksCube" element={<RubicksCube />} />
                </Route>
                <Route path="*" element={<PageNotFound />}></Route>
              </Routes>
            </Router>
          </RubicksCube3x3Context>
        </GeneralConfigContext>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
