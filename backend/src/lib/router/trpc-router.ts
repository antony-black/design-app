import { trpc } from '../trpc';
import { addIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './routes/idea-routes';
import { signInTrpcRoute, signUpTrpcRoute } from './routes/user-routes';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
