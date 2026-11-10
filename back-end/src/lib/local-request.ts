import type { Context } from 'koa';

const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const loopbackAddresses = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

export function isLocalDevelopmentRequest(ctx: Context) {
  if (
    !['development', 'test'].includes(process.env.NODE_ENV ?? '') ||
    !loopbackAddresses.has(ctx.req.socket.remoteAddress ?? '') ||
    !loopbackHosts.has(ctx.hostname) ||
    ctx.get('forwarded') ||
    ctx.get('x-forwarded-for') ||
    ctx.get('x-forwarded-host')
  ) {
    return false;
  }

  const origin = ctx.get('origin');
  if (!origin) return true;

  try {
    return loopbackHosts.has(new URL(origin).hostname);
  } catch {
    return false;
  }
}
