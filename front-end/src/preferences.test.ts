import {
  DEFAULT_BINDINGS,
  DEFAULT_UI,
  readUiPreferences,
  rebind,
  validBindings,
  contrastingColor,
} from './preferences';

test('keyboard controls remain unique when reassigning a used key', () => {
  const bindings = rebind(DEFAULT_BINDINGS, 'front', 'A');
  expect(bindings.front).toBe('a');
  expect(bindings.left).toBe('w');
  expect(validBindings(bindings)).toBe(true);
  expect(DEFAULT_BINDINGS.front).toBe('w');
  expect(rebind(bindings, 'front', 'Escape')).toBe(bindings);
});
test('invalid stored preferences fall back to safe defaults', () => {
  const read = readUiPreferences({
    themeMode: 'unknown',
    themePrimaryColor: 'red',
    keyboardBindings: { ...DEFAULT_BINDINGS, front: 'a' },
    hintsEnabled: 'yes',
  });
  expect(read).toEqual(DEFAULT_UI);
  expect(readUiPreferences(null)).toEqual(DEFAULT_UI);
});
test('custom colors and hints survive storage and contrasting text remains readable', () => {
  const preferences = readUiPreferences({
    ...DEFAULT_UI,
    themeMode: 'custom',
    themePrimaryColor: '#ABCDEF',
    hintsEnabled: true,
  });
  expect(readUiPreferences(JSON.parse(JSON.stringify(preferences)))).toEqual(preferences);
  expect(contrastingColor('#ffffff')).toBe('#151513');
  expect(contrastingColor('#000000')).toBe('#f5f5f5');
});
test('a legacy keyboard layout keeps its existing keys when pause is added', () => {
  const { pause: _pause, ...legacy } = { ...DEFAULT_BINDINGS, front: 'p' };
  const { keyboardBindings } = readUiPreferences({ keyboardBindings: legacy });

  expect(keyboardBindings).toMatchObject(legacy);
  expect(keyboardBindings.pause).not.toBe('p');
});
