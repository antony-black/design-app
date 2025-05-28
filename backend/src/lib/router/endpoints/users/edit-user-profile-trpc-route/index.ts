import { zEditProfileTrpcSchema } from '../../../../../schemas/z-edit-user-profile-schema';
import { toClientMe } from '../../../../models';
import { trpcLoggedProcedure } from '../../../../trpc';

export const editProfileTrpcRoute = trpcLoggedProcedure
  .input(zEditProfileTrpcSchema)
  .mutation(async ({ ctx: appContext, input }) => {
    if (!appContext.me) {
      throw new Error('UNAUTHORIZED');
    }
    if (appContext.me.nick !== input.nick) {
      const exUser = await appContext.prisma.user.findUnique({
        where: {
          nick: input.nick,
        },
      });
      if (exUser) {
        throw new Error('User with this nick already exists');
      }
    }
    const updatedMe = await appContext.prisma.user.update({
      where: {
        id: appContext.me.id,
      },
      data: input,
    });
    appContext.me = updatedMe;
    return toClientMe(updatedMe);
  });
