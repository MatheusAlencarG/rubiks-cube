const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { before, after, describe, it } = require('node:test');
const path = require('node:path');

if (!process.env.DATABASE_NAME?.endsWith('_test')) {
  throw new Error(
    'Configure um MySQL exclusivo para testes: DATABASE_NAME deve terminar em _test.'
  );
}
process.env.NODE_ENV = 'test';
process.env.HOST = '127.0.0.1';
process.env.PORT = process.env.TEST_API_PORT || '1340';
process.env.PUBLIC_URL = `http://127.0.0.1:${process.env.PORT}`;
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
for (const key of [
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
]) {
  process.env[key] ||= randomBytes(32).toString('hex');
}

const { compileStrapi, createStrapi } = require('@strapi/strapi');
const Cube = require('cubejs');
const base = process.env.PUBLIC_URL;
const state = facelets => ({ version: 1, cubeType: '3x3', facelets });
const initialState = state(new Cube().move('R').asString());
const solvedState = state(new Cube().asString());
let app;
let alice;
let bob;
let preset;
let settings;
let attempt;
let game;

async function request(route, { method = 'GET', token, data, raw = false } = {}) {
  const response = await fetch(base + route, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify(raw ? data : { data }),
  });
  const text = await response.text();
  const body = response.headers.get('content-type')?.includes('application/json')
    ? JSON.parse(text)
    : { error: { message: text } };
  return { status: response.status, body };
}

function success(result, status = 200) {
  assert.equal(
    result.status,
    status,
    JSON.stringify(result.body.error || { status: result.status })
  );
  return result.body.data;
}

