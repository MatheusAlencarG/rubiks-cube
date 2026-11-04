import { factories } from '@strapi/strapi';

const populate = { parts: { populate: { image: true } }, videos: true };

export default factories.createCoreController('api::tutorial.tutorial' as any, () => ({
  async find(ctx) {
    ctx.query.status = 'published';
    ctx.query.populate = populate;
    ctx.query.sort ??= ['displayOrder:asc'];
    return super.find(ctx);
  },
  async findOne(ctx) {
    ctx.query.status = 'published';
    ctx.query.populate = populate;
    return super.findOne(ctx);
  },
}));
