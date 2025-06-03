import _ from 'lodash';
import { zGetIdeasTrpcSchema } from '../../../../../schemas/z-get-ideas-schema';
import { trpcLoggedProcedure } from '../../../../trpc';
import { TOmit } from '@design-app/shared/src/types/TOmit';

export const getIdeasTrpcRoute = trpcLoggedProcedure
  .input(zGetIdeasTrpcSchema)
  .query(async ({ ctx: appContext, input }) => {
    const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, ' & ') : undefined;

    const rawIdeas = await appContext.prisma.idea.findMany({
      select: {
        id: true,
        nick: true,
        name: true,
        description: true,
        serialNumber: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
      where: {
        blockedAt: null,
        ...(normalizedSearch
          ? {
              OR: [
                {
                  name: {
                    search: normalizedSearch,
                  },
                },
                {
                  description: {
                    search: normalizedSearch,
                  },
                },
                {
                  text: {
                    search: normalizedSearch,
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { serialNumber: 'desc' }],
      cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
      take: (input.limit ?? 20) + 1, // add a fallback if limit isn't guaranteed
    });

    const nextIdea = rawIdeas.at(input.limit);
    const nextCursor = nextIdea?.serialNumber;

    const rawIdeasExceptNext = rawIdeas.slice(0, input.limit);
    const ideasExceptNext = rawIdeasExceptNext.map((idea) => ({
      ...TOmit(idea, ['_count']),
      likesCount: idea._count.likes,
    }));

    return { ideas: ideasExceptNext, nextCursor };
  });
