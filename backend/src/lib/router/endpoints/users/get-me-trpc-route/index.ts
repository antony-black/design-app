import { toClientMe } from '../../../../models';
import { trpc } from '../../../../trpc';

export const getMeTrpcRoute = trpc.procedure.query(({ ctx: appContext }) => {
  return { me: toClientMe(appContext.me) };
});
