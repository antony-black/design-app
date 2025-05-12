import { zValidationScheme } from '../../../../schemas/z-validation-schema';
import { ideas } from '../../../mock-data';
import { trpc } from '../../../trpc';

export const addIdeaTrpcRoute = trpc.procedure.input(zValidationScheme).mutation(({ input }) => {
  const isNickExisted = ideas.find((idea) => idea.nick === input.nick);
  if (isNickExisted) {
    throw Error('Idea with the same nick has already existed.');
  }

  ideas.unshift(input);

  return true;
});
