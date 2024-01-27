import { createContext } from "react";
import { Initial_State_Language, Context_Language, CurrentLanguageValues } from "../../types/index";

const allLanguages: Initial_State_Language = {
  "en-us": {
    global: {
      projectTitle: "rubick's cube project",
      tabOne: "tutorial",
      tabTwo: "rubick's cube",
      portuguese: "portuguese",
      configurations: "configurations",
      english: "english",
      language: "language",
    },
    tutorialPage: {
      title: "Game Commands",
      description: "Next tutorial step, we have a explanation of parts positions, and step by step to finish a cube 3X3.",
      commandW: "Red face movement",
      commandA: "Blue face movement",
      commandS: "Orange face movement",
      commandD: "Green face movement",
      commandQ: "Yellow face movement",
      commandE: "White face movement",
      commandArrowDown: "Cube bottom movement",
      commandArrowLeft: "Cube left movement",
      commandArrowUp: "Cube top movement",
      commandArrowRight: "Cube right movement",
    },
    tutorialParts: {
      description: "Keep all this in mind, we will use everything to the next page, you will find a step by step to finish a cube"
    },
    tutorialSteps: {
      videoDescription: "Any more question? Here we have some YouTube videos with more details",
      part: "part",
    }
  },
  "pt-br": {
    global: {
      projectTitle: "projeto do cubo mágico",
      tabOne: "tutorial",
      tabTwo: "cubo mágico",
      portuguese: "português",
      configurations: "configurações",
      english: "inglês",
      language: "idiomas"
    },
    tutorialPage: {
      title: "Comandos do Jogo",
      description: "No próximo passo, nós temos uma explicação das posições das peças do cubo, e o passo a passo para finalizar o cube 3X3.",
      commandW: "Movimento da face vermelha",
      commandA: "Movimento da face azul",
      commandS: "Movimento da face laranja",
      commandD: "Movimento da face verde",
      commandQ: "Movimento da face amarela",
      commandE: "Movimento da face branca",
      commandArrowDown: "Move o cubo para baixo",
      commandArrowLeft: "Move o cubo para esquerda",
      commandArrowUp: "Move o cubo para cima",
      commandArrowRight: "Move o cubo para direita",
    },
    tutorialParts: {
      description: "Tendo tudo isso em mente, nós vamos usar tudo isso na próxima página, você vai encontrar um passo a passo para finalizar o cubo"
    },
    tutorialSteps: {
      videoDescription: "Mais alguma dúvida? Aqui temos alguns videos no YouTube com mais detalhes",
      part: "Parte",
    }
  },
}

export const INITIAL_STATE: Context_Language = {
  language: {
    currentLanguage: "pt-br",
    allLanguages,
    setLanguage: (language: CurrentLanguageValues) => {},
  }
}

export const Context = createContext(INITIAL_STATE);
