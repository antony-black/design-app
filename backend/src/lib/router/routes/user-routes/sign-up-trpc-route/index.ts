import crypto from 'crypto';
import { zSignUpScheme } from '../../../../../schemas/z-sign-up-schema';
import { trpc } from '../../../../trpc';

export const signUpTrpcRoute = trpc.procedure.input(zSignUpScheme).mutation(async ({ ctx: appContext, input }) => {
  const hasUser = await appContext.prisma.user.findUnique({ where: { nick: input.nick } });
  if (hasUser) {
    throw Error('This user has already existed.');
  }

  const user = await appContext.prisma.user.create({
    data: {
      nick: input.nick,
      password: crypto.createHash('sha256').update(input.password).digest('hex'),
    },
  });

  return { user };
});
