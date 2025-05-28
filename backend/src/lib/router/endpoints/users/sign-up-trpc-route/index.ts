import { zSignUpScheme } from '../../../../../schemas/z-sign-up-schema';
import { getPasswordHash } from '../../../../../utils/get-password-hash';
import { signJWT } from '../../../../../utils/sign-jwt';
import { sendWelcomeEmail } from '../../../../emails-service';
import { trpcLoggedProcedure } from '../../../../trpc';

export const signUpTrpcRoute = trpcLoggedProcedure.input(zSignUpScheme).mutation(async ({ ctx: appContext, input }) => {
  const hasUserWithNick = await appContext.prisma.user.findUnique({ where: { nick: input.nick } });
  if (hasUserWithNick) {
    throw Error('This user has already existed.');
  }

  const hasUserWithEmail = await appContext.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });
  if (hasUserWithEmail) {
    throw new Error('User with this email already exists');
  }

  const user = await appContext.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: getPasswordHash(input.password),
    },
  });

  void sendWelcomeEmail({ user });
  const token = signJWT(user.id);

  return { token };
});
