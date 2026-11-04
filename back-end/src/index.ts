import { registerModelValidation } from './lib/model-middleware';
import { configureDefaults } from './lib/bootstrap';

export default {
  register({ strapi }) {
    registerModelValidation(strapi);
  },
  async bootstrap({ strapi }) {
    await configureDefaults(strapi);
  },
};
