import { createRubiksCube3x3 } from './createRubiksCube3x3';
import {
  CubeSession,
  countManualMoves,
  DEFAULT_APPEARANCE,
  faceletPositions,
  restoreVisual,
  keyMove,
  SOLVED,
} from './CubeSession';
import type { SavedGame } from './cubeTypes';

function readVisual(cube: ReturnType<typeof createRubiksCube3x3>) {
  const letters: Record<string, string> = {
    top: 'U',
    right: 'R',
    front: 'F',
    bottom: 'D',
    left: 'L',
    back: 'B',
  };
  const result = new Array(54).fill('?');
  for (const piece of cube.getPieces())
    for (const { key, index } of faceletPositions(piece))
      result[index] = letters[piece.getClass(key)!];
  return result.join('');
}
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
const controls = [
  ['w', 'frontPiecesMovement'],
  ['a', 'leftPiecesMovement'],
  ['s', 'backPiecesMovement'],
  ['d', 'rightPiecesMovement'],
  ['q', 'topPiecesMovement'],
  ['e', 'bottomPiecesMovement'],
] as const;
test.each(controls)(
  'visual control %s matches the canonical state including inverse moves',
  (key, method) => {
    const cube = createRubiksCube3x3();
    const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
    const initial = session.logical.asString();
    restoreVisual(cube, initial);
    cube[method]();
    session.move(keyMove(key, false));
    jest.runOnlyPendingTimers();
    expect(readVisual(cube)).toBe(session.logical.asString());
    cube[method]('shift');
    session.move(keyMove(key, true));
    jest.runOnlyPendingTimers();
    expect(readVisual(cube)).toBe(initial);
  }
);
test('mixed moves and restored states agree with the canonical replay', () => {
  const cube = createRubiksCube3x3();
  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  restoreVisual(cube, session.logical.asString());
  for (const index of [0, 3, 4, 1, 5, 2, 4, 3, 0, 2, 1, 5]) {
    const [key, method] = controls[index];
    cube[method]();
    session.move(keyMove(key, false));
    jest.runOnlyPendingTimers();
    expect(readVisual(cube)).toBe(session.logical.asString());
  }
  const fresh = createRubiksCube3x3();
  restoreVisual(fresh, session.logical.asString());
  expect(readVisual(fresh)).toBe(readVisual(cube));
  fresh.frontPiecesMovement();
  session.move('F');
  jest.runOnlyPendingTimers();
  expect(readVisual(fresh)).toBe(session.logical.asString());
});
test('saved games preserve the initial state, previous elapsed time and immutable move prefix', () => {
  const cube = createRubiksCube3x3();
  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  session.move('R');
  jest.advanceTimersByTime(500);
  const saved: SavedGame = { ...session.payload(cube, 'Game'), preset: null, documentId: 'saved' };
  const resumed = CubeSession.load(saved);
  resumed.move("R'");
  const payload = resumed.payload(cube, 'Game');
  expect(payload.initialState).toEqual(saved.initialState);
  expect(payload.elapsedMs).toBeGreaterThanOrEqual(saved.elapsedMs);
  expect(payload.moves.slice(0, saved.moves.length)).toEqual(saved.moves);
  expect(payload.moves).toHaveLength(2);
  expect(payload.cubeState.facelets).toBe(saved.initialState.facelets);
  expect(saved.moves).toHaveLength(1);
});

test('a scrambled game begins with zero player moves and can be solved using its inverse turns', () => {
  const cube = createRubiksCube3x3();
  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  const payload = session.payload(cube, 'Scrambled');

  expect(payload.scramble?.length).toBeGreaterThanOrEqual(20);
  expect(payload.initialState.facelets).not.toBe(SOLVED);
  expect(payload.cubeState).toEqual(payload.initialState);
  expect(payload.moves).toEqual([]);

  for (const move of [...payload.scramble!].reverse()) {
    const inverse = move.endsWith('2') ? move : move.endsWith("'") ? move[0] : `${move}'`;
    session.move(inverse);
    jest.advanceTimersByTime(100);
  }

  expect(session.logical.asString()).toBe(SOLVED);
  expect(session.usedAutoSolve).toBe(false);
  expect(session.finished).toBe(true);
  expect(session.elapsed()).toBe(session.moves[session.moves.length - 1].atMs);
  expect(session.move('R')).toBe(false);
  expect(session.takeCelebration()).toBe(true);
  expect(session.takeCelebration()).toBe(false);
});

test('ignores turns on the solved idle cube and marks local test solves separately', () => {
  const idle = new CubeSession();
  expect(idle.move('R')).toBe(false);
  expect(idle.solveForTesting()).toBe(false);
  expect(idle.elapsed()).toBe(0);
  expect(idle.moves).toEqual([]);

  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  expect(session.solveForTesting()).toBe(true);
  expect(session.logical.asString()).toBe(SOLVED);
  expect(session.finished).toBe(true);
  expect(session.devSolved).toBe(true);
  expect(session.usedAutoSolve).toBe(false);
  expect(session.takeCelebration()).toBe(true);
  const payload = session.payload(createRubiksCube3x3(), 'Dev');
  const replay = CubeSession.load({ ...payload, preset: null, documentId: 'dev-test' });
  expect(replay.logical.asString()).toBe(SOLVED);
});

test('the automatic solve remains marked after loading and does not count as a player move', () => {
  const cube = createRubiksCube3x3();
  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  session.autoSolve();
  expect(session.logical.asString()).toBe(SOLVED);
  expect(countManualMoves(session.moves)).toBe(0);
  expect(session.paused).toBe(true);
  jest.advanceTimersByTime(5000);
  expect(session.elapsed()).toBe(0);
  session.togglePause();
  jest.advanceTimersByTime(5000);
  expect(session.elapsed()).toBe(0);
  expect(session.move('F')).toBe(false);

  const saved: SavedGame = {
    ...session.payload(cube, 'Practice'),
    preset: null,
    documentId: 'practice',
  };
  const resumed = CubeSession.load(saved);
  expect(resumed.logical.asString()).toBe(saved.cubeState.facelets);
  expect(resumed.move("F'")).toBe(false);
  expect(resumed.logical.asString()).toBe(SOLVED);
  expect(countManualMoves(resumed.moves)).toBe(0);
  expect(resumed.usedAutoSolve).toBe(true);
});

test('auto-solving a running session freezes the elapsed time', () => {
  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  session.move('F');
  jest.advanceTimersByTime(250);
  session.autoSolve();
  jest.advanceTimersByTime(5000);

  expect(session.paused).toBe(true);
  expect(session.elapsed()).toBe(250);
  expect(session.moves[1].atMs).toBe(250);
});

test('pausing freezes elapsed time and blocks changes until the timer resumes', () => {
  const session = CubeSession.scrambled(DEFAULT_APPEARANCE, null);
  const initial = session.logical.asString();
  session.move('F');
  jest.advanceTimersByTime(250);
  session.togglePause();

  const facelets = session.logical.asString();
  jest.advanceTimersByTime(5000);
  session.move('R');
  session.autoSolve();
  expect(session.logical.asString()).toBe(facelets);
  expect(session.elapsed()).toBe(250);
  expect(session.moves).toHaveLength(1);

  session.togglePause();
  jest.advanceTimersByTime(250);
  session.move("F'");
  expect(session.elapsed()).toBe(500);
  expect(session.moves[1].atMs).toBe(500);
  expect(session.logical.asString()).toBe(initial);
});
