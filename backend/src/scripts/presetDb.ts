import { AppContext } from '../lib/app-context';
import { env } from '../lib/env';
import { getPasswordHash } from '../utils/get-password-hash';

export const presetDb = async (ctx: AppContext) => {
  await ctx.prisma.user.upsert({
    where: {
      nick: 'admin',
    },
    create: {
      nick: 'admin',
      email: 'admin@example.com',
      password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
      permissions: ['ALL'],
    },
    update: {
      permissions: ['ALL'],
    },
  });
};
