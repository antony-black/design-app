import { zSignInScheme } from '../../../../../schemas/z-sign-in-schema';
import { getPasswordHash } from '../../../../../utils/get-password-hash';
import { signJWT } from '../../../../../utils/sign-jwt';
import { trpc } from '../../../../trpc';

export const signInTrpcRoute = trpc.procedure.input(zSignInScheme).mutation(async ({ ctx: appContext, input }) => {
  const user = await appContext.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });

  if (!user) {
    throw Error('Wrong nick or password');
  }

  const token = signJWT(user.id);

  return { token };
});
