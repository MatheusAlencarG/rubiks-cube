import { test, expect } from '@playwright/test';
import { mockStrapi, tutorials } from './fixtures/strapi';

test('shows backend errors and retries instead of falling back to local tutorial JSON', async ({
  page,
}) => {
  await page.route('**/api/**', route =>
    route.fulfill({ status: 503, json: { error: { message: 'Unavailable' } } })
  );
  await page.goto('/tutorial');
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar');
  await mockStrapi(page);
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('heading', { name: 'Comandos do Jogo' })).toBeVisible();
});

test('uses CMS content, dynamic pagination, media and safe rich text', async ({ page }) => {
  const data = tutorials('pt-br');
  data[0].title = 'Título alterado no CMS';
  data[0].description =
    '<strong>Conteúdo do CMS</strong><img src=x onerror="window.compromised=true"><script>window.compromised=true</script>';
  const published = data.filter(item => item.kind !== 'step' || item.stepNumber === 1);
  await page.route('**/api/tutorials?**', route =>
    route.fulfill({
      json: {
        data: published,
        meta: { pagination: { page: 1, pageCount: 1, total: published.length } },
      },
    })
  );
  await page.goto('/tutorial');
  await expect(page.getByRole('heading', { name: 'Título alterado no CMS' })).toBeVisible();
  await expect(page.locator('.tutorialDescription strong')).toHaveText('Conteúdo do CMS');
  await expect(page.locator('.tutorialDescription img, .tutorialDescription script')).toHaveCount(
    0
  );
  await expect(page.locator('.navigatorContainer .page')).toHaveCount(3);
  await page
    .getByRole('link')
    .filter({ has: page.getByAltText('Next Arrow') })
    .click();
  await expect(page.locator('.partBackground img').first()).toHaveAttribute('alt', 'Quinas');
});

test('typing account credentials does not move the cube', async ({ page }) => {
  await mockStrapi(page);
  await page.goto('/rubicksCube');
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByLabel('E-mail', { exact: true }).fill('wasdqe@example.test');
  await page.getByLabel('Senha', { exact: true }).pressSequentially('wasdqewasdqe');
  await page.getByAltText('Close Config Popup', { exact: true }).click();
  await expect(page.getByLabel('Controles da partida')).toContainText('0 movimentos');
});
