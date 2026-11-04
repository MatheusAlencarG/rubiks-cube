import { expect, test, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Embedded third-party videos must not make the application's tests depend on YouTube.
  await page.route(/https:\/\/(?:www\.)?youtube\.com\//, route => route.abort());
});

test('preserves the layout, theme and tutorial routes', async ({ page }) => {
  for (const route of ['/tutorial', '/tutorial/parts', '/tutorial/step/1', '/tutorial/step/7']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('projeto do cubo mágico');
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    await expect(page.locator('.pageContainer')).toHaveCSS(
      'background-color',
      'rgb(245, 245, 245)'
    );
    await expect(page.locator('.pageContainer')).toHaveCSS('border-top-color', 'rgb(215, 250, 25)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(21, 21, 19)');
  }
});

test('opens settings, switches language and closes the popup', async ({ page }) => {
  await page.goto('/tutorial');
  await page.getByAltText('Config Icon', { exact: true }).click();
  await expect(page.locator('.generalConfigPopup')).toBeVisible();
  await page.locator('.languageConfigTitle').click();
  await page.getByLabel('English', { exact: true }).check();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("rubick's cube project");
  await page.getByAltText('Close Config Popup', { exact: true }).click();
  await expect(page.locator('.generalConfigPopup')).toBeHidden();
  await page.getByRole('link', { name: 'tutorial', exact: true }).click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Game Commands');
});

test('navigates forward and backward through the tutorial', async ({ page }) => {
  await page.goto('/tutorial');
  await page
    .getByRole('link')
    .filter({ has: page.getByAltText('Next Arrow') })
    .click();
  await expect(page).toHaveURL(/\/tutorial\/parts$/);
  await page
    .getByRole('link')
    .filter({ has: page.getByAltText('Prev Arrow') })
    .click();
  await expect(page).toHaveURL(/\/tutorial$/);
});

test('preserves the carousel and video disclosure', async ({ page }) => {
  await page.goto('/tutorial/step/1');
  const carousel = page.locator('.tutorialStepContainer .swiper-container');
  await expect(carousel).toBeVisible();
  const firstTitle = await carousel.locator('.swiper-slide-active h3').textContent();
  const bounds = await carousel.boundingBox();
  if (!bounds) throw new Error('Carousel has no visible bounds.');
  await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.15, bounds.y + bounds.height / 2, {
    steps: 15,
  });
  await page.mouse.up();
  await expect(carousel.locator('.swiper-slide-active h3')).not.toHaveText(firstTitle || '');
  await page.locator('.videosTitle').click();
  await expect(page.locator('.videoContent')).toHaveClass(/active/);
  await expect(page.locator('.videoContent iframe').first()).toBeVisible();
  await page.locator('.videosTitle').click();
  await expect(page.locator('.videoContent')).not.toHaveClass(/active/);
  await expect(page.locator('.videoContent')).toHaveCSS('height', '0px');
});

async function readCube(page: Page) {
  return page
    .locator('.pieceContainer')
    .evaluateAll(pieces =>
      pieces.map(piece =>
        ['data-firstcolor', 'data-secondcolor', 'data-thirdcolor'].map(attribute =>
          piece.getAttribute(attribute)
        )
      )
    );
}

test('preserves face moves, inverse moves and cube rotation', async ({ page }) => {
  await page.goto('/rubicksCube');
  await expect(page.locator('.pieceContainer')).toHaveCount(26);
  await expect(page.locator('.pieceFace')).toHaveCount(156);
  await expect(page.locator('.rubicksCubeContainer')).toHaveCSS('transform-style', 'preserve-3d');
  for (const key of ['w', 'a', 's', 'd', 'q', 'e']) {
    const initial = await readCube(page);
    await page.keyboard.press(key);
    await expect.poll(() => readCube(page)).not.toEqual(initial);
    await page.keyboard.press(`Shift+${key.toUpperCase()}`);
    await expect.poll(() => readCube(page)).toEqual(initial);
  }
  const rotation = await page.locator('.cube').evaluate(cube => cube.getAttribute('style'));
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.cube')).not.toHaveAttribute('style', rotation || '');
});