describe('Strapi + MySQL integration', { timeout: 180000 }, () => {
  before(async () => {
    app = createStrapi({ ...(await compileStrapi()), serveAdminPanel: false });
    await app.start();
    const suffix = `${Date.now()}`;
    async function register(name) {
      const result = await request('/api/auth/local/register', {
        method: 'POST',
        raw: true,
        data: {
          username: `${name}${suffix}`,
          email: `${name}${suffix}@example.test`,
          password: randomBytes(24).toString('base64'),
          firstName: name,
        },
      });
      assert.equal(result.status, 200, JSON.stringify(result.body.error));
      return { token: result.body.jwt, id: result.body.user.id };
    }
    alice = await register('alice');
    bob = await register('bob');
    preset = success(
      await request('/api/cube-presets', {
        method: 'POST',
        token: alice.token,
        data: { name: 'Padrão', appearance: {} },
      }),
      201
    );
  });

  after(async () => {
    if (app) await app.destroy();
  });

  it('updates only the authenticated profile and saves an uploaded avatar', async () => {
    const route = '/api/account/profile';
    assert.ok([401, 403].includes((await request(route)).status));
    const original = (await request(route, { token: alice.token })).body;
    const other = (await request(route, { token: bob.token })).body;
    assert.equal(original.id, alice.id);
    assert.equal(original.password, undefined);

    const update = data => request(route, { method: 'PUT', token: alice.token, raw: true, data });
    assert.equal((await update({ username: other.username })).status, 409);
    assert.equal((await update({ username: other.email })).status, 409);
    assert.equal((await update({ id: bob.id, username: 'Outra conta' })).status, 400);

    const username = `profile-${Date.now()}`;
    const form = new FormData();
    const png = readFileSync(
      path.resolve(__dirname, '../../front-end/public/images/cube-center.png')
    );
    form.set('username', username);
    form.set('files', new Blob([png], { type: 'image/png' }), 'profile.png');
    const response = await fetch(base + route, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${alice.token}` },
      body: form,
    });
    const updated = await response.json();

    try {
      assert.equal(response.status, 200, JSON.stringify(updated));
      assert.equal(updated.id, alice.id);
      assert.equal(updated.username, username);
      assert.match(updated.avatar.url, /^\/uploads\//);
      assert.deepEqual((await request(route, { token: alice.token })).body, updated);
      assert.deepEqual((await request(route, { token: bob.token })).body, other);
      assert.equal((await fetch(base + updated.avatar.url)).status, 200);

      const renamed = await update({ username: `${username}-next` });
      assert.equal(renamed.status, 200);
      assert.equal(renamed.body.username, `${username}-next`);
      assert.deepEqual(renamed.body.avatar, updated.avatar);
    } finally {
      if (updated.avatar?.url) {
        const file = await app.db
          .query('plugin::upload.file')
          .findOne({ where: { url: updated.avatar.url } });
        if (file) await app.plugin('upload').service('upload').remove(file);
      }
    }
  });

  it('resets a local account password without email and rejects non-local origins', async () => {
    const route = '/api/local-password-reset';
    const username = `reset${Date.now()}`;
    const email = `${username}@example.test`;
    const oldPassword = randomBytes(24).toString('hex');
    const password = randomBytes(24).toString('hex');

    const registration = await request('/api/auth/local/register', {
      method: 'POST',
      raw: true,
      data: { username, email, password: oldPassword },
    });
    assert.equal(registration.status, 200);
    assert.deepEqual((await request(route)).body, { enabled: true });

    const payload = { email, password, passwordConfirmation: password };
    const forwardedReset = await fetch(base + route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.1' },
      body: JSON.stringify(payload),
    });
    assert.equal(forwardedReset.status, 404);

    const remoteOriginReset = await fetch(base + route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://example.test' },
      body: JSON.stringify(payload),
    });
    assert.equal(remoteOriginReset.status, 404);

    const environment = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      const productionReset = await request(route, { method: 'POST', raw: true, data: payload });
      assert.equal(productionReset.status, 404);
    } finally {
      process.env.NODE_ENV = environment;
    }

    const mismatch = await request(route, {
      method: 'POST',
      raw: true,
      data: { ...payload, passwordConfirmation: oldPassword },
    });
    assert.equal(mismatch.status, 400);

    const reset = await request(route, { method: 'POST', raw: true, data: payload });
    assert.equal(reset.status, 204);

    const login = password =>
      request('/api/auth/local', {
        method: 'POST',
        raw: true,
        data: { identifier: email, password },
      });
    assert.equal((await login(oldPassword)).status, 400);
    const signedIn = await login(password);
    assert.equal(signedIn.status, 200);
    assert.equal(signedIn.body.user.id, registration.body.user.id);
  });

  it('requires authentication and derives ownership from the authenticated user', async () => {
    assert.ok([401, 403].includes((await request('/api/cube-presets')).status));
    const list = success(await request('/api/cube-presets', { token: bob.token }));
    assert.deepEqual(list, []);
    assert.equal(
      (await request(`/api/cube-presets/${preset.documentId}`, { token: bob.token })).status,
      404
    );
    assert.equal(
      (
        await request('/api/cube-presets', {
          method: 'POST',
          token: bob.token,
          data: { name: 'Inválido', appearance: {}, user: alice.id },
        })
      ).status,
      400
    );
    assert.ok([401, 403].includes((await request('/api/users', { token: alice.token })).status));
  });

  it('prevents reading, updating, deleting and linking another user’s presets', async () => {
    for (const method of ['PUT', 'DELETE']) {
      assert.equal(
        (
          await request(`/api/cube-presets/${preset.documentId}`, {
            method,
            token: bob.token,
            ...(method === 'PUT' ? { data: { name: 'Outra pessoa' } } : {}),
          })
        ).status,
        404
      );
    }
    assert.equal(
      (
        await request('/api/user-settings', {
          method: 'POST',
          token: bob.token,
          data: { activePreset: preset.documentId },
        })
      ).status,
      400
    );
  });

  it('keeps one settings record per user and hides the internal uniqueness key', async () => {
    settings = success(
      await request('/api/user-settings', {
        method: 'POST',
        token: alice.token,
        data: { language: 'pt-BR', activePreset: preset.documentId },
      }),
      201
    );
    assert.equal(settings.ownerKey, undefined);
    assert.equal(settings.activePreset.documentId, preset.documentId);
    assert.equal(
      (await request('/api/user-settings', { method: 'POST', token: alice.token, data: {} }))
        .status,
      400
    );
    assert.equal(success(await request('/api/user-settings', { token: alice.token })).length, 1);
    assert.equal(
      (
        await request(`/api/user-settings/${settings.documentId}`, {
          method: 'PUT',
          token: alice.token,
          data: { themePrimaryColor: 'invalid' },
        })
      ).status,
      400
    );
  });

  it('stores theme, keyboard and hints preferences without losing them on partial updates', async () => {
    const keyboardBindings = {
      front: 'x',
      left: 'a',
      back: 's',
      right: 'd',
      top: 'q',
      bottom: 'e',
      viewLeft: 'ArrowLeft',
      viewRight: 'ArrowRight',
      viewUp: 'ArrowUp',
      viewDown: 'ArrowDown',
      pause: 'p',
    };
    const saved = success(
      await request(`/api/user-settings/${settings.documentId}`, {
        method: 'PUT',
        token: alice.token,
        data: {
          themeMode: 'custom',
          themePrimaryColor: '#123456',
          themeSurfaceColor: '#234567',
          themeSecondaryColor: '#ffffff',
          themeAccentColor: '#abcdef',
          keyboardBindings,
          hintsEnabled: true,
        },
      })
    );
    assert.equal(saved.hintsEnabled, true);
    assert.deepEqual(saved.keyboardBindings, keyboardBindings);
    const partial = success(
      await request(`/api/user-settings/${settings.documentId}`, {
        method: 'PUT',
        token: alice.token,
        data: { language: 'en-US' },
      })
    );
    assert.equal(partial.themeMode, 'custom');
    assert.equal(partial.themeSurfaceColor, '#234567');
    assert.equal(partial.themeAccentColor, '#abcdef');
    assert.equal(partial.hintsEnabled, true);
    assert.deepEqual(partial.keyboardBindings, keyboardBindings);
    assert.equal(
      (
        await request(`/api/user-settings/${settings.documentId}`, {
          method: 'PUT',
          token: alice.token,
          data: { keyboardBindings: { ...keyboardBindings, front: 'a' } },
        })
      ).status,
      400
    );
    assert.equal(
      (await request(`/api/user-settings/${settings.documentId}`, { token: bob.token })).status,
      404
    );
  });

  it('copies immutable attempt snapshots from the preset and checks the replay', async () => {
    const data = {
      preset: preset.documentId,
      durationMs: 1000,
      completedAt: new Date().toISOString(),
      engineVersion: 'cubejs-1.3.2',
      initialState,
      scramble: ['R'],
      moves: [{ move: "R'", atMs: 700 }],
    };
    attempt = success(
      await request('/api/solve-attempts', { method: 'POST', token: alice.token, data }),
      201
    );
    assert.notEqual(attempt.appearanceSnapshot.id, preset.appearance.id);
    assert.equal(attempt.appearanceSnapshot.frontColor, '#ff0000');
    success(
      await request(`/api/cube-presets/${preset.documentId}`, {
        method: 'PUT',
        token: alice.token,
        data: { appearance: { frontColor: '#112233' } },
      })
    );
    const saved = success(
      await request(`/api/solve-attempts/${attempt.documentId}`, { token: alice.token })
    );
    assert.equal(saved.appearanceSnapshot.frontColor, '#ff0000');
    assert.ok(
      [404, 405].includes(
        (
          await request(`/api/solve-attempts/${attempt.documentId}`, {
            method: 'PUT',
            token: alice.token,
            data: { durationMs: 2 },
          })
        ).status
      )
    );
    await assert.rejects(() =>
      app.documents('api::solve-attempt.solve-attempt').update({
        documentId: attempt.documentId,
        data: { durationMs: 2 },
      })
    );
    for (const invalid of [
      { ...data, moves: [] },
      { ...data, durationMs: -1 },
      { ...data, moves: [{ move: "R'", atMs: 1001 }] },
    ]) {
      assert.equal(
        (
          await request('/api/solve-attempts', {
            method: 'POST',
            token: alice.token,
            data: invalid,
          })
        ).status,
        400
      );
    }
  });

  it('validates saved games, monotonic progress and user isolation', async () => {
    game = success(
      await request('/api/saved-games', {
        method: 'POST',
        token: alice.token,
        data: {
          name: 'Partida',
          preset: preset.documentId,
          engineVersion: 'cubejs-1.3.2',
          initialState,
          cubeState: initialState,
          scramble: ['R'],
          moves: [],
          elapsedMs: 0,
          savedAt: new Date().toISOString(),
        },
      }),
      201
    );
    assert.equal(
      (await request(`/api/saved-games/${game.documentId}`, { token: bob.token })).status,
      404
    );
    const completed = success(
      await request(`/api/saved-games/${game.documentId}`, {
        method: 'PUT',
        token: alice.token,
        data: {
          cubeState: solvedState,
          moves: [{ move: "R'", atMs: 400 }],
          elapsedMs: 500,
          savedAt: new Date().toISOString(),
        },
      })
    );
    assert.equal(completed.cubeState.facelets, solvedState.facelets);
    const resumed = success(
      await request(`/api/saved-games/${game.documentId}`, {
        method: 'PUT',
        token: alice.token,
        data: { name: 'Partida retomada', elapsedMs: 600, savedAt: new Date().toISOString() },
      })
    );
    // MySQL may reorder JSON object keys; unchanged move histories must still be accepted.
    assert.equal(resumed.moves.length, 1);
    assert.equal(resumed.name, 'Partida retomada');

    const gameRoute = `/api/saved-games/${game.documentId}`;
    const renamed = success(
      await request(gameRoute, {
        method: 'PUT',
        token: alice.token,
        data: { name: '  Partida de treino  ' },
      })
    );
    assert.equal(renamed.name, 'Partida de treino');
    assert.equal(renamed.savedAt, resumed.savedAt);
    assert.equal(renamed.elapsedMs, resumed.elapsedMs);
    assert.deepEqual(renamed.moves, resumed.moves);
    assert.deepEqual(renamed.appearanceSnapshot, resumed.appearanceSnapshot);

    const progress = success(
      await request(gameRoute, { method: 'PUT', token: alice.token, data: { elapsedMs: 700 } })
    );
    assert.equal(progress.name, renamed.name);
    assert.equal(
      (await request(gameRoute, { method: 'PUT', token: bob.token, data: { name: 'Inválido' } }))
        .status,
      404
    );

    assert.equal(
      (
        await request(`/api/saved-games/${game.documentId}`, {
          method: 'PUT',
          token: alice.token,
          data: { elapsedMs: 0, moves: [], cubeState: initialState },
        })
      ).status,
      400
    );
  });

  it('preserves an automatic solve in saved games and rejects it as a manual attempt', async () => {
    const moves = [{ move: 'AUTO_SOLVE', atMs: 100 }];
    const common = {
      engineVersion: 'cubejs-1.3.2',
      initialState,
      scramble: ['R'],
      moves,
      appearanceSnapshot: {},
    };

    const saved = success(
      await request('/api/saved-games', {
        method: 'POST',
        token: alice.token,
        data: {
          ...common,
          name: 'Prática',
          cubeState: solvedState,
          elapsedMs: 100,
          savedAt: new Date().toISOString(),
        },
      }),
      201
    );
    const route = `/api/saved-games/${saved.documentId}`;
    assert.deepEqual(success(await request(route, { token: alice.token })).moves, moves);

    const rewritten = await request(route, {
      method: 'PUT',
      token: alice.token,
      data: { moves: [{ move: "R'", atMs: 100 }] },
    });
    assert.equal(rewritten.status, 400);

    const attempt = await request('/api/solve-attempts', {
      method: 'POST',
      token: alice.token,
      data: { ...common, durationMs: 100, completedAt: new Date().toISOString() },
    });
    assert.equal(attempt.status, 400);
  });

  it('detaches deleted presets without losing historical snapshots', async () => {
    success(
      await request(`/api/cube-presets/${preset.documentId}`, {
        method: 'DELETE',
        token: alice.token,
      })
    );
    const savedSettings = success(
      await request(`/api/user-settings/${settings.documentId}`, { token: alice.token })
    );
    const savedAttempt = success(
      await request(`/api/solve-attempts/${attempt.documentId}`, { token: alice.token })
    );
    assert.equal(savedSettings.activePreset, null);
    assert.equal(savedAttempt.preset, null);
    assert.equal(savedAttempt.appearanceSnapshot.frontColor, '#ff0000');
  });

  it('exposes only published tutorial content, even when drafts are requested', async () => {
    const tutorial = await app.documents('api::tutorial.tutorial').create({
      locale: 'pt-BR',
      data: {
        title: 'Teste de publicação',
        slug: `test-${Date.now()}`,
        description: 'Descrição',
        kind: 'step',
        stepNumber: 1,
      },
    });
    const hidden = success(await request('/api/tutorials?locale=pt-BR&status=draft'));
    assert.ok(!hidden.some(entry => entry.documentId === tutorial.documentId));
    await app
      .documents('api::tutorial.tutorial')
      .publish({ documentId: tutorial.documentId, locale: 'pt-BR' });
    const published = success(await request(`/api/tutorials/${tutorial.documentId}?locale=pt-BR`));
    assert.equal(published.title, 'Teste de publicação');
    await assert.rejects(() =>
      app.documents('api::tutorial.tutorial').create({
        locale: 'pt-BR',
        data: { title: 'Inválido', slug: 'invalid', description: 'Descrição', kind: 'step' },
      })
    );
  });

  it('imports existing tutorials, native media and translations idempotently', async () => {
    const { seedTutorials } = require('../dist/src/lib/seed-tutorials.js');
    const first = await seedTutorials(app, path.resolve(__dirname, '../..'));
    const second = await seedTutorials(app, path.resolve(__dirname, '../..'));
    assert.ok(first.created >= 0);
    assert.equal(second.created, 0);
    const portuguese = success(
      await request('/api/tutorials?locale=pt-BR&filters[slug][$eq]=step-1-pt-br')
    )[0];
    const english = success(
      await request('/api/tutorials?locale=en-US&filters[slug][$eq]=step-1-en-us')
    )[0];
    assert.equal(portuguese.documentId, english.documentId);
    assert.ok(portuguese.parts[0].image.url.startsWith('/uploads/'));
    assert.equal(portuguese.videos.length, 2);
  });

  it('updates only unchanged legacy control descriptions and preserves CMS edits', async () => {
    const { seedTutorials } = require('../dist/src/lib/seed-tutorials.js');
    const documents = app.documents('api::tutorial.tutorial');
    const overview = await documents.findFirst({
      locale: 'pt-BR',
      filters: { slug: 'overview-pt-br' },
    });
    const legacy =
      'Use W, A, S, D, Q e E para mover as faces do cubo. Segure Shift para os movimentos inversos. Use as setas para girar a visualização do cubo.';
    await documents.update({
      documentId: overview.documentId,
      locale: 'pt-BR',
      status: 'published',
      data: { description: legacy },
    });
    const migrated = await seedTutorials(app, path.resolve(__dirname, '../..'));
    assert.equal(migrated.updated, 1);
    const published = await documents.findOne({
      documentId: overview.documentId,
      locale: 'pt-BR',
      status: 'published',
    });
    assert.ok(published.description.includes('comandos atuais'));
    await documents.update({
      documentId: overview.documentId,
      locale: 'pt-BR',
      status: 'published',
      data: { description: 'Conteúdo editado no CMS' },
    });
    assert.equal((await seedTutorials(app, path.resolve(__dirname, '../..'))).updated, 0);
    await documents.update({
      documentId: overview.documentId,
      locale: 'pt-BR',
      status: 'published',
      data: { description: published.description },
    });
  });
});
