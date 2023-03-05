import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PageRender from './Components/PageRender';
import { Context, INITIAL_STATE } from './Components/Footer/FooterContext';
import MainTutorial from './Pages/Tutorial/MainTutorial';
import RubicksCube from './Pages/RubiksCube';
import TutorialParts from './Pages/Tutorial/TutorialParts';
import TutorialStep from './Pages/Tutorial/TutorialStep';
import PageNotFound from './Pages/PageNotFound'

type PageSTate = {
  currentPageIndex: number;
  listOfPages: string[];
  nextPage: string;
  prevPage: string
}

function App() {
  const [ pageState, setPageState ] = useState<PageSTate>(INITIAL_STATE.pageState);

  function prevPage() {
    const newcurrentPageIndex = pageState.currentPageIndex - 1;

    setPageState({
      ...pageState,
      currentPageIndex: newcurrentPageIndex,
      nextPage: pageState.listOfPages[newcurrentPageIndex + 1] ?? '',
      prevPage: pageState.listOfPages[newcurrentPageIndex - 1] ?? ''
    })
  }
  
  function nextPage() {
    const newcurrentPageIndex = pageState.currentPageIndex + 1;

    setPageState({
      ...pageState,
      currentPageIndex: newcurrentPageIndex,
      nextPage: pageState.listOfPages[newcurrentPageIndex + 1] ?? '',
      prevPage: pageState.listOfPages[newcurrentPageIndex - 1] ?? ''
    })
  }

  useEffect(() => {
    console.log('mudei');
    
    const currentPage = pageState.listOfPages.find((page) => page === window.location.pathname);
    
    if (!currentPage) return;

    const currentPageIndex = pageState.listOfPages.indexOf(currentPage);
    
    setPageState({
      ...pageState,
      currentPageIndex,
      nextPage: pageState.listOfPages[currentPageIndex + 1],
      prevPage: pageState.listOfPages[currentPageIndex - 1]
    })
  }, [])

  return (
    <>
      <Router>
        <Context.Provider value={{
          pageState,
          prevPage,
          nextPage,
        }}>
          <Routes>
            <Route path="/" element={<PageRender page={<MainTutorial />} />} />
            <Route path="/tutorial" element={<PageRender page={<MainTutorial />} />} />
            <Route path="/tutorial/parts" element={<PageRender page={<TutorialParts />} />} />
            <Route path="/tutorial/step/:id" element={<PageRender page={<TutorialStep />} />} />
          </Routes>
          <Routes>
            <Route path="*" element={<PageNotFound />}></Route>
            <Route path="/rubicksCube" element={<PageRender page={<RubicksCube />} />} />
          </Routes>
        </Context.Provider>
      </Router>
    </>
  );
}

export default App;
