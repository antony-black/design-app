import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { type Express } from 'express';
import { type TtrpcRouter } from '../lib/router/trpc-router';
import { ExpressRequest } from '../types';
import { type AppContext } from './app-context';

const createTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    ...appContext,
    me: (req as ExpressRequest).user || null,
  });

type TrpcContext = inferAsyncReturnType<ReturnType<typeof createTrpcContext>>;

export const trpc = initTRPC.context<TrpcContext>().create();

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TtrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: createTrpcContext(appContext),
    }),
  );
};
