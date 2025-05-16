import { z } from 'zod';
import { trpc } from '../../../../trpc';

export const getSingleIdeaTrpcRoute = trpc.procedure
  .input(
    z.object({
      nick: z.string(),
    }),
  )
  .query(async ({ ctx: appContext, input }) => {
    const idea = await appContext.prisma.idea.findUnique({
      where: { nick: input.nick },
      include: {
        author: {
          select: {
            id: true,
            nick: true,
            name: true,
          },
        },
      },
    });

    return { idea };
  });
