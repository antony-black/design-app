import _ from 'lodash';
import { trpc } from '../../../../trpc';

export const getMeTrpcRoute = trpc.procedure.query(({ ctx: appContext }) => {
  return { me: appContext.me && _.pick(appContext.me, ['id', 'nick']) };
});
