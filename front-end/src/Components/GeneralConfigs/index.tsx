import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import './styles.css';
import Checkbox from '../Checkbox';
import Account from '../Account';
import AppPreferences from '../AppPreferences';
import Disclosure from '../Disclosure';
import { Context } from '../../Contexts/GeneralConfigContext/Context';

function GeneralConfigs() {
  const { setLanguage, currentLanguage, allLanguages } = useContext(Context).language;
  const { configurations, language } = allLanguages[currentLanguage].global;
  const en = currentLanguage === 'en-us';
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previousTrigger = trigger.current;
    closeButton.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key === 'Tab') {
        const items = Array.from(
          dialog.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]'
          ) ?? []
        ).filter(item => !item.closest('[inert]'));
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      previousTrigger?.focus();
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="generalConfigIcon"
        aria-label={configurations}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <img src="/images/config-icon.svg" alt="Config Icon" />
      </button>
      <div
        onClick={event => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className={`generalConfigPopup ${open ? 'active' : ''}`}
        aria-hidden={!open}
      >
        <div
          ref={dialog}
          className="generalConfigContainer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            ref={closeButton}
            type="button"
            className="generalConfigClose"
            aria-label={en ? 'Close settings' : 'Fechar configurações'}
            onClick={() => setOpen(false)}
          >
            <img src="/images/close-config.svg" alt="Close Config Popup" />
          </button>
          <h3 id={titleId}>{configurations}</h3>
          <div className="generalConfigContent">
            <Account />
            <AppPreferences />
            <div className="languageConfig">
              <Disclosure
                title={
                  <>
                    <img
                      className="iconConfig"
                      src="/images/language-icon.svg"
                      alt="Language Icon"
                    />
                    {language}
                  </>
                }
                buttonClass="languageConfigTitle"
                contentClass="languageConfigContent"
                arrowClass="configArrow"
                arrowSrc="/images/simple-arrow.svg"
                arrowAlt="Simple Arrow"
              >
                <Checkbox
                  checked={currentLanguage === 'pt-br'}
                  functionEvent={() => setLanguage('pt-br')}
                  text="Português"
                />
                <Checkbox
                  checked={currentLanguage === 'en-us'}
                  functionEvent={() => setLanguage('en-us')}
                  text="English"
                />
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default GeneralConfigs;
