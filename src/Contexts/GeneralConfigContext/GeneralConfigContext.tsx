import React, { useState } from "react";
import { Context, INITIAL_STATE } from "./Context";

import { GeneralConfigContextProps, CurrentLanguageValues } from "../../types";

function GeneralConfigContext({ children }: GeneralConfigContextProps) {
  const [ currentLanguage, setCurrentLanguage ] = useState<CurrentLanguageValues>("pt-br");

  return(
    <Context.Provider value={{
      language: {
        currentLanguage,
        allLanguages: INITIAL_STATE.language.allLanguages,
        setLanguage: (language: CurrentLanguageValues) => setCurrentLanguage(language),
      }
    }}>
      {children}
    </Context.Provider>
  );
}

export default GeneralConfigContext;