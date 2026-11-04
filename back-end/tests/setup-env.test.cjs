const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { parse } = require('dotenv');

const secrets = [
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
];

function fixture(t, existing) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'rubiks-env-test-'));
  fs.mkdirSync(path.join(directory, 'scripts'));
  const script = path.join(directory, 'scripts/setup-env.mjs');
  fs.copyFileSync(path.join(__dirname, '../scripts/setup-env.mjs'), script);
  const template = fs.readFileSync(path.join(__dirname, '../.env.example'), 'utf8');
  fs.writeFileSync(path.join(directory, '.env.example'), template);
  const target = path.join(directory, '.env');
  if (existing !== undefined) fs.writeFileSync(target, existing);
  t.after(() => {
    assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('rubiks-env-test-'));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return {
    run() {
      const result = spawnSync(process.execPath, [script], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(fs.readFileSync(path.join(directory, '.env.example'), 'utf8'), template);
      return fs.readFileSync(target, 'utf8');
    },
  };
}

test('setup generates all server secrets once without changing them on subsequent runs', t => {
  const app = fixture(t);
  const first = app.run();
  const values = parse(first);
  for (const key of secrets) assert.ok(values[key]);
  assert.equal(values.APP_KEYS.split(',').length, 4);
  assert.equal(new Set(values.APP_KEYS.split(',')).size, 4);
  assert.notEqual(values.DATABASE_PASSWORD, 'change-me');
  assert.equal(app.run(), first);
});

test('setup repairs an existing env while preserving credentials and existing secrets', t => {
  const app = fixture(
    t,
    'DATABASE_PASSWORD="keep # this password"\r\nAPP_KEYS=keep-existing-key\r\n' +
      'JWT_SECRET=keep-jwt\r\nAPI_TOKEN_SALT=   # generate salt\r\n' +
      'ADMIN_JWT_SECRET=""\r\nTRANSFER_TOKEN_SALT=\'\'\r\nENCRYPTION_KEY='
  );
  const repaired = app.run();
  const values = parse(repaired);
  assert.equal(values.DATABASE_PASSWORD, 'keep # this password');
  assert.equal(values.APP_KEYS, 'keep-existing-key');
  assert.equal(values.JWT_SECRET, 'keep-jwt');
  for (const key of secrets) assert.ok(values[key]);
  assert.ok(repaired.includes('# generate salt'));
  assert.equal(app.run(), repaired);
});

test('setup adds absent keys even when the existing env has no final newline', t => {
  const app = fixture(t, 'DATABASE_USERNAME=existing-user');
  const repaired = app.run();
  const values = parse(repaired);
  assert.equal(values.DATABASE_USERNAME, 'existing-user');
  assert.equal(values.DATABASE_PASSWORD, undefined);
  for (const key of secrets) assert.ok(values[key]);
  assert.equal(values.APP_KEYS.split(',').length, 4);
  assert.equal(app.run(), repaired);
});
