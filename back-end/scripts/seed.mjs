import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { compileStrapi, createStrapi } = require('@strapi/strapi');
const app = createStrapi({ ...(await compileStrapi()), serveAdminPanel: false });
try {
  await app.load();
  const { seedTutorials } = require('../dist/src/lib/seed-tutorials.js');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const result = await seedTutorials(app, root);
  console.log(
    `Importação concluída: ${result.created} traduções novas; ${result.images} imagens utilizadas; ${result.updated} textos de comandos atualizados.`
  );
} finally {
  await app.destroy();
}
