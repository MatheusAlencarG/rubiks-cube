import { errors } from '@strapi/utils';
import { isDeepStrictEqual } from 'node:util';
import { ZodError } from 'zod';
import {
  appearanceSchema,
  settingsSchema,
  presetSchema,
  tutorialSchema,
  validateAttempt,
  validateSavedGame,
  ContractError,
} from './contracts';

const privateUids = [
  'api::user-setting.user-setting',
  'api::cube-preset.cube-preset',
  'api::solve-attempt.solve-attempt',
  'api::saved-game.saved-game',
];

/** Accept Strapi's direct, connect/disconnect and set relation input forms. */
function reference(value: any, current: any = null): any {
  if (value === undefined) return current;
  if (value === null || typeof value === 'string' || typeof value === 'number') return value;
  if (value.documentId || value.id) return value;
  if (Array.isArray(value.set)) {
    if (value.set.length > 1) throw new ContractError('A relação aceita somente um registro.');
    return value.set[0] ?? null;
  }
  if (Array.isArray(value.connect) || Array.isArray(value.disconnect)) {
    if (value.connect?.length > 1) throw new ContractError('A relação aceita somente um registro.');
    if (value.connect?.length) return value.connect[0];
    if (value.disconnect?.length) return null;
    return current;
  }
  throw new ContractError('Formato de relação inválido.');
}

function whereReference(value: any) {
  if (typeof value === 'number') return { id: value };
  if (typeof value === 'string') return { documentId: value };
  if (value?.id) return { id: value.id };
  if (value?.documentId) return { documentId: value.documentId };
  throw new ContractError('Identificador de relação inválido.');
}

export function registerModelValidation(strapi: any) {
  strapi.documents.use(async (context, next) => {
    const { uid, action, params } = context;
    const isPrivate = privateUids.includes(uid);
    const isTutorial = uid === 'api::tutorial.tutorial';
    if ((!isPrivate && !isTutorial) || !['create', 'update'].includes(action)) return next();

    if (uid === 'api::solve-attempt.solve-attempt' && action === 'update') {
      throw new errors.ValidationError('Tentativas concluídas são imutáveis.');
    }

    const data = params.data;
    const populate = isTutorial
      ? { videos: true }
      : {
          user: true,
          ...(uid === 'api::cube-preset.cube-preset' ? { appearance: true } : {}),
          ...(uid === 'api::user-setting.user-setting' ? { activePreset: true } : {}),
          ...(['api::solve-attempt.solve-attempt', 'api::saved-game.saved-game'].includes(uid)
            ? { appearanceSnapshot: true, preset: true }
            : {}),
        };
    const existing =
      action === 'update'
        ? await strapi
            .documents(uid)
            .findOne({ documentId: params.documentId, locale: params.locale, populate })
        : null;
    if (isPrivate && action === 'update' && !existing) throw new errors.NotFoundError();

    try {
      const merged = { ...existing, ...data };
      if (isTutorial) {
        const parsed = tutorialSchema.parse(merged);
        const { videos, ...attributes } = parsed;
        Object.assign(data, attributes, { stepNumber: parsed.stepNumber ?? null });
        if (action === 'create' || data.videos !== undefined) data.videos = videos;
        return next();
      }

      const userRef = reference(data.user, existing?.user);
      if (!userRef) throw new ContractError('Um proprietário é obrigatório.');
      const user = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: whereReference(userRef) });
      if (!user) throw new ContractError('Proprietário não encontrado.');
      if (existing && existing.user?.id !== user.id)
        throw new ContractError('Não é permitido transferir o proprietário.');
      data.user = user.id;

      const ownedPreset = async (value, current = null) => {
        const ref = reference(value, current);
        if (!ref) return null;
        const preset = await strapi.documents('api::cube-preset.cube-preset').findFirst({
          filters: { ...whereReference(ref), user: { id: user.id } },
          populate: { appearance: true },
        });
        if (!preset) throw new ContractError('O preset deve existir e pertencer ao usuário.');
        return preset;
      };

      if (uid === 'api::user-setting.user-setting') {
        Object.assign(data, settingsSchema.parse(merged), { ownerKey: String(user.id) });
        if (action === 'create') {
          const duplicate = await strapi.db
            .query(uid)
            .findOne({ where: { ownerKey: String(user.id) } });
          if (duplicate)
            throw new ContractError(
              'O usuário já possui configurações. Atualize o registro existente.'
            );
        }
        if (data.activePreset !== undefined) {
          const preset = await ownedPreset(data.activePreset, existing?.activePreset);
          data.activePreset = preset?.documentId ?? null;
        }
      } else if (uid === 'api::cube-preset.cube-preset') {
        if (data.appearance !== undefined)
          merged.appearance = { ...existing?.appearance, ...data.appearance };
        Object.assign(data, presetSchema.parse(merged));
      } else {
        const preset = await ownedPreset(data.preset, existing?.preset);
        if (data.preset !== undefined) data.preset = preset?.documentId ?? null;
        if (action === 'create' && preset)
          merged.appearanceSnapshot = appearanceSchema.parse(preset.appearance);
        const parsed =
          uid === 'api::solve-attempt.solve-attempt'
            ? validateAttempt(merged)
            : validateSavedGame(merged);

        if (existing) {
          if (
            parsed.engineVersion !== existing.engineVersion ||
            !isDeepStrictEqual(parsed.initialState, existing.initialState) ||
            !isDeepStrictEqual(
              parsed.appearanceSnapshot,
              appearanceSchema.parse(existing.appearanceSnapshot)
            ) ||
            (preset?.documentId ?? null) !== (existing.preset?.documentId ?? null)
          ) {
            throw new ContractError(
              'Estado inicial, motor, preset de origem e snapshot são imutáveis.'
            );
          }
          const game = parsed as ReturnType<typeof validateSavedGame>;
          if (
            game.elapsedMs < existing.elapsedMs ||
            game.moves.length < existing.moves.length ||
            existing.moves.some((entry, index) => !isDeepStrictEqual(entry, game.moves[index]))
          ) {
            throw new ContractError(
              'Uma partida salva deve preservar o tempo e o histórico anterior.'
            );
          }
          // Keep the existing component instance; never accept another record's component ID.
          delete data.appearanceSnapshot;
          const { appearanceSnapshot: _snapshot, ...attributes } = parsed;
          Object.assign(data, attributes);
        } else {
          // Parsed snapshots contain values only, never component IDs or live preset links.
          Object.assign(data, parsed);
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        throw new errors.ValidationError('Dados inválidos.', { errors: error.issues });
      }
      if (error instanceof ContractError) throw new errors.ValidationError(error.message);
      throw error;
    }
    return next();
  });
}
