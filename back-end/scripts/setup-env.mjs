import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const target = fileURLToPath(new URL('../.env', import.meta.url));
const alreadyExists = existsSync(target);
let content = readFileSync(
  alreadyExists ? target : new URL('../.env.example', import.meta.url),
  'utf8'
);
const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
const generated = [];

if (!alreadyExists) {
  content = content.replace(
    'DATABASE_PASSWORD=change-me',
    `DATABASE_PASSWORD=${randomBytes(24).toString('hex')}`
  );
}

for (const name of [
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
]) {
  const assignment = new RegExp(
    `^([\\t ]*(?:export[\\t ]+)?${name}[\\t ]*=[\\t ]*)([^\\r\\n]*)`,
    'm'
  );
  const match = content.match(assignment);
  // Existing secrets are stable: only absent or empty assignments may be filled.
  const emptyValue = /^(?:''|""|)[\t ]*(#.*)?$/;
  if (match && !emptyValue.test(match[2].trim())) continue;

  const value =
    name === 'APP_KEYS'
      ? Array.from({ length: 4 }, () => randomBytes(32).toString('base64')).join(',')
      : randomBytes(32).toString('base64');
  if (match) {
    const comment = match[2].trim().match(emptyValue)?.[1];
    content = content.replace(
      assignment,
      () => `${match[1]}${value}${comment ? ` ${comment}` : ''}`
    );
  } else {
    if (content && !content.endsWith('\n')) content += lineEnding;
    content += `${name}=${value}${lineEnding}`;
  }
  generated.push(name);
}

if (!alreadyExists || generated.length) {
  writeFileSync(target, content, { flag: alreadyExists ? 'w' : 'wx' });
  console.log(
    `.env ${alreadyExists ? 'atualizado' : 'criado'}; chaves geradas: ${generated.join(', ')}.`
  );
  console.log('Credenciais e chaves já preenchidas foram preservadas. Reinicie o Strapi.');
} else {
  console.log('.env já possui todas as chaves; nenhuma configuração foi alterada.');
}
