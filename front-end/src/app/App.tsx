import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppLayout from './AppLayout';
import TutorialOverviewPage from '../features/tutorial/TutorialOverviewPage';
import NotFoundPage from './NotFoundPage';

import PreferencesProvider from '../features/preferences/PreferencesProvider';
import AuthProvider from '../features/account/AuthProvider';
import { SWRConfig } from 'swr';
import CubeProvider from '../features/cube/state/CubeProvider';

const CubePage = lazy(() => import('../features/cube/CubePage'));
const RankingPage = lazy(() => import('../features/ranking/RankingPage'));
const TutorialPartsPage = lazy(() => import('../features/tutorial/TutorialPartsPage'));
const TutorialStepPage = lazy(() => import('../features/tutorial/TutorialStepPage'));
const swrConfig = { provider: () => new Map(), errorRetryCount: 1, revalidateOnFocus: false };

function App() {
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <PreferencesProvider>
          <CubeProvider>
            <Router>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<TutorialOverviewPage />} />
                  <Route path="tutorial" element={<TutorialOverviewPage />} />
                  <Route path="tutorial/parts" element={<TutorialPartsPage />} />
                  <Route path="tutorial/step/:id" element={<TutorialStepPage />} />
                  <Route path="rubicksCube" element={<CubePage />} />
                  <Route path="ranking" element={<RankingPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />}></Route>
              </Routes>
            </Router>
          </CubeProvider>
        </PreferencesProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
