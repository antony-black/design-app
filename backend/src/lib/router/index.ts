import { trpc } from '../../lib/trpc';
import { getIdeasTrpcRoute } from './get-ideas-trpc-route';
import { getSingleIdeaTrpcRoute } from './get-single-idea-route';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
