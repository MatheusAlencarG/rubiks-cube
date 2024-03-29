import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PageRender from './Components/PageRender';
import MainTutorial from './Pages/Tutorial/MainTutorial';
import RubicksCube from './Pages/RubiksCube3x3';
import TutorialParts from './Pages/Tutorial/TutorialParts';
import TutorialStep from './Pages/Tutorial/TutorialStep';
import PageNotFound from './Pages/PageNotFound';

import GeneralConfigContext from "./Contexts/GeneralConfigContext/GeneralConfigContext";

function App() {
  return (
    <GeneralConfigContext>
      <Router>
        <Routes>
          <Route path="/" element={<PageRender page={<MainTutorial />} />} />
          <Route path="/tutorial" element={<PageRender page={<MainTutorial />} />} />
          <Route path="/tutorial/parts" element={<PageRender page={<TutorialParts />} />} />
          <Route path="/tutorial/step/:id" element={<PageRender page={<TutorialStep />} />} />
          <Route path="*" element={<PageNotFound />}></Route>
          <Route path="/rubicksCube" element={<PageRender page={<RubicksCube />} />} />
        </Routes>
      </Router>
    </GeneralConfigContext>
  );
}

export default App;
