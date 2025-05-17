import { zBlockIdeaTrpcSchema } from '../../../../../schemas/z-blocked-idea-chema';
import { canBlockIdeas } from '../../../../../utils/handle-permissions-idea';
import { trpc } from '../../../../trpc';

export const blockIdeaTrpcRoute = trpc.procedure.input(zBlockIdeaTrpcSchema).mutation(async ({ ctx, input }) => {
  const { ideaId } = input;
  if (!canBlockIdeas(ctx.me)) {
    throw new Error('PERMISSION_DENIED');
  }
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  });
  if (!idea) {
    throw new Error('NOT_FOUND');
  }
  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      blockedAt: new Date(),
    },
  });
  return true;
});
