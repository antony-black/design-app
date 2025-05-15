import { trpc } from '../trpc';
import { addIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './endpoints/ideas';
import { signInTrpcRoute, signUpTrpcRoute, getMeTrpcRoute } from './endpoints/users';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
