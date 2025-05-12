import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { trpcRouter } from './lib/router';
// import { applyTrpcToExpressApp } from './lib/trpc';

const expressApp = express();
expressApp.use(cors());
expressApp.get('/ping', (req, res) => {
  res.send('pong');
});

// applyTrpcToExpressApp(expressApp, trpcRouter);

expressApp.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext: () => ({}),
  }),
);

expressApp.listen(3000, () => {
  console.info('Listening  at http://localhost:3000');
});
