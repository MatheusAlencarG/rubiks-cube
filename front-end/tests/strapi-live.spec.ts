import { expect, test, Page } from '@playwright/test';

test.skip(
  !process.env.STRAPI_E2E_URL,
  'Requires a seeded Strapi and a disposable MySQL test database.'
);

async function colors(page: Page) {
  return page
    .locator('.pieceFace')
    .evaluateAll(faces => faces.map(face => getComputedStyle(face).backgroundColor));
}
async function blur(page: Page) {
  await page.locator('body').click({ position: { x: 3, y: 3 } });
}
test('real Strapi: account, language, saved game, replay, attempts, presets and user isolation', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const suffix = `${info.project.name}${Date.now()}`;
  const username = `cube${suffix}`;
  const password = `Test-${suffix}-password`;
  const email = `${username}@example.test`;
  await page.route(/https:\/\/(?:www\.)?youtube\.com\//, route => route.abort());
  await page.goto('/tutorial');
  await expect(page.getByRole('heading', { name: 'Comandos do Jogo' })).toBeVisible();
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByRole('button', { name: 'Cadastrar', exact: true }).click();
  await page.getByLabel('Nome de usuário', { exact: true }).fill(username);
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  const registration = page.waitForResponse(response =>
    response.url().endsWith('/api/auth/local/register')
  );
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  const auth = await (await registration).json();
  expect(auth.jwt).toBeTruthy();
  await expect(page.getByText(username, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /idiomas/ }).click();
  const preferences = page.waitForResponse(
    response =>
      response.url().includes('/api/user-settings') && response.request().method() === 'POST'
  );
  await page.getByLabel('English', { exact: true }).check();
  expect((await preferences).status()).toBe(201);
  await page.getByAltText('Close Config Popup', { exact: true }).click();

  await page.goto('/rubicksCube');
  await expect(page.getByRole('button', { name: 'Save game', exact: true })).toBeEnabled();
  await blur(page);
  await page.keyboard.press('w');
  await expect(page.getByRole('button', { name: 'Save game', exact: true })).toBeEnabled();
  const savedColors = await colors(page);
  const saveResponse = page.waitForResponse(
    response =>
      response.url().endsWith('/api/saved-games') && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Save game', exact: true }).click();
  const savedResponse = await saveResponse;
  expect(savedResponse.status()).toBe(201);
  const game = (await savedResponse.json()).data;
  expect(game.moves[0].move).toBe('F');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Save game', exact: true })).toBeEnabled();
  await page.getByText('Games and appearance', { exact: true }).click();
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await expect(page.getByLabel('Game controls')).toContainText('1 moves');
  expect(await colors(page)).toEqual(savedColors);
  await page.getByText('Games and appearance', { exact: true }).click();
  await blur(page);
  await page.keyboard.press('Shift+W');
  await expect(page.getByRole('button', { name: 'Save game', exact: true })).toBeEnabled();
  const updated = page.waitForResponse(
    response =>
      response.url().endsWith(`/api/saved-games/${game.documentId}`) &&
      response.request().method() === 'PUT'
  );
  await page.getByRole('button', { name: 'Save game', exact: true }).click();
  expect((await updated).status()).toBe(200);
  await page.getByText('Games and appearance', { exact: true }).click();
  const attemptResponse = page.waitForResponse(
    response =>
      response.url().endsWith('/api/solve-attempts') && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Record solved attempt', exact: true }).click();
  expect((await attemptResponse).status()).toBe(201);
  await expect(
    page.getByRole('button', { name: 'Record solved attempt', exact: true })
  ).toBeDisabled();

  await page.getByLabel('Preset name', { exact: true }).fill('My cloud preset');
  await page.locator('input[name="frontColor"]').fill('#123456');
  await page.getByLabel('Animation (ms)', { exact: true }).fill('0');
  const presetResponse = page.waitForResponse(
    response =>
      response.url().endsWith('/api/cube-presets') && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Create preset', exact: true }).click();
  const preset = (await (await presetResponse).json()).data;
  await expect(
    page.getByRole('combobox', { name: 'Active preset (starts a new game)', exact: true })
  ).toHaveValue(preset.documentId);
  await expect(page.locator('.pieceFace.front').first()).toHaveCSS(
    'background-color',
    'rgb(18, 52, 86)'
  );
  await page.getByLabel('Preset name', { exact: true }).fill('Updated preset');
  await page.getByRole('button', { name: 'Update preset', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Updated preset', exact: true })).toHaveCount(1);
  await page.screenshot({ path: info.outputPath('connected-controls.png') });
  await page.getByRole('button', { name: 'Delete preset', exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: 'Active preset (starts a new game)', exact: true })
  ).toHaveValue('');
  await page.getByRole('button', { name: 'Delete attempt', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Delete attempt', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Delete game', exact: true }).click();
  await expect(page.getByText('No saved games yet.', { exact: true })).toBeVisible();
  await page.getByText('Games and appearance', { exact: true }).click();
  const retainedResponse = page.waitForResponse(
    response =>
      response.url().endsWith('/api/saved-games') && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Save game', exact: true }).click();
  const retained = (await (await retainedResponse).json()).data;
  await expect(page.getByRole('status')).toHaveText('Saved.');
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText(username, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByRole('button', { name: 'Register', exact: true }).click();
  await page.getByLabel('Username', { exact: true }).fill(`${username}b`);
  await page.getByLabel('Email', { exact: true }).fill(`b${email}`);
  await page.getByLabel('Password', { exact: true }).fill(password);
  const secondRegistration = page.waitForResponse(response =>
    response.url().endsWith('/api/auth/local/register')
  );
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  const secondUser = await (await secondRegistration).json();
  await expect(page.getByText(`${username}b`, { exact: true })).toBeVisible();
  await page.getByAltText('Close Config Popup', { exact: true }).click();
  await page.getByText('Games and appearance', { exact: true }).click();
  await expect(page.getByText('No saved games yet.', { exact: true })).toBeVisible();
  const forbidden = await page.request.get(
    `${process.env.STRAPI_E2E_URL}/api/saved-games/${retained.documentId}`,
    { headers: { Authorization: `Bearer ${secondUser.jwt}` } }
  );
  expect(forbidden.status()).toBe(404);
  const own = await page.request.get(
    `${process.env.STRAPI_E2E_URL}/api/saved-games/${retained.documentId}`,
    { headers: { Authorization: `Bearer ${auth.jwt}` } }
  );
  expect(own.status()).toBe(200);
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByRole('button', { name: /^Theme/ }).click();
  const createPreferences = page.waitForResponse(
    response =>
      response.url().endsWith('/api/user-settings') && response.request().method() === 'POST'
  );
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).selectOption('light');
  expect((await createPreferences).status()).toBe(201);
  await page.getByRole('button', { name: /^Keyboard controls/ }).click();
  const saveKeys = page.waitForResponse(
    response =>
      response.url().includes('/api/user-settings/') && response.request().method() === 'PUT'
  );
  await page.getByLabel('Front face', { exact: true }).focus();
  await page.keyboard.press('x');
  expect((await saveKeys).status()).toBe(200);
  await page.getByRole('button', { name: /^Hints/ }).click();
  const saveHints = page.waitForResponse(
    response =>
      response.url().includes('/api/user-settings/') && response.request().method() === 'PUT'
  );
  await page.getByLabel('Hints mode', { exact: true }).check();
  const storedPreferences = (await (await saveHints).json()).data;
  expect(storedPreferences.hintsEnabled).toBe(true);
  expect(storedPreferences.keyboardBindings.front).toBe('x');
  expect(storedPreferences.themeMode).toBe('light');
  await page.reload();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(238, 242, 247)');
  await expect(page.getByRole('button', { name: 'Save game', exact: true })).toBeEnabled();
  await page.getByAltText('Config Icon', { exact: true }).click();
  await page.getByRole('button', { name: /^Hints/ }).click();
  await expect(page.getByLabel('Hints mode', { exact: true })).toBeChecked();
  await page.getByAltText('Close Config Popup', { exact: true }).click();
  await blur(page);
  await page.keyboard.press('x');
  await expect(page.getByRole('button', { name: 'Save game', exact: true })).toBeEnabled();
  const boundSave = page.waitForResponse(
    response =>
      response.url().endsWith('/api/saved-games') && response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Save game', exact: true }).click();
  expect((await (await boundSave).json()).data.moves[0].move).toBe('F');
  await expect(page.getByRole('alert')).toHaveCount(0);
});
