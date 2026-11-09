import { expect, test } from '@playwright/test';
import { mockStrapi } from './fixtures/strapi';
import { DEFAULT_UI } from '../src/preferences';

test.beforeEach(async ({ page }) => {
  await mockStrapi(page);
});

test('retrying synchronization resends the unsaved preferences', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('rubiks.session.v1', 'test-jwt'));
  let fail = true;
  let stored = { ...DEFAULT_UI, documentId: 'preferences', language: 'pt-BR', activePreset: null };
  await page.route('**/api/**', async route => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    if (pathname === '/api/users/me')
      return route.fulfill({ json: { id: 1, username: 'test-user', email: 'test@example.test' } });
    if (pathname.startsWith('/api/user-settings')) {
      if (request.method() === 'PUT') {
        if (fail) {
          fail = false;
          return route.fulfill({
            status: 503,
            json: { error: { message: 'Temporariamente indisponível' } },
          });
        }
        stored = { ...stored, ...request.postDataJSON().data };
        return route.fulfill({ json: { data: stored } });
      }
      return route.fulfill({
        json: { data: [stored], meta: { pagination: { page: 1, pageCount: 1, total: 1 } } },
      });
    }
    if (['/api/cube-presets', '/api/saved-games', '/api/solve-attempts'].includes(pathname))
      return route.fulfill({
        json: { data: [], meta: { pagination: { page: 1, pageCount: 1, total: 0 } } },
      });
    return route.fallback();
  });
  await page.goto('/tutorial');
  await page.getByAltText('Config Icon', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sair', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByRole('button', { name: /^Tema/ }).click();
  await page.getByRole('combobox', { name: 'Aparência', exact: true }).selectOption('light');
  await expect(page.getByRole('alert')).toHaveText('Temporariamente indisponível');
  const retry = page.waitForRequest(request => request.method() === 'PUT');
  await page.getByRole('button', { name: 'Tentar sincronizar novamente', exact: true }).click();
  expect((await retry).postDataJSON().data.themeMode).toBe('light');
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(stored.themeMode).toBe('light');
});
test('themes, custom palette, bindings and hints preference survive reload for visitors', async ({
  page,
}) => {
  await page.goto('/rubicksCube');
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByRole('button', { name: /^Tema/ }).click();
  await page.getByRole('combobox', { name: 'Aparência', exact: true }).selectOption('light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 242, 247)');
  await page.getByRole('combobox', { name: 'Aparência', exact: true }).selectOption('custom');
  await page.getByLabel('Fundo da página', { exact: true }).fill('#123456');
  await page.getByLabel('Painéis', { exact: true }).fill('#234567');
  await page.getByLabel('Texto', { exact: true }).fill('#ffffff');
  await page.getByLabel('Destaque', { exact: true }).fill('#abcdef');
  await page.getByRole('button', { name: 'Aplicar cores', exact: true }).click();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await page.getByRole('button', { name: /^Comandos do teclado/ }).click();
  const front = page.getByLabel('Face frontal', { exact: true });
  await front.focus();
  await page.keyboard.press('x');
  await expect(front).toHaveValue('X');
  await page.getByRole('button', { name: /^Dicas/ }).click();
  await page.getByLabel('Modo dicas', { exact: true }).check();
  await page.getByAltText('Close Config Popup', { exact: true }).click();
  await page.locator('body').click({ position: { x: 3, y: 3 } });
  await page.keyboard.press('w');
  await expect(page.getByLabel('Controles da partida')).toContainText('0 movimentos');
  await page.keyboard.press('x');
  await expect(page.getByLabel('Controles da partida')).toContainText('1 movimentos');
  await page.goto('/tutorial');
  await expect(page.locator('kbd').filter({ hasText: /^X$/ })).toBeVisible();
  await page.reload();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByRole('button', { name: /^Dicas/ }).click();
  await expect(page.getByLabel('Modo dicas', { exact: true })).toBeChecked();
  await page.getByRole('button', { name: /^Comandos do teclado/ }).click();
  await page.getByRole('button', { name: 'Restaurar comandos padrão', exact: true }).click();
  await expect(page.getByLabel('Face frontal', { exact: true })).toHaveValue('W');
});

test('the selected header tab has stronger typography and follows navigation', async ({ page }) => {
  await page.goto('/tutorial');
  const tutorial = page.getByRole('link', { name: 'tutorial', exact: true });
  const cube = page.getByRole('link', { name: 'cubo mágico', exact: true });
  await expect(tutorial).toHaveAttribute('aria-current', 'page');
  await expect(tutorial).toHaveCSS('font-weight', '700');
  await expect(cube).toHaveCSS('font-weight', '500');
  await cube.click();
  await expect(cube).toHaveAttribute('aria-current', 'page');
  await expect(cube).toHaveCSS('font-weight', '700');
  await expect(tutorial).toHaveCSS('font-weight', '500');
});
