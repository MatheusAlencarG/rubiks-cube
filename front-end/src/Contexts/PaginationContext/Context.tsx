import { createContext } from 'react';
export interface PageState {
  currentPageIndex: number;
  listOfPages: string[];
  nextPage: string;
  prevPage: string;
}
export const Context = createContext<{ pageState: PageState }>({
  pageState: { currentPageIndex: 0, listOfPages: ['/tutorial'], nextPage: '', prevPage: '' },
});
