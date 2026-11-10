import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { PreferencesContext, INITIAL_STATE } from './PreferencesContext';

import { GeneralConfigContextProps, CurrentLanguageValues } from './preferenceTypes';
import { useAuth } from '../account/AuthProvider';
import { usePrivateCollection } from '../account/usePrivateCollections';
import { listAll, writeDocument } from '../../shared/api/strapiClient';
import type { Settings, SettingsPatch } from './preferenceApiTypes';
import {
  contrastingColor,
  DARK_COLORS,
  LIGHT_COLORS,
  readUiPreferences,
  UiPreferences,
} from './preferences';

function localUi(): UiPreferences {
  try {
    return readUiPreferences(JSON.parse(localStorage.getItem('rubiks.ui.v1') || '{}'));
  } catch {
    return readUiPreferences({});
  }
}

function localLanguage(): CurrentLanguageValues {
  try {
    return localStorage.getItem('rubiks.language.v1') === 'en-us' ? 'en-us' : 'pt-br';
  } catch {
    return 'pt-br';
  }
}

function PreferencesProvider({ children }: GeneralConfigContextProps) {
  const [currentLanguage, setCurrentLanguage] = useState<CurrentLanguageValues>(localLanguage);
  const [ui, setUi] = useState(localUi);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const { token, user } = useAuth();
  const { data, error, isLoading, mutate } = usePrivateCollection<Settings>('user-settings');
  const settings = data?.[0];

  const latestUi = useRef(ui);
  const latest = useRef(data);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const editedToken = useRef<string | null>(null);
  const uiEditedToken = useRef<string | null>(null);
  const currentToken = useRef(token);

  latestUi.current = ui;
  latest.current = data;
  currentToken.current = token;

  useEffect(() => {
    setSaveError('');
  }, [token]);

  useEffect(() => {
    if (settings && editedToken.current !== token)
      setCurrentLanguage(settings.language === 'en-US' ? 'en-us' : 'pt-br');
  }, [settings, token]);

  useEffect(() => {
    if (settings && uiEditedToken.current !== token) setUi(readUiPreferences(settings));
  }, [settings, token]);

  useLayoutEffect(() => {
    try {
      localStorage.setItem('rubiks.ui.v1', JSON.stringify(ui));
    } catch {}

    applyTheme(ui);
  }, [ui]);

  useEffect(() => {
    try {
      localStorage.setItem('rubiks.language.v1', currentLanguage);
    } catch {}
  }, [currentLanguage]);

  async function save(changes: SettingsPatch) {
    if (!token || !user) return;

    const requestToken = token;
    setSaving(true);
    setSaveError('');

    const task = queue.current
      .catch(() => {})
      .then(async () => {
        if (currentToken.current !== requestToken) return;

        const existing =
          latest.current?.[0] ?? (await listAll<Settings>('user-settings', requestToken))[0];
        const result = await writeDocument<Settings>(
          'user-settings',
          requestToken,
          existing
            ? changes
            : {
                ...latestUi.current,
                language: currentLanguage === 'en-us' ? 'en-US' : 'pt-BR',
                ...changes,
              },
          existing?.documentId
        );

        if (currentToken.current !== requestToken) return;
        latest.current = [result];
        await mutate([result], { revalidate: false });
      });
    queue.current = task;

    try {
      await task;
    } catch (failure) {
      if (currentToken.current === requestToken) setSaveError((failure as Error).message);
      throw failure;
    } finally {
      if (queue.current === task) setSaving(false);
    }
  }

  function setLanguage(language: CurrentLanguageValues) {
    setCurrentLanguage(language);

    if (token) {
      editedToken.current = token;
      void save({ language: language === 'en-us' ? 'en-US' : 'pt-BR' }).catch(() => {});
    }
  }

  function update(data: Partial<UiPreferences>) {
    const next = readUiPreferences({ ...latestUi.current, ...data });
    latestUi.current = next;
    setUi(next);

    if (token) {
      uiEditedToken.current = token;
      void save(data).catch(() => {});
    }
  }

  return (
    <PreferencesContext.Provider
      value={{
        preferences: {
          settings,
          loading: Boolean(user && isLoading) || saving,
          error: saveError || (error as Error | undefined)?.message || '',
          ui,
          update,
          save,
        },
        language: {
          currentLanguage,
          allLanguages: INITIAL_STATE.language.allLanguages,
          setLanguage,
        },
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

function applyTheme(ui: UiPreferences) {
  const palette = { custom: ui, light: LIGHT_COLORS, dark: DARK_COLORS }[ui.themeMode];
  const canvasText = contrastingColor(palette.themePrimaryColor);
  const accentText = contrastingColor(palette.themeAccentColor);
  const isLightCanvas = canvasText === '#151513';

  const root = document.documentElement;
  root.dataset.theme = ui.themeMode;
  root.style.colorScheme = isLightCanvas ? 'light' : 'dark';
  root.style.setProperty('--black', palette.themePrimaryColor);
  root.style.setProperty('--white', palette.themeSurfaceColor);
  root.style.setProperty('--ink', palette.themeSecondaryColor);
  root.style.setProperty('--on-canvas', canvasText);
  root.style.setProperty('--primary-color', palette.themeAccentColor);
  root.style.setProperty('--on-accent', accentText);
}

export default PreferencesProvider;
