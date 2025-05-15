import { trpc } from '../../../../trpc';

export const getIdeasTrpcRoute = trpc.procedure.query(async ({ ctx: appContext }) => {
  const ideas = await appContext.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { ideas };
});
