import { zEditPasswordTrpcSchema } from '../../../../../schemas/z-edit-password-schema';
import { getPasswordHash } from '../../../../../utils/get-password-hash';
import { trpcLoggedProcedure } from '../../../../trpc';

export const editPasswordTrpcRoute = trpcLoggedProcedure
  .input(zEditPasswordTrpcSchema)
  .mutation(async ({ ctx: appContext, input }) => {
    if (!appContext.me) {
      throw new Error('UNAUTHORIZED');
    }

    if (appContext.me.password !== getPasswordHash(input.currentPassword)) {
      throw new Error('Wrong current password.');
    }

    const editedPassword = await appContext.prisma.user.update({
      where: { id: appContext.me.id },
      data: {
        password: getPasswordHash(input.newPassword),
      },
    });

    appContext.me = editedPassword;

    return true;
  });
