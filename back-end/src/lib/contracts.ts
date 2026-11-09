import Cube from 'cubejs';
import { z } from 'zod';

export const ENGINE_VERSION = 'cubejs-1.3.2';
export const SOLVED_FACELETS = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
export const MAX_DURATION = 2147483647;
const move = z
  .string()
  .regex(
    /^[URFDLB](2|')?$/,
    'Use movimentos canônicos: U, R, F, D, L, B, com 2 ou apóstrofo opcionais.'
  );
const color = z.string().regex(/^#[0-9a-f]{6}$/i, 'Use uma cor hexadecimal #RRGGBB.');
const elapsed = z.number().int().min(0).max(MAX_DURATION);
const cubeType = z.literal('3x3').default('3x3');
const datetime = z.string().datetime({ offset: true });

export const appearanceSchema = z.object({
  frontColor: color.default('#ff0000'),
  backColor: color.default('#ffa500'),
  leftColor: color.default('#0000ff'),
  rightColor: color.default('#008000'),
  topColor: color.default('#ffff00'),
  bottomColor: color.default('#ffffff'),
  widthPx: z.number().int().positive().default(240),
  pieceRadiusPx: z.number().finite().nonnegative().default(20),
  transitionMs: elapsed.default(0),
  initialRotationX: z.number().finite().default(-45),
  initialRotationY: z.number().finite().default(-45),
  initialRotationZ: z.number().finite().default(0),
});

const keyboardKey = z.string().regex(/^(?:[a-z0-9]|Arrow(?:Left|Right|Up|Down))$/);
export const DEFAULT_KEYBOARD_BINDINGS = {
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
export const keyboardBindingsSchema = z
  .object({
    front: keyboardKey,
    left: keyboardKey,
    back: keyboardKey,
    right: keyboardKey,
    top: keyboardKey,
    bottom: keyboardKey,
    viewLeft: keyboardKey,
    viewRight: keyboardKey,
    viewUp: keyboardKey,
    viewDown: keyboardKey,
    pause: keyboardKey,
  })
  .strict()
  .refine(
    bindings => new Set(Object.values(bindings)).size === Object.keys(bindings).length,
    'Cada comando deve usar uma tecla diferente.'
  );

export const settingsSchema = z.object({
  language: z.enum(['pt-BR', 'en-US']).default('pt-BR'),
  themePrimaryColor: color.default('#111827'),
  themeSecondaryColor: color.default('#f9fafb'),
  themeMode: z.enum(['dark', 'light', 'custom']).default('dark'),
  themeSurfaceColor: color.default('#242420'),
  themeAccentColor: color.default('#d7fa19'),
  keyboardBindings: z.preprocess(value => {
    if (value == null) return DEFAULT_KEYBOARD_BINDINGS;
    if (typeof value !== 'object' || Array.isArray(value) || 'pause' in value) return value;

    const used = new Set(Object.values(value));
    const pause = 'pabcdefghijklmnopqrstuvwxyz'.split('').find(key => !used.has(key));

    return { ...value, pause };
  }, keyboardBindingsSchema),
  hintsEnabled: z.boolean().default(false),
});

export const presetSchema = z.object({
  name: z.string().trim().min(1).max(80),
  cubeType,
  appearance: appearanceSchema,
});

export const cubeStateSchema = z
  .object({
    version: z.literal(1),
    cubeType: z.literal('3x3'),
    facelets: z.string().regex(/^[URFDLB]{54}$/),
  })
  .strict();

const AUTO_SOLVE = 'AUTO_SOLVE';
const moveEntry = z.object({ move, atMs: elapsed }).strict();
export const movesSchema = z.array(moveEntry).max(10000);
const savedMovesSchema = z
  .array(moveEntry.extend({ move: move.or(z.literal(AUTO_SOLVE)) }))
  .max(10000);
const scrambleSchema = z.array(move).max(1000).nullable().optional();

export const attemptSchema = z.object({
  cubeType,
  durationMs: elapsed.refine(value => value > 0, 'A duração deve ser positiva.'),
  completedAt: datetime,
  engineVersion: z.literal(ENGINE_VERSION),
  initialState: cubeStateSchema,
  scramble: scrambleSchema,
  moves: movesSchema.min(1),
  appearanceSnapshot: appearanceSchema,
});

export const savedGameSchema = z.object({
  name: z.string().trim().min(1).max(80),
  cubeType,
  elapsedMs: elapsed.default(0),
  engineVersion: z.literal(ENGINE_VERSION),
  initialState: cubeStateSchema,
  cubeState: cubeStateSchema,
  scramble: scrambleSchema,
  moves: savedMovesSchema,
  appearanceSnapshot: appearanceSchema,
  viewRotationX: z.number().finite().default(0),
  viewRotationY: z.number().finite().default(0),
  viewRotationZ: z.number().finite().default(0),
  savedAt: datetime,
});

export function isAllowedEmbed(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
    if (['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      return /^\/embed\/[a-zA-Z0-9_-]+$/.test(url.pathname);
    }
    return url.hostname === 'player.vimeo.com' && /^\/video\/\d+$/.test(url.pathname);
  } catch {
    return false;
  }
}

export const tutorialSchema = z
  .object({
    title: z.string().trim().min(1).max(180),
    slug: z.string().min(1).max(180),
    description: z.string().min(1),
    cubeType,
    kind: z.enum(['overview', 'parts', 'step']),
    displayOrder: z.number().int().nonnegative().default(0),
    stepNumber: z.number().int().positive().nullable().optional(),
    videos: z
      .array(
        z.object({
          title: z.string().trim().min(1).max(180),
          embedUrl: z.string().max(2048).refine(isAllowedEmbed, 'URL de vídeo não permitida.'),
        })
      )
      .default([]),
  })
  .superRefine((value, ctx) => {
    if (value.kind === 'step' && !value.stepNumber) {
      ctx.addIssue({
        code: 'custom',
        path: ['stepNumber'],
        message: 'Etapas exigem stepNumber positivo.',
      });
    }
    if (value.kind !== 'step' && value.stepNumber != null) {
      ctx.addIssue({
        code: 'custom',
        path: ['stepNumber'],
        message: 'Somente etapas possuem stepNumber.',
      });
    }
  });

export class ContractError extends Error {}

function permutationParity(values: number[]) {
  let parity = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) if (values[i] > values[j]) parity ^= 1;
  }
  return parity;
}

function isPermutation(values: number[], size: number) {
  return (
    values.length === size &&
    new Set(values).size === size &&
    values.every(value => Number.isInteger(value) && value >= 0 && value < size)
  );
}

/** URFDLB faces, each viewed from outside, with nine facelets in row-major order. */
export function parseCubeState(input: unknown) {
  const state = cubeStateSchema.parse(input);
  const faces = 'URFDLB';
  for (let i = 0; i < faces.length; i++) {
    if (
      [...state.facelets].filter(face => face === faces[i]).length !== 9 ||
      state.facelets[i * 9 + 4] !== faces[i]
    ) {
      throw new ContractError('O cubo exige nove adesivos por face e centros na ordem URFDLB.');
    }
  }
  const cube = Cube.fromString(state.facelets);
  const { cp, co, ep, eo } = cube.toJSON();
  if (
    !isPermutation(cp, 8) ||
    !isPermutation(ep, 12) ||
    co.length !== 8 ||
    co.some(value => !Number.isInteger(value) || value < 0 || value > 2) ||
    eo.length !== 12 ||
    eo.some(value => value !== 0 && value !== 1) ||
    co.reduce((sum, value) => sum + value, 0) % 3 !== 0 ||
    eo.reduce((sum, value) => sum + value, 0) % 2 !== 0 ||
    permutationParity(cp) !== permutationParity(ep) ||
    cube.asString() !== state.facelets
  ) {
    throw new ContractError('O estado não representa um cubo 3×3 fisicamente válido.');
  }
  return cube;
}

export function replay(
  initialState: unknown,
  movesInput: unknown,
  durationMs: number,
  scramble?: unknown,
  allowAutoSolve = false
) {
  const cube = parseCubeState(initialState);
  const moves = (allowAutoSolve ? savedMovesSchema : movesSchema).parse(movesInput);
  let previous = 0;
  let replayFrom = 0;

  for (const [index, entry] of moves.entries()) {
    if (entry.atMs < previous || entry.atMs > durationMs) {
      throw new ContractError('Os tempos dos movimentos devem estar em ordem e dentro da duração.');
    }
    previous = entry.atMs;
    if (entry.move === AUTO_SOLVE) replayFrom = index + 1;
  }

  if (scramble != null) {
    const sequence = z.array(move).max(1000).parse(scramble);
    if (new Cube().move(sequence.join(' ')).asString() !== cube.asString()) {
      throw new ContractError('O embaralhamento não corresponde ao estado inicial.');
    }
  }

  const replayStart = replayFrom === 0 ? cube : new Cube();
  return replayStart.move(
    moves
      .slice(replayFrom)
      .map(entry => entry.move)
      .join(' ')
  );
}

export function validateAttempt(input: unknown) {
  const parsed = attemptSchema.parse(input);
  if (!replay(parsed.initialState, parsed.moves, parsed.durationMs, parsed.scramble).isSolved()) {
    throw new ContractError('A tentativa deve terminar com o cubo resolvido.');
  }
  return parsed;
}

export function validateSavedGame(input: unknown) {
  const parsed = savedGameSchema.parse(input);
  parseCubeState(parsed.cubeState);
  if (
    replay(
      parsed.initialState,
      parsed.moves,
      parsed.elapsedMs,
      parsed.scramble,
      true
    ).asString() !== parsed.cubeState.facelets
  ) {
    throw new ContractError('O estado atual não corresponde ao replay dos movimentos.');
  }
  return parsed;
}
