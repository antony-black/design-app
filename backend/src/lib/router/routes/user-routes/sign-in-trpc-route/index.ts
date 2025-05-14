import { zSignUpScheme } from '../../../../../schemas/z-sign-up-schema';
import { getPasswordHash } from '../../../../../utils/get-password-hash';
import { trpc } from '../../../../trpc';

export const signInTrpcRoute = trpc.procedure.input(zSignUpScheme).mutation(async ({ ctx: appContext, input }) => {
  const hasUser = await appContext.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });

  if (!hasUser) {
    throw Error('Wrong nick or password');
  }

  return true;
});
