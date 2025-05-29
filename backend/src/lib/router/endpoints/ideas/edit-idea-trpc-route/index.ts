import { zEditIdeaTrpcSchema } from '../../../../../schemas/z-edit-idea-schema';
import { canEditIdea } from '../../../../../utils/handle-permissions-idea';
import { ExpectedError } from '../../../../error';
import { trpcLoggedProcedure } from '../../../../trpc';

export const editIdeaTrpcRoute = trpcLoggedProcedure
  .input(zEditIdeaTrpcSchema)
  .mutation(async ({ ctx: appContext, input }) => {
    const { ideaId, ...ideaInput } = input;

    if (!appContext.me) {
      throw new ExpectedError('UNAUTHORIZED');
    }

    const idea = await appContext.prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      throw new ExpectedError('NOT FOUND.');
    }

    if (!canEditIdea(appContext.me, idea)) {
      throw new ExpectedError('NOT_YOUR_IDEA');
    }

    if (idea.nick !== input.nick) {
      const hasIdea = await appContext.prisma.idea.findUnique({
        where: {
          nick: input.nick,
        },
      });
      if (hasIdea) {
        throw new ExpectedError('Idea with this nick already exists');
      }
    }

    await appContext.prisma.idea.update({
      where: {
        id: ideaId,
      },
      data: {
        ...ideaInput,
      },
    });

    return true;
  });
