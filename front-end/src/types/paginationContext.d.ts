import { ReactNode } from "react";

export interface PageSTate {
  currentPageIndex: number;
  listOfPages: string[];
  nextPage: string;
  prevPage: string
}

export interface ChangePageStateProps {
  newcurrentPageIndex: number;
}

export interface PaginationContextProps {
  children: ReactNode;
}