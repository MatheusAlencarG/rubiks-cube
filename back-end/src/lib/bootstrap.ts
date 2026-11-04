export async function configureDefaults(strapi: any) {
  const locales = strapi.plugin('i18n').service('locales');
  for (const locale of [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'English (United States)' },
  ]) {
    if (!(await locales.findByCode(locale.code))) await locales.create(locale);
  }

  const store = strapi.store({ type: 'core', name: 'rubiks-cube' });
  if (await store.get({ key: 'defaults-v1' })) return;
  await locales.setDefaultLocale({ code: 'pt-BR' });

  const roleRepository = strapi.db.query('plugin::users-permissions.role');
  const permissions = strapi.db.query('plugin::users-permissions.permission');
  for (const type of ['public', 'authenticated']) {
    const role = await roleRepository.findOne({ where: { type } });
    if (!role) throw new Error(`Papel nativo ausente: ${type}`);
    const actions = ['api::tutorial.tutorial.find', 'api::tutorial.tutorial.findOne'];
    if (type === 'authenticated') {
      for (const model of ['user-setting', 'cube-preset', 'solve-attempt', 'saved-game']) {
        for (const action of [
          'find',
          'findOne',
          'create',
          'delete',
          ...(model === 'solve-attempt' ? [] : ['update']),
        ]) {
          actions.push(`api::${model}.${model}.${action}`);
        }
      }
    }
    for (const action of actions) {
      const existing = await permissions.findOne({ where: { action, role: { id: role.id } } });
      if (!existing) await permissions.create({ data: { action, role: role.id } });
    }
    // User management stays in the admin panel; end users use /users/me and auth endpoints.
    for (const action of ['find', 'findOne', 'create', 'update', 'destroy']) {
      await permissions.deleteMany({
        where: { action: `plugin::users-permissions.user.${action}`, role: { id: role.id } },
      });
    }
  }
  await store.set({ key: 'defaults-v1', value: true });
}
