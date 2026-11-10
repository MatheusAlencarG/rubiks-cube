import type { Document } from '../../../shared/api/types';

export interface Appearance {
  frontColor: string;
  backColor: string;
  leftColor: string;
  rightColor: string;
  topColor: string;
  bottomColor: string;
  widthPx: number;
  pieceRadiusPx: number;
  transitionMs: number;
  initialRotationX: number;
  initialRotationY: number;
  initialRotationZ: number;
}
export interface Preset extends Document {
  name: string;
  cubeType: '3x3';
  appearance: Appearance;
}

export interface CubeState {
  version: 1;
  cubeType: '3x3';
  facelets: string;
}
export interface Move {
  move: string;
  atMs: number;
}
export interface GamePayload {
  cubeType: '3x3';
  engineVersion: 'cubejs-1.3.2';
  initialState: CubeState;
  cubeState: CubeState;
  scramble?: string[] | null;
  moves: Move[];
  elapsedMs: number;
  appearanceSnapshot: Appearance;
  preset?: string | null;
  viewRotationX: number;
  viewRotationY: number;
  viewRotationZ: number;
  savedAt: string;
  name: string;
}
export interface SavedGame extends Omit<GamePayload, 'preset'>, Document {
  preset: Preset | null;
}
export interface Attempt extends Document {
  durationMs: number;
  completedAt: string;
  moves: Move[];
}
