import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
import { z } from 'zod';

const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const loopbackAddresses = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

const resetSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z
      .string()
      .min(6)
      .refine(value => Buffer.byteLength(value, 'utf8') <= 72),
    passwordConfirmation: z.string(),
  })
  .refine(input => input.password === input.passwordConfirmation);

function isLocalRequest(ctx: Context) {
  if (
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

export default ({ strapi }: { strapi: Core.Strapi }) => {
  function isAvailable(ctx: Context) {
    return (
      ['development', 'test'].includes(process.env.NODE_ENV ?? '') &&
      strapi.config.get('server.localPasswordReset') === true &&
      isLocalRequest(ctx)
    );
  }

  return {
    status(ctx: Context) {
      if (!isAvailable(ctx)) return ctx.notFound();

      ctx.set('Cache-Control', 'no-store');
      ctx.body = { enabled: true };
    },

    async reset(ctx: Context) {
      if (!isAvailable(ctx)) return ctx.notFound();
      if (!ctx.is('application/json')) return ctx.badRequest('Envie um corpo JSON.');

      const result = resetSchema.safeParse(ctx.request.body);
      if (!result.success) {
        return ctx.badRequest('Informe um e-mail e duas senhas iguais de pelo menos 6 caracteres.');
      }

      const { email, password } = result.data;
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email, provider: 'local', blocked: false },
        select: ['id'],
      });
      if (!user) return ctx.badRequest('Não foi possível redefinir a senha desta conta.');

      const users = strapi.plugin('users-permissions').service('user');
      const updated = await users.edit(user.id, { password, resetPasswordToken: null });
      if (!updated) return ctx.badRequest('Não foi possível redefinir a senha desta conta.');

      ctx.status = 204;
    },
  };
};
