import { zValidationScheme } from '../../../../../schemas/z-validation-schema';
import { ExpectedError } from '../../../../error';
import { trpcLoggedProcedure } from '../../../../trpc';

export const addIdeaTrpcRoute = trpcLoggedProcedure
  .input(zValidationScheme)
  .mutation(async ({ ctx: appContext, input }) => {
    if (!appContext.me) {
      throw Error('UNAUTHORIZED');
    }

    const hasIdea = await appContext.prisma.idea.findUnique({ where: { nick: input.nick } });
    if (hasIdea) {
      throw new ExpectedError('Idea with the same nick has already existed.');
    }

    const idea = await appContext.prisma.idea.create({
      data: { ...input, authorId: appContext.me.id },
    });

    return { idea };
  });
