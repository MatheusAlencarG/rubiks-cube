import React, { useRef, useContext } from "react";
import "./styles.css";

import Checkbox from "../Checkbox";
import { Context } from "../../Contexts/GeneralConfigContext/Context";

function GeneralConfigs() {
  const { setLanguage, currentLanguage, allLanguages } = useContext(Context).language;
  const popupRef = useRef<HTMLDivElement>(null);
  const { configurations, language } = allLanguages[currentLanguage].global;

  function openPopup() {
    popupRef.current?.classList.add('active');
  }

  function closePopup(event: React.MouseEvent<HTMLElement>) {
    const target = event.target;

    if (target === event?.currentTarget) {
      popupRef.current?.classList.remove('active');
    } else if (
      target instanceof Element && 
      target?.className === "generalConfigClose"
    ) {
      popupRef.current?.classList.remove('active');
    }
  }

  function toggleConfig(event: React.MouseEvent<HTMLElement>) {
    const configContainer = event.currentTarget.parentNode as Element;
    const currentArrow = event.currentTarget.childNodes.item(2) as Element;
    const configContent = configContainer.childNodes.item(1) as Element;
    
    if (currentArrow.classList.value.includes('active')) {
      currentArrow.classList.remove('active');
      configContent.classList.remove('active');
    } else {
      currentArrow.classList.add('active');
      configContent.classList.add('active');
    }
  }

  return(
    <>
      <img 
        className="generalConfigIcon" 
        onClick={openPopup} 
        src="/images/config-icon.svg" 
        alt="Config Icon" 
      />
      <div ref={popupRef} onClick={(event) => closePopup(event)} className="generalConfigPopup">
        <div className="generalConfigContainer">
          <img 
            className="generalConfigClose" 
            onClick={(event) => closePopup(event)} 
            src="/images/close-config.svg" 
            alt="Close Config Popup" 
          />
          <h3>{configurations}</h3>
          <div className="generalConfigContent">
            <div className="languageConfig">
              <p className="languageConfigTitle" onClick={toggleConfig}>
                <img className="iconConfig" src="/images/language-icon.svg" alt="Language Icon" />
                {language}
                <img className="configArrow" src="/images/simple-arrow.svg" alt="Simple Arrow" />
              </p>
              <div className="languageConfigContent">
                <Checkbox 
                  checked={currentLanguage === "pt-br"} 
                  functionEvent={() => setLanguage("pt-br")} 
                  text="Português" 
                />
                <Checkbox 
                  checked={currentLanguage === "en-us"} 
                  functionEvent={() => 
                  setLanguage("en-us")} 
                  text="English" 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default GeneralConfigs;
