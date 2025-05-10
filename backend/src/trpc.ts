import { initTRPC } from '@trpc/server';
import _ from 'lodash';
import { z } from 'zod';

const ideas = _.times(100, (i) => ({
  nick: `cool-idea-nick-${i}`,
  name: `Idea ${i}`,
  description: `Description of idea ${i}...`,
  text: _.times(100, (j) => `<p>Text paragrph ${j} of idea ${i}...</p>`).join(''),
}));

const trpc = initTRPC.create();

export const trpcRouter = trpc.router({
  getAllIdeas: trpc.procedure.query(() => {
    return { ideas: ideas.map((idea) => _.pick(idea, ['nick', 'name', 'description'])) };
  }),
  getSingleIdea: trpc.procedure
    .input(
      z.object({
        nick: z.string(),
      }),
    )
    .query(({ input }) => {
      const idea = ideas.find((idea) => idea.nick === input.nick);

      return { idea: idea || null };
    }),
});

export type TtrpcRouter = typeof trpcRouter;
