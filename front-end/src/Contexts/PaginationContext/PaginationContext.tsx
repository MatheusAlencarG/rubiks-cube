import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { Context } from './Context';
import { useTutorials } from '../../api/hooks';

function PaginationContext({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { data } = useTutorials();
  const listOfPages = data?.map(item =>
    item.kind === 'overview'
      ? '/tutorial'
      : item.kind === 'parts'
        ? '/tutorial/parts'
        : `/tutorial/step/${item.stepNumber}`
  ) ?? ['/tutorial'];
  const route = location.pathname === '/' ? '/tutorial' : location.pathname;
  const lastTutorial = useRef('/tutorial');
  useEffect(() => {
    if (route.startsWith('/tutorial')) lastTutorial.current = route;
  }, [route]);
  const currentPageIndex = Math.max(
    0,
    listOfPages.indexOf(route.startsWith('/tutorial') ? route : lastTutorial.current)
  );
  const pageState = {
    listOfPages,
    currentPageIndex,
    nextPage: listOfPages[currentPageIndex + 1] ?? '',
    prevPage: listOfPages[currentPageIndex - 1] ?? '',
  };

  return <Context.Provider value={{ pageState }}>{children}</Context.Provider>;
}

export default PaginationContext;
