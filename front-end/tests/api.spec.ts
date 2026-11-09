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
  await page.getByRole('link', { name: 'Próxima página do tutorial' }).click();
  await expect(page.locator('.partBackground img').first()).toHaveAttribute('alt', 'Quinas');
});

test('typing account credentials does not move the cube', async ({ page }) => {
  await mockStrapi(page);
  await page.goto('/rubicksCube');
  await page.getByRole('button', { name: 'Conta', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Conta', exact: true })).toBeVisible();
  await page.getByLabel('E-mail', { exact: true }).fill('wasdqe@example.test');
  await page.getByLabel('Senha', { exact: true }).pressSequentially('wasdqewasdqe');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Conta', exact: true })).toBeFocused();
  await expect(page.getByLabel('Controles da partida')).toContainText('0 movimentos');
});

test('edits the username and shows the uploaded photo on the account button', async ({ page }) => {
  await mockStrapi(page);
  await page.addInitScript(() => sessionStorage.setItem('rubiks.session.v1', 'test-jwt'));
  const avatarUrl = 'http://127.0.0.1:4173/images/cube-center.png';
  let profile = {
    id: 1,
    username: 'cube',
    email: 'cube@example.test',
    avatar: null as { url: string } | null,
  };

  await page.route('**/api/account/profile', async route => {
    const request = route.request();
    if (request.method() === 'PUT') {
      expect(request.headers()['content-type']).toContain('multipart/form-data; boundary=');
      expect(request.postDataBuffer()?.toString()).toContain('novo-nome');
      expect(request.postDataBuffer()?.toString()).toContain('filename="cube-center.png"');
      profile = { ...profile, username: 'novo-nome', avatar: { url: avatarUrl } };
    }
    await route.fulfill({ json: profile });
  });

  await page.goto('/tutorial');
  const account = page.getByRole('button', { name: 'Conta', exact: true });
  await expect(account.locator('svg')).toBeVisible();
  await account.click();
  await page.getByRole('button', { name: 'Editar perfil' }).click();
  await page.getByLabel('Nome de usuário', { exact: true }).fill('novo-nome');
  await page.getByLabel('Foto de perfil').setInputFiles('public/images/cube-center.png');
  await page.getByRole('button', { name: 'Salvar perfil' }).click();
  await expect(page.getByText('Perfil salvo.')).toBeVisible();
  await expect(page.getByText('novo-nome', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Fechar conta' }).click();
  await expect(account.locator('img')).toHaveAttribute('src', avatarUrl);
  await page.reload();
  await expect(account.locator('img')).toHaveAttribute('src', avatarUrl);
});

test('loads saved games five at a time and returns to the last available page', async ({
  page,
}) => {
  await mockStrapi(page);
  await page.addInitScript(() => sessionStorage.setItem('rubiks.session.v1', 'test-jwt'));

  const games = Array.from({ length: 6 }, (_, index) => ({
    documentId: `game-${index + 1}`,
    name: `Partida ${index + 1}`,
    elapsedMs: 64250,
    moves: [{ move: 'F', atMs: 100 }],
  }));
  const pageSizes: number[] = [];
  const attempts = Array.from({ length: 6 }, (_, index) => ({
    documentId: `attempt-${index + 1}`,
    durationMs: (index + 1) * 1000,
    completedAt: '2026-01-01T12:00:00.000Z',
    moves: [],
  }));

  await page.route('**/api/**', async route => {
    const request = route.request();
    const { pathname, searchParams } = new URL(request.url());

    if (pathname === '/api/account/profile') {
      return route.fulfill({ json: { id: 1, username: 'cube', email: 'cube@example.test' } });
    }
    if (
      ['/api/saved-games', '/api/solve-attempts'].includes(pathname) &&
      request.method() === 'GET'
    ) {
      const entries = pathname === '/api/saved-games' ? games : attempts;
      const pageNumber = Number(searchParams.get('pagination[page]'));
      const pageSize = Number(searchParams.get('pagination[pageSize]'));
      pageSizes.push(pageSize);
      return route.fulfill({
        json: {
          data: entries.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
          meta: {
            pagination: {
              page: pageNumber,
              pageCount: Math.ceil(entries.length / pageSize),
              total: entries.length,
            },
          },
        },
      });
    }
    if (pathname === '/api/saved-games/game-6' && request.method() === 'DELETE') {
      games.pop();
      return route.fulfill({ status: 204 });
    }
    if (['/api/user-settings', '/api/cube-presets'].includes(pathname)) {
      return route.fulfill({
        json: { data: [], meta: { pagination: { page: 1, pageCount: 0, total: 0 } } },
      });
    }

    return route.fallback();
  });

  await page.goto('/rubicksCube');
  await page.getByText('Partidas e aparência', { exact: true }).click();

  const table = page.getByRole('table', { name: 'Partidas salvas' });
  await expect(table.getByRole('rowheader')).toHaveCount(5);
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    const gamesCard = await table.locator('xpath=ancestor::section[1]').boundingBox();
    const presetCard = await page
      .getByRole('heading', { name: 'Aparência do cubo' })
      .locator('..')
      .boundingBox();
    expect(gamesCard?.height).toBe(presetCard?.height);
  }
  await expect(table.getByRole('columnheader', { name: 'Movimentos' })).toBeVisible();
  const firstRename = table.getByRole('button', { name: 'Renomear', exact: true }).first();
  await expect(firstRename).toBeVisible();
  await expect(firstRename).toHaveText('');
  await expect(firstRename.locator('svg')).toBeVisible();
  await firstRename.focus();
  await page.keyboard.press('Enter');
  await expect(table.getByRole('textbox', { name: 'Nome da partida' })).toBeFocused();
  await table.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(table.getByRole('cell', { name: '1 min 4,25 s' })).toHaveCount(5);
  const gamesPages = page.getByRole('navigation', { name: 'Páginas de partidas salvas' });
  await expect(gamesPages.getByText('Página 1 de 2')).toBeVisible();

  await gamesPages.getByRole('button', { name: 'Próxima', exact: true }).click();
  await expect(table.getByRole('rowheader', { name: 'Partida 6' })).toBeVisible();
  await expect(gamesPages.getByText('Página 2 de 2')).toBeVisible();
  await page.getByRole('button', { name: 'Excluir partida', exact: true }).click();

  await expect(table.getByRole('rowheader')).toHaveCount(5);
  await expect(page.getByText('5 partidas', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Páginas de partidas salvas' })).toHaveCount(0);
  expect(pageSizes.length).toBeGreaterThanOrEqual(3);
  expect(pageSizes.every(size => size === 5)).toBe(true);

  const attemptPages = page.getByRole('navigation', { name: 'Páginas de tentativas concluídas' });
  await expect(page.getByRole('button', { name: 'Excluir tentativa' })).toHaveCount(5);
  await attemptPages.getByRole('button', { name: 'Próxima' }).click();
  await expect(attemptPages.getByText('Página 2 de 2')).toBeVisible();
  await expect(page.getByText('6.00 s', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Excluir tentativa' })).toHaveCount(1);

  await page.getByRole('heading', { level: 1 }).click();
  await expect(table).toBeHidden();
});

test('pauses the timer and blocks face turns and view rotation', async ({ page }) => {
  await mockStrapi(page);
  await page.clock.install();
  await page.goto('/rubicksCube');

  const controls = page.getByLabel('Controles da partida');
  const timer = page.getByRole('timer', { name: 'Tempo decorrido' });
  await expect(timer).toHaveText('00:00,0');
  const newGame = page.getByRole('button', { name: 'Nova partida' });
  const timerBounds = await timer.boundingBox();
  const controlsBounds = await newGame.boundingBox();
  expect(timerBounds!.y).toBeGreaterThan(controlsBounds!.y + controlsBounds!.height);
  expect(
    await timer.evaluate(element => parseFloat(getComputedStyle(element).fontSize))
  ).toBeGreaterThanOrEqual(30);
  await page.keyboard.press('w');
  await expect(controls).toContainText('1 movimentos');
  await page.clock.fastForward(1200);

  const controlsHeight = await controls.evaluate(element => element.offsetHeight);
  await page.getByRole('button', { name: 'Pausar cronômetro' }).click();
  const elapsed = await timer.textContent();
  const view = await page.locator('.cube').getAttribute('style');
  await expect(newGame).toBeEnabled();
  const solve = page.getByRole('button', { name: 'Resolver cubo' });
  await expect(solve).toBeDisabled();
  await page.keyboard.press('w');
  const warning = controls.getByText('Comando bloqueado. Retome o cronômetro para mover o cubo.');
  await expect(warning).toBeVisible();
  const warningBounds = await warning.boundingBox();
  expect(warningBounds!.x).toBeLessThan(timerBounds!.x);
  expect(warningBounds!.y).toBeGreaterThan(timerBounds!.y + timerBounds!.height);
  expect(await controls.evaluate(element => element.offsetHeight)).toBe(controlsHeight);

  await solve.dispatchEvent('click');
  await expect(warning).toBeVisible();

  await page.getByRole('heading', { level: 1 }).click();
  await page.keyboard.press('w');
  await page.keyboard.press('ArrowRight');
  await page.clock.fastForward(3000);
  await expect(timer).toHaveText(elapsed!);
  await expect(controls).toContainText('1 movimentos');
  await expect(page.locator('.cube')).toHaveAttribute('style', view!);

  await expect(warning).toBeVisible();
  await page.clock.fastForward(3100);
  await expect(warning).toBeHidden();
  await page.keyboard.press('w');
  await expect(warning).toBeVisible();

  await page.getByRole('button', { name: 'Retomar cronômetro' }).click();
  await page.getByRole('heading', { level: 1 }).click();
  await page.keyboard.press('w');
  await expect(controls).toContainText('2 movimentos');
  await page.clock.fastForward(1100);
  await expect(timer).not.toHaveText(elapsed!);

  await page.keyboard.press('p');
  await expect(page.getByRole('button', { name: 'Retomar cronômetro' })).toBeVisible();

  await newGame.click();
  await expect(page.getByRole('button', { name: 'Pausar cronômetro' })).toBeVisible();
  await expect(timer).toHaveText('00:00,0');
  await solve.click();
  await expect(page.getByRole('button', { name: 'Retomar cronômetro' })).toBeVisible();

  const paused = controls.getByText('Em pausa. Retome o cronômetro para mover o cubo.');
  const autoSolved = controls.getByText('Resolução automática usada.', { exact: false });
  await expect(paused).toBeVisible();
  await expect(autoSolved).toBeVisible();

  await page.clock.fastForward(5100);
  await expect(paused).toBeHidden();
  await expect(autoSolved).toBeVisible();
  await expect(solve).toBeDisabled();

  await page.clock.fastForward(3000);
  await expect(autoSolved).toBeHidden();
  await expect(timer).toHaveText('00:00,0');
});
