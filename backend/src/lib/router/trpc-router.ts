import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { trpc } from '../trpc';
import { addIdeaTrpcRoute, editIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './endpoints/ideas';
import { getMeTrpcRoute, signInTrpcRoute, signUpTrpcRoute } from './endpoints/users';
import { editProfileTrpcRoute } from './endpoints/users/edit-user-profile-trpc-route';

export const trpcRouter = trpc.router({
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
  editUserProfile: editProfileTrpcRoute,
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
  editIdea: editIdeaTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
export type TtrpcRouterInput = inferRouterInputs<TtrpcRouter>;
export type TtrpcRouterOutput = inferRouterOutputs<TtrpcRouter>;
