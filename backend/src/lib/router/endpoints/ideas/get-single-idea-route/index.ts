import _ from 'lodash';
import { z } from 'zod';
import { trpc } from '../../../../trpc';

export const getSingleIdeaTrpcRoute = trpc.procedure
  .input(
    z.object({
      nick: z.string(),
    }),
  )
  .query(async ({ ctx: appContext, input }) => {
    const rawIdea = await appContext.prisma.idea.findUnique({
      where: { nick: input.nick },
      include: {
        author: {
          select: {
            id: true,
            nick: true,
            name: true,
          },
        },
        likes: {
          select: {
            id: true,
          },
          where: {
            userId: appContext.me?.id,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (rawIdea?.blockedAt) {
      throw new Error('Idea is blocked by administrator');
    }

    const isLikedByMe = !!rawIdea?.likes.length;
    const likesCount = rawIdea?._count.likes || 0;
    const idea = rawIdea && { ..._.omit(rawIdea, ['likes', '_count']), isLikedByMe, likesCount };

    return { idea };
  });
