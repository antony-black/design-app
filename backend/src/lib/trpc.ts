import { initTRPC } from '@trpc/server';
// import * as trpcExpress from '@trpc/server/adapters/express';
// import { type Express } from 'express';
// import { TtrpcRouter } from '../lib/router/index';

export const trpc = initTRPC.create();

// export const applyTrpcToExpressApp = (expressApp: Express, trpcRouter: TtrpcRouter) => {
//   expressApp.use(
//     '/trpc',
//     trpcExpress.createExpressMiddleware({
//       router: trpcRouter,
//     }),
//   );
// };
