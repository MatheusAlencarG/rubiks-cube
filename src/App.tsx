import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PageRender from './Components/PageRender';

import Tutorial from './Pages/Tutorial';
import RubicksCube from './Pages/RubiksCube';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PageRender page={<Tutorial />} />} />
          <Route path="/tutorial" element={<PageRender page={<Tutorial />} />} />
          <Route path="/rubicksCube" element={<PageRender page={<RubicksCube />} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
