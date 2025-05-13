import cors from 'cors';
import express from 'express';
import { type AppContext, createAppContext } from './lib/app-context';
import { trpcRouter } from './lib/router/trpc-router';
import { applyTrpcToExpressApp } from './lib/trpc';

void (async () => {
  let appContext: AppContext | null = null;
  try {
    appContext = createAppContext();

    const expressApp = express();
    expressApp.use(cors());
    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    applyTrpcToExpressApp(expressApp, appContext, trpcRouter);

    expressApp.listen(3000, () => {
      console.info('Listening at http://localhost:3000');
    });
  } catch (error) {
    console.error(error);
    await appContext?.stop();
  }
})();
