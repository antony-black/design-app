import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { trpc } from '../trpc';
import { addIdeaTrpcRoute, editIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './endpoints/ideas';
import { getMeTrpcRoute, signInTrpcRoute, signUpTrpcRoute } from './endpoints/users';

export const trpcRouter = trpc.router({
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
  editIdea: editIdeaTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
export type TtrpcRouterInput = inferRouterInputs<TtrpcRouter>;
export type TtrpcRouterOutput = inferRouterOutputs<TtrpcRouter>;
