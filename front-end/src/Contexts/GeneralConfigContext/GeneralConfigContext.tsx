import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Context, INITIAL_STATE } from './Context';

import { GeneralConfigContextProps, CurrentLanguageValues } from '../../types/GeneralConfigContext';
import { useAuth } from '../AuthContext';
import { usePrivateCollection } from '../../api/hooks';
import { listAll, writeDocument } from '../../api/client';
import type { Settings, SettingsPatch } from '../../api/types';
import {
  contrastingColor,
  DARK_COLORS,
  LIGHT_COLORS,
  readUiPreferences,
  UiPreferences,
} from '../../preferences';

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

function GeneralConfigContext({ children }: GeneralConfigContextProps) {
  const [currentLanguage, setCurrentLanguage] = useState<CurrentLanguageValues>(localLanguage);
  const [ui, setUi] = useState(localUi);
  const latestUi = useRef(ui);
  latestUi.current = ui;
  const { token, user } = useAuth();
  const { data, error, isLoading, mutate } = usePrivateCollection<Settings>('user-settings');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const latest = useRef(data);
  latest.current = data;
  const queue = useRef<Promise<void>>(Promise.resolve());
  const editedToken = useRef<string | null>(null);
  const uiEditedToken = useRef<string | null>(null);
  const currentToken = useRef(token);
  currentToken.current = token;
  const settings = data?.[0];
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
    const palette =
      ui.themeMode === 'custom' ? ui : ui.themeMode === 'light' ? LIGHT_COLORS : DARK_COLORS;
    const root = document.documentElement;
    root.dataset.theme = ui.themeMode;
    root.style.setProperty('--black', palette.themePrimaryColor);
    root.style.setProperty('--white', palette.themeSurfaceColor);
    root.style.setProperty('--ink', palette.themeSecondaryColor);
    root.style.setProperty('--on-canvas', contrastingColor(palette.themePrimaryColor));
    root.style.setProperty('--primary-color', palette.themeAccentColor);
    root.style.setProperty('--on-accent', contrastingColor(palette.themeAccentColor));
    root.style.setProperty(
      '--canvas-icon-filter',
      contrastingColor(palette.themePrimaryColor) === '#151513' ? 'invert(1)' : 'none'
    );
    root.style.setProperty(
      '--accent-icon-filter',
      contrastingColor(palette.themeAccentColor) === '#f5f5f5' ? 'invert(1)' : 'none'
    );
    root.style.setProperty(
      '--ink-icon-filter',
      contrastingColor(palette.themeSecondaryColor) === '#151513' ? 'invert(1)' : 'none'
    );
    root.style.colorScheme =
      contrastingColor(palette.themePrimaryColor) === '#151513' ? 'light' : 'dark';
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
    <Context.Provider
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
    </Context.Provider>
  );
}

export default GeneralConfigContext;
