import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { type Express } from 'express';
import { type TtrpcRouter } from '../lib/router/trpc-router';
import { type AppContext } from './app-context';

export const trpc = initTRPC.context<AppContext>().create();

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TtrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: () => appContext,
    }),
  );
};
