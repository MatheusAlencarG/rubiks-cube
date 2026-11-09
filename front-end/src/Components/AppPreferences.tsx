import React, { useContext, useId, useState } from 'react';
import { Keyboard, Lightbulb, Palette } from 'lucide-react';
import { buttonClass, inputClass } from './controlStyles';
import { Context } from '../Contexts/GeneralConfigContext/Context';
import SettingsSection from './GeneralConfigs/SettingsSection';
import {
  ACTIONS,
  actionLabel,
  DEFAULT_BINDINGS,
  displayKey,
  KeyboardAction,
  normalizeKey,
  rebind,
  ThemeMode,
} from '../preferences';

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

  function assignShortcut(action: KeyboardAction, event: React.KeyboardEvent<HTMLInputElement>) {
    if (
      ['Tab', 'Escape', 'Shift'].includes(event.key) ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const key = normalizeKey(event.key);

    if (!key) {
      setKeyError(en ? 'Use a letter, number or arrow key.' : 'Use uma letra, número ou seta.');
      return;
    }

    setKeyError('');
    update({ keyboardBindings: rebind(ui.keyboardBindings, action, key) });
  }

  function resetShortcuts() {
    setKeyError('');
    update({ keyboardBindings: { ...DEFAULT_BINDINGS } });
  }

  return (
    <>
      <SettingsSection title={en ? 'Theme' : 'Tema'} icon={Palette}>
        <label htmlFor={themeId}>{en ? 'Appearance' : 'Aparência'}</label>
        <select
          id={themeId}
          className={inputClass}
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
                <input
                  className={`${inputClass} h-10`}
                  type="color"
                  name={key}
                  defaultValue={ui[key]}
                />
              </label>
            ))}
            <button className={`${buttonClass} col-span-2`} disabled={loading}>
              {en ? 'Apply colors' : 'Aplicar cores'}
            </button>
          </form>
        )}
      </SettingsSection>
      <SettingsSection title={en ? 'Keyboard controls' : 'Comandos do teclado'} icon={Keyboard}>
        <p>
          {en
            ? 'Focus a field and press a letter, number or arrow key. Shift remains the inverse modifier. Assigning a used key swaps the two controls.'
            : 'Selecione um campo e pressione uma letra, número ou seta. Shift continua invertendo os movimentos. Teclas já utilizadas são trocadas entre os dois comandos.'}
        </p>
        <div className="grid grid-cols-2 gap-3 mobile:grid-cols-1">
          {ACTIONS.map(action => {
            const label = actionLabel(action, en);

            return (
              <label key={action}>
                {label}
                <input
                  className={`${inputClass} text-center`}
                  readOnly
                  aria-label={label}
                  value={displayKey(ui.keyboardBindings[action])}
                  onKeyDown={event => assignShortcut(action, event)}
                />
              </label>
            );
          })}
        </div>
        {keyError && <p role="alert">{keyError}</p>}
        <button className={`${buttonClass} mt-3`} onClick={resetShortcuts}>
          {en ? 'Reset keyboard controls' : 'Restaurar comandos padrão'}
        </button>
      </SettingsSection>
      <SettingsSection title={en ? 'Hints' : 'Dicas'} icon={Lightbulb}>
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
      </SettingsSection>
    </>
  );
}
