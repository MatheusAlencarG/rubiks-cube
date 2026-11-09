import { open } from 'node:fs/promises';
import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import type { Context } from 'koa';
import { z } from 'zod';

const userUid = 'plugin::users-permissions.user';
const maxAvatarBytes = 5 * 1024 * 1024;
const profileInput = z.strictObject({ username: z.string().trim().min(3).max(80).optional() });

async function detectImage(filepath: string) {
  const file = await open(filepath, 'r');
  const header = Buffer.alloc(12);

  try {
    await file.read(header, 0, header.length, 0);
  } finally {
    await file.close();
  }

  if (header.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return 'png';
  if (header.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'))) return 'jpeg';
  if (header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP') {
    return 'webp';
  }
}

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const users = () => strapi.db.query(userUid);

  async function readProfile(id: number) {
    const user = await users().findOne({
      where: { id },
      select: ['id', 'username', 'email', 'firstName', 'lastName'],
      populate: { avatar: { select: ['url'] } },
    });
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar ? { url: user.avatar.url } : null,
    };
  }

  async function usernameTaken(username: string, id: number) {
    return users().findOne({
      where: {
        id: { $ne: id },
        $or: [{ username: { $eqi: username } }, { email: { $eqi: username } }],
      },
      select: ['id'],
    });
  }

  return {
    async profile(ctx: Context) {
      const id = ctx.state.user?.id;
      if (!id) return ctx.unauthorized();

      const profile = await readProfile(id);
      if (!profile) return ctx.unauthorized();

      ctx.body = profile;
    },

    async updateProfile(ctx: Context) {
      const id = ctx.state.user?.id;
      if (!id) return ctx.unauthorized();

      const input = profileInput.safeParse(ctx.request.body ?? {});
      if (!input.success) return ctx.badRequest('Informe um nome de usuário de 3 a 80 caracteres.');

      const { username } = input.data;
      if (username && (await usernameTaken(username, id))) {
        return ctx.conflict('Esse nome de usuário já está em uso.');
      }

      const files = ctx.request.files ?? {};
      const avatars = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];
      if (avatars.length > 1 || Object.keys(files).some(key => key !== 'files')) {
        return ctx.badRequest('Envie apenas uma foto de perfil.');
      }

      const [file] = avatars;
      const upload = strapi.plugin('upload').service('upload');
      let uploaded: Awaited<ReturnType<typeof upload.upload>>[number] | undefined;

      if (file) {
        if (!file.size || file.size > maxAvatarBytes) {
          return ctx.badRequest('A foto deve ter até 5 MB.');
        }

        const format = await detectImage(file.filepath);
        const images = strapi.plugin('upload').service('image-manipulation');
        if (!format || !(await images.isImage(file))) {
          return ctx.badRequest('Envie uma imagem PNG, JPEG ou WebP válida.');
        }

        [uploaded] = await upload.upload({
          data: { fileInfo: { name: `avatar-${id}.${format}` } },
          files: {
            filepath: file.filepath,
            size: file.size,
            mimetype: `image/${format}`,
            originalFilename: `avatar.${format}`,
          },
        });
      }

      if (username || uploaded) {
        try {
          const service = strapi.plugin('users-permissions').service('user');
          const updated = await service.edit(id, {
            ...(username ? { username } : {}),
            ...(uploaded ? { avatar: uploaded.id } : {}),
          });
          if (!updated) throw new errors.UnauthorizedError();
        } catch (error) {
          if (uploaded) {
            await upload
              .remove(uploaded)
              .catch(() => strapi.log.warn('Could not remove failed profile upload.'));
          }
          if (username && (await usernameTaken(username, id))) {
            return ctx.conflict('Esse nome de usuário já está em uso.');
          }
          throw error;
        }
      }

      const profile = await readProfile(id);
      if (!profile) return ctx.unauthorized();

      ctx.body = profile;
    },
  };
};
