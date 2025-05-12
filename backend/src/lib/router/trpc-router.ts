import { trpc } from '../trpc';
import { getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './routes';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
