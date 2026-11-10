import type { Document } from '../../shared/api/types';
import type { Preset } from '../cube/model/cubeTypes';
import type { UiPreferences } from './preferences';

export type Locale = 'pt-BR' | 'en-US';
export type SettingsPatch = Partial<
  UiPreferences & { language: Locale; activePreset: string | null }
>;

export interface Settings extends Document, UiPreferences {
  language: Locale;
  themePrimaryColor: string;
  themeSecondaryColor: string;
  activePreset: Preset | null;
}
