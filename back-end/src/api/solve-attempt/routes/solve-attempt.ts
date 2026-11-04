import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::solve-attempt.solve-attempt', {
  except: ['update'],
});
