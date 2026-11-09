import Cube from 'cubejs/lib/cube';
import type { Appearance, CubeState, GamePayload, Move, SavedGame } from '../api/types';
import type { RubicksCube3x3 } from '../Contexts/RubicksCubeContext/RucksCube3x3/RubicksCube3x3';
import type { PieceClassKeys, PieceClassValues, PieceColors } from '../types/RubicksCube3x3';

export const DEFAULT_APPEARANCE: Appearance = {
  frontColor: '#ff0000',
  backColor: '#ffa500',
  leftColor: '#0000ff',
  rightColor: '#008000',
  topColor: '#ffff00',
  bottomColor: '#ffffff',
  widthPx: 240,
  pieceRadiusPx: 20,
  transitionMs: 500,
  initialRotationX: -45,
  initialRotationY: -45,
  initialRotationZ: 0,
};
const state = (cube: Cube): CubeState => ({
  version: 1,
  cubeType: '3x3',
  facelets: cube.asString(),
});
export const SOLVED = new Cube().asString();
export const KEY_MOVES: Record<string, string> = { w: 'F', a: 'L', s: 'B', d: 'R', q: 'U', e: 'D' };
export function keyMove(key: string, inverse: boolean) {
  const move = KEY_MOVES[key.toLowerCase()];
  return move && inverse ? (move.endsWith("'") ? move[0] : `${move}'`) : move;
}

/** Fixed URFDLB facelet positions for the legacy cubies (x right, y down, z front). */
export function faceletPositions(piece: ReturnType<RubicksCube3x3['getPieces']>[number]) {
  const x = piece.getStyle('translateX') / 80;
  const y = piece.getStyle('translateY') / 80;
  const z = piece.getStyle('translateZ') / 80;
  return [
    ...(y === 0 ? [{ key: 'topClass', index: (z + 1) * 3 + x }] : []),
    ...(x === 2 ? [{ key: 'rightClass', index: 9 + y * 3 + 1 - z }] : []),
    ...(z === 1 ? [{ key: 'frontClass', index: 18 + y * 3 + x }] : []),
    ...(y === 2 ? [{ key: 'bottomClass', index: 27 + (1 - z) * 3 + x }] : []),
    ...(x === 0 ? [{ key: 'leftClass', index: 36 + y * 3 + z + 1 }] : []),
    ...(z === -1 ? [{ key: 'backClass', index: 45 + y * 3 + 2 - x }] : []),
  ] as { key: PieceClassKeys; index: number }[];
}
const faceNames: Record<string, PieceClassValues> = {
  U: 'top',
  R: 'right',
  F: 'front',
  D: 'bottom',
  L: 'left',
  B: 'back',
};
const colorNames: Record<string, PieceColors> = {
  U: 'yellow',
  R: 'green',
  F: 'red',
  D: 'white',
  L: 'blue',
  B: 'orange',
};
export function restoreVisual(cube: RubicksCube3x3, facelets: string) {
  for (const piece of cube.getPieces()) {
    for (const key of [
      'frontClass',
      'backClass',
      'leftClass',
      'rightClass',
      'topClass',
      'bottomClass',
    ] as PieceClassKeys[])
      piece.setClass(key, 'none');
    const positions = faceletPositions(piece);
    for (const { key, index } of positions) piece.setClass(key, faceNames[facelets[index]]);
    piece.setAllData({
      ...piece.getAllData(),
      colors: positions.map(({ index }) => colorNames[facelets[index]]),
    });
  }
}
export function applyAppearance(cube: RubicksCube3x3, appearance: Appearance) {
  const { frontColor, backColor, leftColor, rightColor, topColor, bottomColor } = appearance;
  cube.setAllColor({ frontColor, backColor, leftColor, rightColor, topColor, bottomColor });
  cube.setStyle('pieceRadius', (appearance.pieceRadiusPx * 240) / appearance.widthPx);
  cube.setAnimationMs(appearance.transitionMs);
  cube.setStyle('transition', appearance.transitionMs / 1000);
}

export class CubeSession {
  logical = new Cube();
  initialState = state(this.logical);
  moves: Move[] = [];
  appearance: Appearance;
  preset: string | null;
  documentId?: string;
  name = '';
  attemptRecorded = false;
  private startedAt: number | null = null;
  private elapsedBase = 0;
  constructor(appearance: Appearance = DEFAULT_APPEARANCE, preset: string | null = null) {
    this.appearance = { ...appearance };
    this.preset = preset;
  }
  elapsed() {
    return Math.min(
      2147483647,
      Math.floor(
        this.elapsedBase + (this.startedAt === null ? 0 : performance.now() - this.startedAt)
      )
    );
  }
  move(move: string) {
    this.startedAt ??= performance.now();
    if (this.moves.length >= 10000)
      throw new Error('Limite de movimentos atingido. / Move limit reached.');
    this.moves.push({ move, atMs: this.elapsed() });
    this.logical.move(move);
    this.attemptRecorded = false;
  }
  payload(cube: RubicksCube3x3, name: string): GamePayload {
    return {
      name,
      cubeType: '3x3',
      engineVersion: 'cubejs-1.3.2',
      initialState: this.initialState,
      cubeState: state(this.logical),
      moves: this.moves.map(entry => ({ ...entry })),
      elapsedMs: this.elapsed(),
      appearanceSnapshot: { ...this.appearance },
      preset: this.preset,
      viewRotationX: cube.getStyle('rotateX'),
      viewRotationY: cube.getStyle('rotateY'),
      viewRotationZ: cube.getStyle('rotateZ'),
      savedAt: new Date().toISOString(),
    };
  }
  static load(game: SavedGame) {
    if (game.engineVersion !== 'cubejs-1.3.2' || game.initialState.version !== 1)
      throw new Error('Versão da partida incompatível. / Unsupported game version.');
    const session = new CubeSession(game.appearanceSnapshot, game.preset?.documentId ?? null);
    session.logical = Cube.fromString(game.initialState.facelets).move(
      game.moves.map(entry => entry.move).join(' ')
    );
    if (session.logical.asString() !== game.cubeState.facelets)
      throw new Error('Partida inconsistente. / Inconsistent game.');
    session.initialState = game.initialState;
    session.moves = game.moves.map(entry => ({ ...entry }));
    session.elapsedBase = game.elapsedMs;
    session.documentId = game.documentId;
    session.name = game.name;
    return session;
  }
}
