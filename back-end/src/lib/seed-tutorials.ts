import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

/** Import existing repository content explicitly; never overwrite edited entries on startup. */
export async function seedTutorials(strapi: any, repositoryRoot: string) {
  const seedRoot = path.resolve(repositoryRoot, 'back-end/seed-data/tutorials');
  const publicRoot = path.resolve(repositoryRoot, 'front-end/public');
  const parts = JSON.parse(await readFile(path.join(seedRoot, 'parts.json'), 'utf8')).content;
  const steps = JSON.parse(await readFile(path.join(seedRoot, 'steps.json'), 'utf8')).content;
  const documents = strapi.documents('api::tutorial.tutorial');
  const files = strapi.db.query('plugin::upload.file');
  const mediaCache = new Map<string, number>();

  async function importImage(relativeUrl: string) {
    if (mediaCache.has(relativeUrl)) return mediaCache.get(relativeUrl);

    const file = path.resolve(publicRoot, `.${relativeUrl}`);
    if (!file.startsWith(`${publicRoot}${path.sep}`)) throw new Error('Imagem fora de public.');

    const name = `rubiks-seed-${path.basename(file)}`;
    let media = await files.findOne({ where: { name } });
    if (!media) {
      const info = await stat(file);
      [media] = await strapi
        .plugin('upload')
        .service('upload')
        .upload({
          data: { fileInfo: { name, alternativeText: path.basename(file, path.extname(file)) } },
          files: {
            filepath: file,
            originalFilename: path.basename(file),
            mimetype: 'image/png',
            size: info.size,
          },
        });
    }

    mediaCache.set(relativeUrl, media.id);
    return media.id;
  }

  async function tutorialData(sourceKey: string, kind: string, number?: number) {
    const english = sourceKey === 'en-us';
    if (kind === 'overview') {
      return {
        title: english ? 'Game Commands' : 'Comandos do Jogo',
        description: english
          ? 'Practice with the interactive 3×3 cube. Follow the current controls below and customize your keyboard and appearance in settings.'
          : 'Pratique com o cubo 3×3 interativo. Consulte os comandos atuais abaixo e personalize o teclado e a aparência nas configurações.',
        cubeType: '3x3',
        kind,
        displayOrder: 0,
        parts: [],
        videos: [],
      };
    }

    const source =
      kind === 'parts' ? parts[sourceKey] : steps[sourceKey].find(step => step.id === number);
    if (!source) throw new Error(`Conteúdo não encontrado: ${sourceKey}/${number}`);

    const importedParts = [];
    for (const part of source.parts) {
      importedParts.push({
        title: part.title,
        description: part.partDescription ?? part.description,
        image: await importImage(part.imgURL ?? part.image),
        imageAlt: part.title,
      });
    }

    return {
      title: source.title,
      description: source.description,
      cubeType: '3x3',
      kind,
      displayOrder: kind === 'parts' ? 1 : number + 1,
      stepNumber: kind === 'step' ? number : null,
      parts: importedParts,
      videos: [source.videoURLOne, source.videoURLTwo].filter(Boolean).map((url, index) => ({
        title: `${english ? 'Video' : 'Vídeo'} ${index + 1}`,
        embedUrl: url,
      })),
    };
  }

  async function updateLegacyOverview(
    existing: { description: string; documentId: string },
    sourceKey: string,
    locale: string
  ) {
    const legacyDescription =
      sourceKey === 'en-us'
        ? 'Use W, A, S, D, Q and E to move the cube faces. Hold Shift for inverse moves. Use the arrow keys to rotate the cube view.'
        : 'Use W, A, S, D, Q e E para mover as faces do cubo. Segure Shift para os movimentos inversos. Use as setas para girar a visualização do cubo.';

    if (existing.description !== legacyDescription) return false;

    const { documentId } = existing;
    const populate = { parts: true, videos: true };
    const draft = await documents.findOne({ documentId, locale, status: 'draft', populate });
    const published = await documents.findOne({
      documentId,
      locale,
      status: 'published',
      populate,
    });

    const fields = [
      'title',
      'slug',
      'description',
      'kind',
      'cubeType',
      'displayOrder',
      'stepNumber',
    ];
    const hasUntouchedContent =
      draft &&
      published &&
      fields.every(key => draft[key] === published[key]) &&
      !draft.parts.length &&
      !draft.videos.length &&
      !published.parts.length &&
      !published.videos.length;

    if (!hasUntouchedContent) return false;

    const source = await tutorialData(sourceKey, 'overview');
    if (draft.title !== source.title) return false;

    await documents.update({
      documentId,
      locale,
      status: 'published',
      data: { description: source.description },
    });

    return true;
  }

  let created = 0;
  let updated = 0;

  for (const item of [
    { key: 'overview', kind: 'overview' },
    { key: 'cube-parts', kind: 'parts' },
    ...steps['pt-br'].map(step => ({ key: `step-${step.id}`, kind: 'step', number: step.id })),
  ]) {
    let documentId: string | undefined;

    for (const [sourceKey, locale] of [
      ['pt-br', 'pt-BR'],
      ['en-us', 'en-US'],
    ]) {
      const slug = `${item.key}-${sourceKey}`;
      const existing = await documents.findFirst({ locale, filters: { slug } });

      if (existing) {
        documentId ??= existing.documentId;

        if (item.kind === 'overview' && (await updateLegacyOverview(existing, sourceKey, locale))) {
          updated++;
        }

        continue;
      }

      const data = { ...(await tutorialData(sourceKey, item.kind, item.number)), slug };
      const result = documentId
        ? await documents.update({ documentId, locale, status: 'published', data })
        : await documents.create({ locale, status: 'published', data });

      documentId = result.documentId;
      created++;
    }
  }

  return { created, updated, images: mediaCache.size };
}
