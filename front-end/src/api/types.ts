import type { UiPreferences } from '../preferences';
export type Locale = 'pt-BR' | 'en-US';
export type SettingsPatch = Partial<
  UiPreferences & { language: Locale; activePreset: string | null }
>;
export interface Document {
  documentId: string;
}
export interface Collection<T> {
  data: T[];
  meta: { pagination: { page: number; pageCount: number; total: number } };
}
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
export interface Settings extends Document, UiPreferences {
  language: Locale;
  themePrimaryColor: string;
  themeSecondaryColor: string;
  activePreset: Preset | null;
}
export interface Tutorial extends Document {
  title: string;
  description: string;
  kind: 'overview' | 'parts' | 'step';
  stepNumber: number | null;
  displayOrder: number;
  parts: {
    id: number;
    title: string;
    description: string;
    imageAlt: string;
    image: { url: string } | null;
  }[];
  videos: { id: number; title: string; embedUrl: string }[];
}
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: { url: string } | null;
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
