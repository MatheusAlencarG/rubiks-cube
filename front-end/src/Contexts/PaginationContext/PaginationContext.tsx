import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Context, INITIAL_STATE } from './Context';
import { ChangePageStateProps, PaginationContextProps, PageSTate } from '../../types/index';

function PaginationContext({ children }: PaginationContextProps) {
  const location = useLocation();
  const [pageState, setPageState] = useState<PageSTate>(INITIAL_STATE.pageState);

  function prevPage() {
    const newcurrentPageIndex = pageState.currentPageIndex - 1;

    changePageState({ newcurrentPageIndex });
  }

  function nextPage() {
    const newcurrentPageIndex = pageState.currentPageIndex + 1;

    changePageState({ newcurrentPageIndex });
  }

  const changePageState = useCallback(({ newcurrentPageIndex }: ChangePageStateProps) => {
    setPageState(previous => ({
      ...previous,
      currentPageIndex: newcurrentPageIndex,
      nextPage: previous.listOfPages[newcurrentPageIndex + 1] ?? '',
      prevPage: previous.listOfPages[newcurrentPageIndex - 1] ?? '',
    }));
  }, []);

  useEffect(() => {
    const currentPage = pageState.listOfPages.find(page => page === window.location.pathname);

    if (!currentPage) return;

    const currentPageIndex = pageState.listOfPages.indexOf(currentPage);

    changePageState({ newcurrentPageIndex: currentPageIndex });
  }, [location, pageState.listOfPages, changePageState]);

  return (
    <Context.Provider
      value={{
        pageState,
        prevPage,
        nextPage,
        changePageState,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default PaginationContext;
