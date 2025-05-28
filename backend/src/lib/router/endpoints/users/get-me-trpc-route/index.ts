import { toClientMe } from '../../../../models';
import { trpcLoggedProcedure } from '../../../../trpc';

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx: appContext }) => {
  return { me: toClientMe(appContext.me) };
});
