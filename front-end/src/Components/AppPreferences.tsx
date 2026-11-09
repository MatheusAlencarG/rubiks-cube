import React, { useContext, useId, useState } from 'react';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import Disclosure from './Disclosure';
import {
  ACTIONS,
  actionLabel,
  DEFAULT_BINDINGS,
  displayKey,
  normalizeKey,
  rebind,
  ThemeMode,
} from '../preferences';

function PreferenceSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="languageConfig">
      <Disclosure
        title={title}
        buttonClass="languageConfigTitle preferenceTitle"
        contentClass="preferenceContent"
        arrowClass="configArrow"
        arrowSrc="/images/simple-arrow.svg"
        arrowAlt="Simple Arrow"
      >
        {children}
      </Disclosure>
    </section>
  );
}
export default function AppPreferences() {
  const {
    language: { currentLanguage },
    preferences: { ui, update, loading },
  } = useContext(Context);
  const en = currentLanguage === 'en-us';
  const themeId = useId();
  const [keyError, setKeyError] = useState('');
  const colors = [
    ['themePrimaryColor', en ? 'Page background' : 'Fundo da página'],
    ['themeSurfaceColor', en ? 'Panels' : 'Painéis'],
    ['themeSecondaryColor', en ? 'Text' : 'Texto'],
    ['themeAccentColor', en ? 'Accent' : 'Destaque'],
  ] as const;
  function saveColors(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    update({
      themeMode: 'custom',
      themePrimaryColor: String(form.get('themePrimaryColor')),
      themeSurfaceColor: String(form.get('themeSurfaceColor')),
      themeSecondaryColor: String(form.get('themeSecondaryColor')),
      themeAccentColor: String(form.get('themeAccentColor')),
    });
  }
  return (
    <>
      <PreferenceSection title={en ? 'Theme' : 'Tema'}>
        <label htmlFor={themeId}>{en ? 'Appearance' : 'Aparência'}</label>
        <select
          id={themeId}
          className="app-input"
          value={ui.themeMode}
          onChange={event => update({ themeMode: event.target.value as ThemeMode })}
        >
          <option value="dark">{en ? 'Dark' : 'Escuro'}</option>
          <option value="light">{en ? 'Light' : 'Claro'}</option>
          <option value="custom">{en ? 'Custom' : 'Personalizado'}</option>
        </select>
        {ui.themeMode === 'custom' && (
          <form
            key={colors.map(([key]) => ui[key]).join()}
            className="mt-3 grid grid-cols-2 gap-3"
            onSubmit={saveColors}
          >
            {colors.map(([key, label]) => (
              <label key={key}>
                {label}
                <input className="app-input h-10" type="color" name={key} defaultValue={ui[key]} />
              </label>
            ))}
            <button className="app-button col-span-2" disabled={loading}>
              {en ? 'Apply colors' : 'Aplicar cores'}
            </button>
          </form>
        )}
      </PreferenceSection>
      <PreferenceSection title={en ? 'Keyboard controls' : 'Comandos do teclado'}>
        <p>
          {en
            ? 'Focus a field and press a letter, number or arrow key. Shift remains the inverse modifier. Assigning a used key swaps the two controls.'
            : 'Selecione um campo e pressione uma letra, número ou seta. Shift continua invertendo os movimentos. Teclas já utilizadas são trocadas entre os dois comandos.'}
        </p>
        <div className="grid grid-cols-2 gap-3 mobile:grid-cols-1">
          {ACTIONS.map(action => (
            <label key={action}>
              {actionLabel(action, en)}
              <input
                className="app-input text-center"
                readOnly
                aria-label={actionLabel(action, en)}
                value={displayKey(ui.keyboardBindings[action])}
                onKeyDown={event => {
                  if (
                    ['Tab', 'Escape', 'Shift'].includes(event.key) ||
                    event.ctrlKey ||
                    event.metaKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  const key = normalizeKey(event.key);
                  if (!key) {
                    setKeyError(
                      en ? 'Use a letter, number or arrow key.' : 'Use uma letra, número ou seta.'
                    );
                    return;
                  }
                  setKeyError('');
                  update({ keyboardBindings: rebind(ui.keyboardBindings, action, key) });
                }}
              />
            </label>
          ))}
        </div>
        {keyError && <p role="alert">{keyError}</p>}
        <button
          className="app-button mt-3"
          onClick={() => {
            setKeyError('');
            update({ keyboardBindings: { ...DEFAULT_BINDINGS } });
          }}
        >
          {en ? 'Reset keyboard controls' : 'Restaurar comandos padrão'}
        </button>
      </PreferenceSection>
      <PreferenceSection title={en ? 'Hints' : 'Dicas'}>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ui.hintsEnabled}
            onChange={event => update({ hintsEnabled: event.target.checked })}
          />
          {en ? 'Hints mode' : 'Modo dicas'}
        </label>
        <p>
          {en
            ? 'Preference saved. The hints system will be available in a future update.'
            : 'Preferência guardada. O sistema de dicas será disponibilizado em uma próxima atualização.'}
        </p>
      </PreferenceSection>
    </>
  );
}
