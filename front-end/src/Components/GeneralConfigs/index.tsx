import React, { useContext, useEffect, useId, useRef, useState } from 'react';

import { Context } from '../../Contexts/GeneralConfigContext/Context';
import Account from '../Account';
import AppPreferences from '../AppPreferences';
import Checkbox from '../Checkbox';
import SettingsSection from './SettingsSection';

function GeneralConfigs() {
  const { currentLanguage, allLanguages } = useContext(Context).language;
  const { configurations } = allLanguages[currentLanguage].global;
  const closeLabel = currentLanguage === 'en-us' ? 'Close settings' : 'Fechar configurações';

  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    closeButtonRef.current?.focus();

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        wrapDialogFocus(event, dialogRef.current);
      }
    }

    document.addEventListener('keydown', handleDialogKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="absolute right-[15px] top-[15px] w-[40px] cursor-pointer border-0 bg-transparent p-0"
        aria-label={configurations}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <img
          className="block w-full [filter:var(--canvas-icon-filter)]"
          src="/images/config-icon.svg"
          alt="Config Icon"
        />
      </button>

      <div
        className={`generalConfigPopup fixed top-0 z-50 h-screen w-screen items-center justify-center bg-black/50 ${isOpen ? 'active flex' : 'hidden'}`}
        aria-hidden={!isOpen}
        onClick={handleBackdropClick}
      >
        <div
          ref={dialogRef}
          className="relative h-1/2 w-1/2 overflow-auto rounded-[10px] border-2 border-solid border-accent bg-canvas text-center text-on-canvas mobile:h-4/5 mobile:w-4/5"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="absolute right-[10px] top-[10px] w-[30px] cursor-pointer border-0 bg-transparent p-0"
            aria-label={closeLabel}
            onClick={() => setIsOpen(false)}
          >
            <img
              className="block w-full [filter:var(--canvas-icon-filter)]"
              src="/images/close-config.svg"
              alt="Close Config Popup"
            />
          </button>

          <h3 id={titleId} className="capitalize">
            {configurations}
          </h3>

          <div className="flex flex-col items-center justify-between gap-[20px] pb-[20px]">
            <Account />
            <AppPreferences />
            <LanguageSettings />
          </div>
        </div>
      </div>
    </>
  );
}

function LanguageSettings() {
  const { setLanguage, currentLanguage, allLanguages } = useContext(Context).language;
  const { language } = allLanguages[currentLanguage].global;

  const title = (
    <>
      <img
        className="w-[45px] [filter:var(--accent-icon-filter)]"
        src="/images/language-icon.svg"
        alt="Language Icon"
      />
      {language}
    </>
  );

  return (
    <SettingsSection title={title} variant="language">
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
    </SettingsSection>
  );
}

function wrapDialogFocus(event: KeyboardEvent, dialog: HTMLDivElement) {
  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]'
    )
  ).filter(element => !element.closest('[inert]'));

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const boundary = event.shiftKey ? first : last;
  const next = event.shiftKey ? last : first;

  if (document.activeElement === boundary) {
    event.preventDefault();
    next?.focus();
  }
}

export default GeneralConfigs;
