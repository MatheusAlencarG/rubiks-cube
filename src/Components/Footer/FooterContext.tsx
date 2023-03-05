import { createContext } from "react";

export const INITIAL_STATE = {
  pageState: {
    currentPageIndex: 0,
    listOfPages: [
      '/tutorial',
      '/tutorial/parts',
      '/tutorial/step/1',
      '/tutorial/step/2',
      '/tutorial/step/3',
      '/tutorial/step/4',
      '/tutorial/step/5',
      '/tutorial/step/6',
      '/tutorial/step/7',
    ],
    nextPage: '/tutorial',
    prevPage: ''
  },
  prevPage: () => {},
  nextPage: () => {},
}

export const Context = createContext(INITIAL_STATE);
