import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { trpc } from '../trpc';
import { addIdeaTrpcRoute, editIdeaTrpcRoute, getIdeasTrpcRoute, getSingleIdeaTrpcRoute } from './endpoints/ideas';
import { blockIdeaTrpcRoute } from './endpoints/ideas/block-idea-trpc-route';
import { setLikeTrpcRoute } from './endpoints/ideas/set-like-tprc-route';
import { editPasswordTrpcRoute, getMeTrpcRoute, signInTrpcRoute, signUpTrpcRoute } from './endpoints/users';
import { editProfileTrpcRoute } from './endpoints/users/edit-user-profile-trpc-route';

export const trpcRouter = trpc.router({
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  getMe: getMeTrpcRoute,
  editUserProfile: editProfileTrpcRoute,
  editPassword: editPasswordTrpcRoute,
  getAllIdeas: getIdeasTrpcRoute,
  getSingleIdea: getSingleIdeaTrpcRoute,
  addIdea: addIdeaTrpcRoute,
  editIdea: editIdeaTrpcRoute,
  setLike: setLikeTrpcRoute,
  blockIdea: blockIdeaTrpcRoute,
});

export type TtrpcRouter = typeof trpcRouter;
export type TtrpcRouterInput = inferRouterInputs<TtrpcRouter>;
export type TtrpcRouterOutput = inferRouterOutputs<TtrpcRouter>;
