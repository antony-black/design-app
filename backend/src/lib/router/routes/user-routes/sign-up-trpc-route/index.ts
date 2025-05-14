import { zSignUpScheme } from '../../../../../schemas/z-sign-up-schema';
import { getPasswordHash } from '../../../../../utils/get-password-hash';
import { signJWT } from '../../../../../utils/sign-jwt';
import { trpc } from '../../../../trpc';

export const signUpTrpcRoute = trpc.procedure.input(zSignUpScheme).mutation(async ({ ctx: appContext, input }) => {
  const hasUser = await appContext.prisma.user.findUnique({ where: { nick: input.nick } });
  if (hasUser) {
    throw Error('This user has already existed.');
  }

  const user = await appContext.prisma.user.create({
    data: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  });

  const token = signJWT(user.id);

  return { token };
});
