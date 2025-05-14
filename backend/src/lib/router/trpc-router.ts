import { trpc } from '../trpc';
import { addIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './routes/idea-routes';
import { signInTrpcRoute, signUpTrpcRoute } from './routes/user-routes';
import { getMeTrpcRoute } from './routes/user-routes/get-me-trpc-route';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
