const path = require('node:path');
const { randomBytes } = require('node:crypto');

if (!process.env.DATABASE_NAME?.endsWith('_test')) {
  throw new Error('O servidor de integração exige um banco exclusivo com nome terminado em _test.');
}
Object.assign(process.env, {
  NODE_ENV: 'test',
  HOST: '127.0.0.1',
  PORT: process.env.TEST_API_PORT || '1340',
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://127.0.0.1:4173',
  STRAPI_TELEMETRY_DISABLED: 'true',
});
process.env.PUBLIC_URL = `http://127.0.0.1:${process.env.PORT}`;
for (const name of [
  'APP_KEYS',
  'ADMIN_JWT_SECRET',
  'JWT_SECRET',
  'API_TOKEN_SALT',
  'TRANSFER_TOKEN_SALT',
  'ENCRYPTION_KEY',
]) {
  process.env[name] = randomBytes(32).toString('hex');
}
const { compileStrapi, createStrapi } = require('@strapi/strapi');
let app;
async function shutdown() {
  if (app) await app.destroy();
}
(async () => {
  app = createStrapi({ ...(await compileStrapi()), serveAdminPanel: false });
  await app.start();
  await require('../dist/src/lib/seed-tutorials.js').seedTutorials(
    app,
    path.resolve(__dirname, '../..')
  );
  console.log('FULLSTACK TEST READY');
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, async () => {
      await shutdown();
      process.exit(0);
    });
})().catch(async error => {
  console.error(error);
  await shutdown();
  process.exitCode = 1;
});
