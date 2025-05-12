import { zValidationScheme } from '../../../../schemas/z-validation-schema';
import { ideas } from '../../../mock-data';
import { trpc } from '../../../trpc';

export const xxx = 123;

export const addIdeaTrpcRoute = trpc.procedure.input(zValidationScheme).mutation(({ input }) => {
  ideas.unshift(input);

  return true;
});
