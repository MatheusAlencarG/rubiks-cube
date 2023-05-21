import { ReactNode } from "react";

export interface Initial_State_Language {
  "pt-br": Language;
  "en-us": Language;
}

export interface Language {
  global: {
    projectTitle: string;
    tabOne: string;
    tabTwo: string;
    portuguese: string;
    english: string;
    language: string;
    configurations: string;
  },
  tutorialPage: {
    title: string;
    description: string;
    commandW: string;
    commandA: string;
    commandS: string;
    commandD: string;
    commandQ: string;
    commandE: string;
    commandArrowDown: string;
    commandArrowLeft: string;
    commandArrowUp: string;
    commandArrowRight: string;
  },
  tutorialParts: {
    description: string;
  },
  tutorialSteps: {
    videoDescription: string;
    part: string;
  }
}

export interface GeneralConfigContextProps {
  children: ReactNode;
}

export interface Context_Language {
  language: {
    currentLanguage: CurrentLanguageValues,
    allLanguages: Initial_State_Language,
    setLanguage: (language: CurrentLanguageValues) => void;
  }
}

export type CurrentLanguageValues = "pt-br" | "en-us"