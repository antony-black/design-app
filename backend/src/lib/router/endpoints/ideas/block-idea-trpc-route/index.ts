import { zBlockIdeaTrpcSchema } from '../../../../../schemas/z-blocked-idea-schema';
import { canBlockIdeas } from '../../../../../utils/handle-permissions-idea';
import { sendIdeaBlockedEmail } from '../../../../emails/emails-services';
import { ExpectedError } from '../../../../error';
import { trpcLoggedProcedure } from '../../../../trpc';

export const blockIdeaTrpcRoute = trpcLoggedProcedure.input(zBlockIdeaTrpcSchema).mutation(async ({ ctx, input }) => {
  const { ideaId } = input;
  if (!canBlockIdeas(ctx.me)) {
    throw new Error('PERMISSION_DENIED');
  }
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
    include: {
      author: true,
    },
  });
  if (!idea) {
    throw new ExpectedError('NOT_FOUND');
  }
  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      blockedAt: new Date(),
    },
  });

  void sendIdeaBlockedEmail({ user: idea.author, idea });

  return true;
});
