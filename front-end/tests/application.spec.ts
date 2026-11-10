import { expect, test, Page } from '@playwright/test';
import { mockStrapi } from './fixtures/strapi';

test.beforeEach(async ({ page }) => {
  await mockStrapi(page);
  // Embedded third-party videos must not make the application's tests depend on YouTube.
  await page.route(/https:\/\/(?:www\.)?youtube\.com\//, route => route.abort());
});

test('preserves the layout, theme and tutorial routes', async ({ page }) => {
  for (const route of ['/tutorial', '/tutorial/parts', '/tutorial/step/1', '/tutorial/step/7']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('projeto do cubo mágico');
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    await expect(page.locator('.pageContainer')).toHaveCSS('background-color', 'rgb(36, 36, 32)');
    await expect(page.locator('.pageContainer')).toHaveCSS('border-top-color', 'rgb(215, 250, 25)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(21, 21, 19)');
  }
});

test('opens settings, switches language and closes the popup', async ({ page }) => {
  await page.goto('/tutorial');
  await page.getByRole('button', { name: /^(configurações|configurations)$/i }).click();
  await expect(page.locator('.generalConfigPopup')).toBeVisible();
  await page.getByRole('button', { name: /idiomas/ }).click();
  await page.getByLabel('English', { exact: true }).check();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("rubick's cube project");
  await page.getByRole('button', { name: /^(fechar configurações|close settings)$/i }).click();
  await expect(page.locator('.generalConfigPopup')).toBeHidden();
  await page.getByRole('link', { name: 'tutorial', exact: true }).click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Game Commands');
});

test('opens the public ranking from the tutorial and shows recorded solve times', async ({
  page,
}) => {
  await page.route('**/api/ranking', route =>
    route.fulfill({
      json: {
        data: [
          { position: 1, username: 'camila', durationMs: 8942, moveCount: 24 },
          { position: 2, username: 'rafael', durationMs: 63145, moveCount: 38 },
        ],
      },
    })
  );
  await page.goto('/tutorial');
  const command = page.locator('kbd').filter({ hasText: /^W$/ });
  await expect(command).toHaveCSS('font-weight', '700');
  await expect(command).toHaveCSS('color', 'rgb(215, 250, 25)');

  const ranking = page.getByRole('link', { name: 'Ranking' });
  await ranking.click();
  await expect(page).toHaveURL(/\/ranking$/);
  await expect(ranking).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('link', { name: 'tutorial', exact: true })).not.toHaveAttribute(
    'aria-current'
  );
  const table = page.getByRole('table', { name: 'Melhores tempos' });
  await expect(table.getByRole('rowheader')).toHaveText(['camila', 'rafael']);
  await expect(table.getByText('8,942 s', { exact: true })).toBeVisible();
  await expect(table.getByText('1 min 03,145 s', { exact: true })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Movimentos' })).toBeVisible();
  await expect(
    table
      .getByRole('row')
      .filter({ hasText: 'camila' })
      .getByRole('cell', { name: '24', exact: true })
  ).toBeVisible();
});

test('navigates forward and backward through the tutorial', async ({ page }) => {
  await page.goto('/tutorial');
  await page.getByRole('link', { name: 'Próxima página do tutorial' }).click();
  await expect(page).toHaveURL(/\/tutorial\/parts$/);
  await page.getByRole('link', { name: 'Página anterior do tutorial' }).click();
  await expect(page).toHaveURL(/\/tutorial$/);
});

test('distinguishes the current tutorial dot in both default themes', async ({ page }) => {
  await page.goto('/tutorial/step/1');

  const navigation = page.getByRole('navigation', { name: 'Páginas do tutorial' });
  const current = navigation.getByRole('link', { name: 'Tutorial 3', exact: true });
  const next = navigation.getByRole('link', { name: 'Tutorial 4', exact: true });
  await expect(current).toHaveAttribute('aria-current', 'page');
  await expect(current.locator('.page')).toHaveCSS('width', '20px');
  await expect(next.locator('.page')).toHaveCSS('width', '10px');

  async function expectVisibleMarkers() {
    await expect
      .poll(() =>
        navigation.evaluate(element => {
          const active = element.querySelector('[aria-current="page"] .page')!;
          const inactive = element.querySelector('a:not([aria-current]) .page')!;
          const context = document.createElement('canvas').getContext('2d')!;

          function luminance(color: string) {
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = color;
            context.fillRect(0, 0, 1, 1);

            const channels = Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
            const [red, green, blue] = channels.map(channel => {
              const value = channel / 255;
              return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            });

            return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
          }

          const background = luminance(getComputedStyle(element).backgroundColor);
          const colors = [
            getComputedStyle(active).backgroundColor,
            getComputedStyle(inactive).borderTopColor,
          ];
          const ratios = colors.map(color => {
            const foreground = luminance(color);
            return (
              (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
            );
          });

          return Math.min(...ratios);
        })
      )
      .toBeGreaterThanOrEqual(3);
  }

  await expectVisibleMarkers();
  await page.getByRole('button', { name: 'configurações', exact: true }).click();
  await page.getByRole('button', { name: /^Tema/ }).click();
  await page.getByRole('combobox', { name: 'Aparência', exact: true }).selectOption('light');
  await page.getByRole('button', { name: 'Fechar configurações' }).click();
  await expectVisibleMarkers();

  await next.click();
  await expect(page).toHaveURL(/\/tutorial\/step\/2$/);
  await expect(next).toHaveAttribute('aria-current', 'page');
});

test('remembers the current tutorial when switching to the cube and back', async ({ page }) => {
  await page.goto('/tutorial/step/4');
  await expect(page.locator('.tutorialStepDescription h2')).toBeVisible();
  await page.getByRole('link', { name: 'cubo mágico', exact: true }).click();
  await expect(page.locator('.cube')).toBeVisible();
  await page.getByRole('link', { name: 'tutorial', exact: true }).click();
  await expect(page).toHaveURL(/\/tutorial\/step\/4$/);
  await expect(page.locator('.tutorialStepDescription h2')).toBeVisible();
});

test('supports keyboard settings and responsive carousels', async ({ page }) => {
  await page.goto('/tutorial/parts');
  const settings = page.getByRole('button', { name: 'configurações', exact: true });
  await settings.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  const languages = page.getByRole('button', { name: /idiomas/ });
  await languages.focus();
  await page.keyboard.press('Space');
  await expect(languages).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(settings).toBeFocused();
  const slidesPerView = () =>
    page
      .locator('.swiper-container')
      .evaluate(
        element =>
          (element as HTMLElement & { swiper: { params: { slidesPerView: number } } }).swiper.params
            .slidesPerView
      );
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect.poll(slidesPerView).toBe(3);
  await page.setViewportSize({ width: 900, height: 900 });
  await expect.poll(slidesPerView).toBe(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(slidesPerView).toBe(1);
  await expect(page.locator('.swiper-container')).toBeVisible();
});

test('keeps tutorial cards separated when swiping and expanding videos', async ({
  page,
  isMobile,
}) => {
  await page.goto('/tutorial/step/2');
  const carousel = page.locator('.tutorialStepContainer .swiper-container');
  await expect(carousel).toBeVisible();

  const activeTitle = carousel.locator('.swiper-slide-active h3');
  await expect(activeTitle).toBeVisible();
  const formula = carousel.locator('.swiper-slide-active kbd');
  await expect(formula).toHaveText("D, Q, Q, 'D");
  await expect(formula).toHaveCSS('font-weight', '700');
  await expect(formula).toHaveCSS('color', 'rgb(215, 250, 25)');
  const firstTitle = await activeTitle.textContent();
  const cards = carousel.locator('.partBackground');
  await expect(cards).toHaveCount(5);

  async function expectCardsToFit() {
    await expect
      .poll(() =>
        cards.evaluateAll(items =>
          items.every((card, index) => {
            const frame = card.getBoundingClientRect();
            const next = items[index + 1]?.getBoundingClientRect();
            const content = Array.from(card.querySelectorAll('h3, .partDescription, img, .partId'));
            const boxes = content.map(element => element.getBoundingClientRect());

            return (
              card.scrollWidth <= card.clientWidth + 1 &&
              card.scrollHeight <= card.clientHeight + 1 &&
              (!next || next.left - frame.right >= 8) &&
              boxes.every(
                (box, position) =>
                  box.top >= frame.top &&
                  box.bottom <= frame.bottom &&
                  (position === 0 || box.top >= boxes[position - 1].bottom)
              )
            );
          })
        )
      )
      .toBe(true);
  }

  await expectCardsToFit();
  await carousel.scrollIntoViewIfNeeded();
  const bounds = await carousel.boundingBox();
  const viewport = page.viewportSize();
  if (!bounds || !viewport) throw new Error('Carousel has no visible bounds.');

  const start = bounds.x + bounds.width * 0.8;
  const end = bounds.x + bounds.width * 0.15;
  const y = (Math.max(0, bounds.y) + Math.min(viewport.height, bounds.y + bounds.height)) / 2;

  if (isMobile) {
    const touch = await page.context().newCDPSession(page);
    await touch.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: start, y }],
    });
    for (const fraction of [0.25, 0.5, 0.75, 1]) {
      await touch.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: start + (end - start) * fraction, y }],
      });
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.detach();
  } else {
    await page.mouse.move(start, y);
    await page.mouse.down();
    await page.mouse.move(end, y, { steps: 15 });
    await page.mouse.up();
  }

  await expect(activeTitle).not.toHaveText(firstTitle || '');
  await expectCardsToFit();
  const videosToggle = page.locator('.videosTitle');
  await videosToggle.click();
  await expect(videosToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.videoContent iframe').first()).toBeVisible();

  await videosToggle.click();
  await expect(videosToggle).toHaveAttribute('aria-expanded', 'false');
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
  await page.getByRole('button', { name: 'Nova partida', exact: true }).click();
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
