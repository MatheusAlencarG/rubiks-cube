export const ACTIONS = [
  'front',
  'left',
  'back',
  'right',
  'top',
  'bottom',
  'viewLeft',
  'viewRight',
  'viewUp',
  'viewDown',
  'pause',
] as const;

export type KeyboardAction = (typeof ACTIONS)[number];
export type KeyboardBindings = Record<KeyboardAction, string>;
export type ThemeMode = 'dark' | 'light' | 'custom';

export interface UiPreferences {
  themeMode: ThemeMode;
  themePrimaryColor: string;
  themeSecondaryColor: string;
  themeSurfaceColor: string;
  themeAccentColor: string;
  keyboardBindings: KeyboardBindings;
  hintsEnabled: boolean;
}

export const DEFAULT_BINDINGS: KeyboardBindings = {
  front: 'w',
  left: 'a',
  back: 's',
  right: 'd',
  top: 'q',
  bottom: 'e',
  viewLeft: 'ArrowLeft',
  viewRight: 'ArrowRight',
  viewUp: 'ArrowUp',
  viewDown: 'ArrowDown',
  pause: 'p',
};

export const DARK_COLORS = {
  themePrimaryColor: '#151513',
  themeSecondaryColor: '#f5f5f5',
  themeSurfaceColor: '#242420',
  themeAccentColor: '#d7fa19',
};

export const LIGHT_COLORS = {
  themePrimaryColor: '#eef2f7',
  themeSecondaryColor: '#151513',
  themeSurfaceColor: '#ffffff',
  themeAccentColor: '#486500',
};

export const DEFAULT_UI: UiPreferences = {
  themeMode: 'dark',
  ...DARK_COLORS,
  keyboardBindings: DEFAULT_BINDINGS,
  hintsEnabled: false,
};

export function normalizeKey(key: string): string | null {
  if (/^[a-z0-9]$/i.test(key)) return key.toLowerCase();
  return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key) ? key : null;
}

export function validBindings(value: unknown): value is KeyboardBindings {
  if (!value || typeof value !== 'object') return false;

  const bindings = value as KeyboardBindings;
  return (
    ACTIONS.every(
      action =>
        typeof bindings[action] === 'string' && normalizeKey(bindings[action]) === bindings[action]
    ) && new Set(ACTIONS.map(action => bindings[action])).size === ACTIONS.length
  );
}

export function readUiPreferences(value: unknown): UiPreferences {
  const source = value && typeof value === 'object' ? (value as Partial<UiPreferences>) : {};
  const result = { ...DEFAULT_UI };

  if (source.themeMode && ['dark', 'light', 'custom'].includes(source.themeMode)) {
    result.themeMode = source.themeMode;
  }

  for (const key of Object.keys(DARK_COLORS) as (keyof typeof DARK_COLORS)[]) {
    const color = source[key];
    if (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)) {
      result[key] = color;
    }
  }

  const bindings = source.keyboardBindings;
  if (bindings && typeof bindings === 'object') {
    const used = new Set(Object.values(bindings));
    const pause = Object.prototype.hasOwnProperty.call(bindings, 'pause')
      ? bindings.pause
      : 'pabcdefghijklmnopqrstuvwxyz'.split('').find(key => !used.has(key));
    const upgraded = { ...bindings, pause };

    if (validBindings(upgraded)) result.keyboardBindings = upgraded;
  }
  if (typeof source.hintsEnabled === 'boolean') result.hintsEnabled = source.hintsEnabled;

  return result;
}

export function rebind(
  bindings: KeyboardBindings,
  action: KeyboardAction,
  key: string
): KeyboardBindings {
  const normalized = normalizeKey(key);
  if (!normalized) return bindings;

  const other = ACTIONS.find(item => item !== action && bindings[item] === normalized);
  return { ...bindings, ...(other ? { [other]: bindings[action] } : {}), [action]: normalized };
}

const arrowSymbols: Record<string, string> = {
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  ArrowDown: '↓',
};

export function displayKey(key: string) {
  return arrowSymbols[key] ?? key.toUpperCase();
}

export function actionLabel(action: KeyboardAction, en: boolean) {
  const labels: Record<KeyboardAction, [string, string]> = {
    front: ['Front face', 'Face frontal'],
    left: ['Left face', 'Face esquerda'],
    back: ['Back face', 'Face traseira'],
    right: ['Right face', 'Face direita'],
    top: ['Top face', 'Face superior'],
    bottom: ['Bottom face', 'Face inferior'],
    viewLeft: ['Rotate view left', 'Girar visualização à esquerda'],
    viewRight: ['Rotate view right', 'Girar visualização à direita'],
    viewUp: ['Rotate view up', 'Girar visualização para cima'],
    viewDown: ['Rotate view down', 'Girar visualização para baixo'],
    pause: ['Pause or resume timer', 'Pausar ou retomar cronômetro'],
  };

  return labels[action][en ? 0 : 1];
}

export function contrastingColor(hex: string) {
  const rgb = [1, 3, 5]
    .map(index => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(value => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;

  return luminance > 0.179 ? '#151513' : '#f5f5f5';
}
