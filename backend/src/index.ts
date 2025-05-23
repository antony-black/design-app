import cors from 'cors';
import express from 'express';
import { type AppContext, createAppContext } from './lib/app-context';
import { env } from './lib/env';
import { applyPassportToExpressApp } from './lib/passport';
import { trpcRouter } from './lib/router/trpc-router';
import { applyTrpcToExpressApp } from './lib/trpc';
import { presetDb } from './scripts/presetDb';

void (async () => {
  let appContext: AppContext | null = null;
  try {
    appContext = createAppContext();
    await presetDb(appContext);
    const expressApp = express();
    expressApp.use(cors());
    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    applyPassportToExpressApp(expressApp, appContext);
    applyTrpcToExpressApp(expressApp, appContext, trpcRouter);

    expressApp.listen(env.PORT, () => {
      console.info(`Listening at http://localhost:${env.PORT}`);
    });

    // void sendWelcomeEmail({ user: { nick: 'test', email: `${Math.random().toString()}@example.com}` } });
  } catch (error) {
    console.error(error);
    await appContext?.stop();
  }
})();
