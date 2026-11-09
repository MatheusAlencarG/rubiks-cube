import { createRubicksCube3x3 } from '../Contexts/RubicksCubeContext/RucksCube3x3/instantiateRubicksCube3x3';
import { CubeSession, faceletPositions, restoreVisual, keyMove, SOLVED } from './session';
import type { SavedGame } from '../api/types';

function readVisual(cube: ReturnType<typeof createRubicksCube3x3>) {
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
    const cube = createRubicksCube3x3();
    const session = new CubeSession();
    restoreVisual(cube, SOLVED);
    cube[method]();
    session.move(keyMove(key, false));
    jest.runOnlyPendingTimers();
    expect(readVisual(cube)).toBe(session.logical.asString());
    cube[method]('shift');
    session.move(keyMove(key, true));
    jest.runOnlyPendingTimers();
    expect(readVisual(cube)).toBe(SOLVED);
  }
);
test('mixed moves and restored states agree with the canonical replay', () => {
  const cube = createRubicksCube3x3();
  const session = new CubeSession();
  restoreVisual(cube, SOLVED);
  for (const index of [0, 3, 4, 1, 5, 2, 4, 3, 0, 2, 1, 5]) {
    const [key, method] = controls[index];
    cube[method]();
    session.move(keyMove(key, false));
    jest.runOnlyPendingTimers();
    expect(readVisual(cube)).toBe(session.logical.asString());
  }
  const fresh = createRubicksCube3x3();
  restoreVisual(fresh, session.logical.asString());
  expect(readVisual(fresh)).toBe(readVisual(cube));
  fresh.frontPiecesMovement();
  session.move('F');
  jest.runOnlyPendingTimers();
  expect(readVisual(fresh)).toBe(session.logical.asString());
});
test('saved games preserve the initial state, previous elapsed time and immutable move prefix', () => {
  const cube = createRubicksCube3x3();
  const session = new CubeSession();
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
  expect(payload.cubeState.facelets).toBe(SOLVED);
  expect(saved.moves).toHaveLength(1);
});
