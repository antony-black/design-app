import { trpc } from '../trpc';
import { addIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './routes';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
