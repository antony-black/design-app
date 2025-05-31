import { type inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { type Express } from 'express';
import { type TtrpcRouter } from '../lib/router/trpc-router';
import { type ExpressRequest } from '../types';
import { type AppContext } from './app-context';
import { ExpectedError } from './error';
import { logger } from './logger';

export const getTrpcContext = ({ appContext, req }: { appContext: AppContext; req: ExpressRequest }) => ({
  ...appContext,
  me: req.user || null,
});

const createTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) =>
    getTrpcContext({ appContext, req: req as ExpressRequest });

type TtrpcContext = inferAsyncReturnType<ReturnType<typeof createTrpcContext>>;

export const trpc = initTRPC.context<TtrpcContext>().create({
  errorFormatter: ({ shape, error }) => {
    const isExpected = error.cause instanceof ExpectedError;
    return {
      ...shape,
      data: {
        ...shape.data,
        isExpected,
      },
    };
  },
});

export const createTrpcRouter = trpc.router;

export const trpcLoggedProcedure = trpc.procedure.use(
  trpc.middleware(async ({ path, type, next, ctx, rawInput }) => {
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;
    const meta = {
      path,
      type,
      userId: ctx.me?.id || null,
      durationMs,
      rawInput: rawInput || null,
    };
    if (result.ok) {
      logger.info(`trpc:${type}:success`, 'Successfull request', { ...meta, output: result.data });
    } else {
      logger.error(`trpc:${type}:error`, result.error, meta);
    }
    return result;
  }),
);

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TtrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: createTrpcContext(appContext),
    }),
  );
};
