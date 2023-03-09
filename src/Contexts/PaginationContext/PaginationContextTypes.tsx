import { ReactNode } from "react";

export type PageSTate = {
  currentPageIndex: number;
  listOfPages: string[];
  nextPage: string;
  prevPage: string
}

export type ChangePageStateProps = {
  newcurrentPageIndex: number;
}

export type PaginationContextProps = {
  children: ReactNode;
}