import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const populateByUid = {
  'api::user-setting.user-setting': { activePreset: { populate: { appearance: true } } },
  'api::cube-preset.cube-preset': { appearance: true },
  'api::solve-attempt.solve-attempt': {
    appearanceSnapshot: true,
    preset: { fields: ['name', 'cubeType'] },
  },
  'api::saved-game.saved-game': {
    appearanceSnapshot: true,
    preset: { fields: ['name', 'cubeType'] },
  },
};

const reservedFields = [
  'user',
  'ownerKey',
  'id',
  'documentId',
  'createdBy',
  'updatedBy',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'locale',
];

export function createOwnedController(uid: keyof typeof populateByUid) {
  return factories.createCoreController(uid as any, ({ strapi }) => {
    const documents = strapi.documents(uid as any) as any;

    function getUser(ctx) {
      if (!ctx.state.user?.id)
        throw new errors.UnauthorizedError('Autenticação de usuário obrigatória.');
      return ctx.state.user.id;
    }

    function getData(ctx) {
      const data = ctx.request.body?.data;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new errors.ValidationError('Envie um objeto JSON no campo data.');
      }

      for (const field of reservedFields) {
        if (Object.prototype.hasOwnProperty.call(data, field))
          throw new errors.ValidationError(`O campo ${field} é gerenciado pelo servidor.`);
      }

      return data;
    }

    async function getOwned(ctx) {
      const userId = getUser(ctx);
      const entity = await documents.findFirst({
        filters: { documentId: ctx.params.id, user: { id: userId } },
        populate: populateByUid[uid],
      });

      if (!entity) throw new errors.NotFoundError('Registro não encontrado.');
      return entity;
    }

    return {
      async find(ctx) {
        const userId = getUser(ctx);
        await this.validateQuery(ctx);
        const query = await this.sanitizeQuery(ctx);

        const { results, pagination } = await (strapi.service(uid as any) as any).find({
          ...query,
          filters: { $and: [query.filters || {}, { user: { id: userId } }] },
          populate: populateByUid[uid],
        });

        return this.transformResponse(await this.sanitizeOutput(results, ctx), { pagination });
      },

      async findOne(ctx) {
        return this.transformResponse(await this.sanitizeOutput(await getOwned(ctx), ctx));
      },

      async create(ctx) {
        const userId = getUser(ctx);
        const data = getData(ctx);
        await this.validateInput(data, ctx);
        const sanitized: any = await this.sanitizeInput(data, ctx);

        // Set ownership AFTER sanitizing client input; never accept it from the request body.
        const entity = await documents.create({
          data: { ...sanitized, user: userId },
          populate: populateByUid[uid],
        });

        ctx.status = 201;
        return this.transformResponse(await this.sanitizeOutput(entity, ctx));
      },

      async update(ctx) {
        const existing = await getOwned(ctx);
        if (uid === 'api::solve-attempt.solve-attempt') {
          throw new errors.ValidationError('Tentativas concluídas são imutáveis.');
        }

        const data = getData(ctx);
        await this.validateInput(data, ctx);
        const sanitized: any = await this.sanitizeInput(data, ctx);

        const entity = await documents.update({
          documentId: existing.documentId,
          data: sanitized,
          populate: populateByUid[uid],
        });

        return this.transformResponse(await this.sanitizeOutput(entity, ctx));
      },

      async delete(ctx) {
        const existing = await getOwned(ctx);
        await documents.delete({ documentId: existing.documentId });
        return this.transformResponse(await this.sanitizeOutput(existing, ctx));
      },
    };
  });
}
