import { trpc } from '../../../../../lib/trpc';
import { zSetLikeTrpcSchema } from '../../../../../schemas/z-set-like-schema';

export const setLikeTrpcRoute = trpc.procedure
  .input(zSetLikeTrpcSchema)
  .mutation(async ({ ctx: appContext, input }) => {
    const { ideaId, isLikedByMe } = input;

    if (!appContext.me) {
      throw Error('UNAUTHORIZED');
    }

    const idea = await appContext.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      throw new Error('NOT_FOUND');
    }

    if (isLikedByMe) {
      await appContext.prisma.like.upsert({
        where: {
          ideaId_userId: {
            ideaId,
            userId: appContext.me.id,
          },
        },
        create: {
          userId: appContext.me.id,
          ideaId,
        },
        update: {},
      });
    } else {
      await appContext.prisma.like.delete({
        where: {
          ideaId_userId: {
            ideaId,
            userId: appContext.me.id,
          },
        },
      });
    }

    const likesCount = await appContext.prisma.like.count({
      where: {
        ideaId,
      },
    });

    return {
      idea: {
        id: idea.id,
        likesCount,
        isLikedByMe,
      },
    };
  });
