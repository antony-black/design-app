import { zSignInScheme } from '../../../../../schemas/z-sign-in-schema';
import { getPasswordHash } from '../../../../../utils/get-password-hash';
import { signJWT } from '../../../../../utils/sign-jwt';
import { ExpectedError } from '../../../../error';
import { trpcLoggedProcedure } from '../../../../trpc';

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInScheme).mutation(async ({ ctx: appContext, input }) => {
  const user = await appContext.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });

  if (!user) {
    throw new ExpectedError('Wrong nick or password');
  }

  const token = signJWT(user.id);

  return { token };
});
