import type { Page } from '@playwright/test';
import parts from '../../../back-end/seed-data/tutorials/parts.json';
import steps from '../../../back-end/seed-data/tutorials/steps.json';

export function tutorials(locale: 'pt-br' | 'en-us') {
  const en = locale === 'en-us';
  const sourceParts = parts.content[locale];
  return [
    {
      documentId: 'overview',
      title: en ? 'Game Commands' : 'Comandos do Jogo',
      description: en ? 'Learn the controls' : 'Aprenda os comandos',
      kind: 'overview',
      displayOrder: 0,
      stepNumber: null,
      parts: [],
      videos: [],
    },
    {
      documentId: 'parts',
      title: sourceParts.title,
      description: sourceParts.description,
      kind: 'parts',
      displayOrder: 1,
      stepNumber: null,
      parts: sourceParts.parts.map((part, i) => ({
        id: i,
        title: part.title,
        description: part.partDescription,
        imageAlt: part.title,
        image: { url: `http://127.0.0.1:4173${part.imgURL}` },
      })),
      videos: [],
    },
    ...steps.content[locale].map(step => ({
      documentId: `step-${step.id}`,
      title: step.title,
      description: step.description,
      kind: 'step',
      displayOrder: step.id + 1,
      stepNumber: step.id,
      parts: step.parts.map((part, i) => ({
        id: i,
        title: part.title,
        description: part.description,
        imageAlt: part.title,
        image: { url: `http://127.0.0.1:4173${part.image}` },
      })),
      videos: [step.videoURLOne, step.videoURLTwo]
        .filter(Boolean)
        .map((embedUrl, i) => ({ id: i, title: `Video ${i + 1}`, embedUrl })),
    })),
  ];
}
export async function mockStrapi(page: Page) {
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/tutorials') {
      const data = tutorials(url.searchParams.get('locale') === 'en-US' ? 'en-us' : 'pt-br');
      await route.fulfill({
        json: { data, meta: { pagination: { page: 1, pageCount: 1, total: data.length } } },
      });
    } else await route.fulfill({ status: 403, json: { error: { message: 'Forbidden' } } });
  });
}
