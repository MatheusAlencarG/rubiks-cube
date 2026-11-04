import assert from 'node:assert/strict';
import { test } from 'node:test';
import Cube from 'cubejs';
import {
  appearanceSchema,
  settingsSchema,
  tutorialSchema,
  ENGINE_VERSION,
  SOLVED_FACELETS,
  parseCubeState,
  replay,
  validateAttempt,
  validateSavedGame,
  isAllowedEmbed,
} from '../src/lib/contracts';

const state = (facelets = SOLVED_FACELETS) => ({
  version: 1 as const,
  cubeType: '3x3' as const,
  facelets,
});
const initial = state(new Cube().move('R U').asString());
const moves = [
  { move: "U'", atMs: 300 },
  { move: "R'", atMs: 700 },
];
const attempt = () => ({
  cubeType: '3x3',
  engineVersion: ENGINE_VERSION,
  initialState: initial,
  scramble: ['R', 'U'],
  moves,
  durationMs: 1000,
  completedAt: new Date().toISOString(),
  appearanceSnapshot: {},
});

test('preserves appearance defaults and rejects invalid dimensions and colors', () => {
  const appearance = appearanceSchema.parse({});
  assert.equal(appearance.widthPx, 240);
  assert.equal(appearance.frontColor, '#ff0000');
  for (const data of [
    { widthPx: 0 },
    { pieceRadiusPx: -1 },
    { transitionMs: 1.5 },
    { topColor: 'yellow' },
  ]) {
    assert.equal(appearanceSchema.safeParse(data).success, false);
  }
});

test('accepts only the supported locales and hexadecimal themes', () => {
  assert.equal(settingsSchema.parse({}).language, 'pt-BR');
  assert.equal(settingsSchema.safeParse({ language: 'pt-br' }).success, false);
  assert.equal(settingsSchema.safeParse({ themePrimaryColor: '#xyzxyz' }).success, false);
});

test('recognizes solved and scrambled physical cubes', () => {
  assert.equal(parseCubeState(state()).isSolved(), true);
  assert.equal(parseCubeState(initial).isSolved(), false);
});

test('rejects malformed and unsupported cube-state representations', () => {
  for (const input of [
    state('U'.repeat(54)),
    { ...state(), version: 2 },
    { ...state(), cubeType: '4x4' },
    { ...state(), cssClass: 'front' },
  ]) {
    assert.throws(() => parseCubeState(input));
  }
});

test('rejects an impossible single flipped edge', () => {
  const facelets = [...SOLVED_FACELETS];
  [facelets[5], facelets[10]] = [facelets[10], facelets[5]];
  assert.throws(() => parseCubeState(state(facelets.join(''))));
});

test('replays canonical inverse moves to solve the cube', () => {
  assert.equal(replay(initial, moves, 1000, ['R', 'U']).isSolved(), true);
  assert.equal(validateAttempt(attempt()).durationMs, 1000);
});

test('rejects non-monotonic, negative and out-of-duration move times', () => {
  for (const invalid of [
    [
      { move: 'R', atMs: 500 },
      { move: 'U', atMs: 400 },
    ],
    [{ move: 'R', atMs: -1 }],
    [{ move: 'R', atMs: 1001 }],
  ]) {
    assert.throws(() => replay(initial, invalid, 1000));
  }
});

test('rejects keyboard commands and a scramble inconsistent with the state', () => {
  assert.throws(() => replay(initial, [{ move: 'W', atMs: 10 }], 1000));
  assert.throws(() => replay(initial, moves, 1000, ['F']));
});

test('does not accept unfinished attempts or non-positive durations', () => {
  assert.throws(() => validateAttempt({ ...attempt(), moves: [] }));
  assert.throws(() => validateAttempt({ ...attempt(), durationMs: 0 }));
});

test('a saved state must match the replay, including a game with no moves', () => {
  const saved = {
    ...attempt(),
    name: 'Partida',
    elapsedMs: 1000,
    cubeState: state(),
    savedAt: new Date().toISOString(),
  };
  assert.equal(validateSavedGame(saved).cubeState.facelets, SOLVED_FACELETS);
  assert.throws(() => validateSavedGame({ ...saved, cubeState: initial }));
  assert.equal(
    validateSavedGame({ ...saved, moves: [], elapsedMs: 0, cubeState: initial }).elapsedMs,
    0
  );
});

test('tutorial categories determine whether a step number is required', () => {
  const tutorial = { title: 'Tutorial', slug: 'tutorial', description: 'Descrição', kind: 'step' };
  assert.equal(tutorialSchema.safeParse(tutorial).success, false);
  assert.equal(tutorialSchema.safeParse({ ...tutorial, stepNumber: 1 }).success, true);
  assert.equal(
    tutorialSchema.safeParse({ ...tutorial, kind: 'parts', stepNumber: 1 }).success,
    false
  );
});

test('video embeds accept only supported HTTPS providers and paths', () => {
  assert.equal(isAllowedEmbed('https://www.youtube.com/embed/CNHOWsQes7w'), true);
  assert.equal(isAllowedEmbed('https://player.vimeo.com/video/123'), true);
  for (const url of [
    'javascript:alert(1)',
    'http://www.youtube.com/embed/abc',
    'https://evil.example/embed/abc',
    'https://www.youtube.com.evil.example/embed/abc',
    'https://www.youtube.com/watch?v=abc',
  ]) {
    assert.equal(isAllowedEmbed(url), false);
  }
});
