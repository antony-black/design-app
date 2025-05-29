import _ from 'lodash';
import { z } from 'zod';
import { trpcLoggedProcedure } from '../../../../trpc';
import { ExpectedError } from '../../../../error';

export const getSingleIdeaTrpcRoute = trpcLoggedProcedure
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
      throw new ExpectedError('Idea is blocked by administrator');
    }

    const isLikedByMe = !!rawIdea?.likes.length;
    const likesCount = rawIdea?._count.likes || 0;
    const idea = rawIdea && { ..._.omit(rawIdea, ['likes', '_count']), isLikedByMe, likesCount };

    return { idea };
  });
