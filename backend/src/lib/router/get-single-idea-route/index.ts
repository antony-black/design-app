import { z } from 'zod';
import { trpc } from '../../../lib/trpc';
import { ideas } from '../../mock-data';

export const getSingleIdeaTrpcRoute = trpc.procedure
  .input(
    z.object({
      nick: z.string(),
    }),
  )
  .query(({ input }) => {
    const idea = ideas.find((idea) => idea.nick === input.nick);

    return { idea: idea || null };
  });
