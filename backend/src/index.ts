import cors from 'cors';
import express from 'express';
import { type AppContext, createAppContext } from './lib/app-context';
import { applyCron } from './lib/cron';
import { env } from './lib/env';
import { logger } from './lib/logger';
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

    //send emails automaticaly by schedule
    applyCron(appContext);

    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('express', error);
      if (res.headersSent) {
        next(error);
        return;
      }
      res.status(500).send('Internal server error');
    });

    expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`);
    });

    // void sendWelcomeEmail({ user: { nick: 'test', email: `${Math.random().toString()}@example.com}` } });
    // void sendWelcomeEmail({ user: { nick: 'test', email: 'designapp79@gmail.com' } });
    throw new Error('UNEXPECTED ERROR 10');
    // throw new ExpectedError('EXPECTED ERROR 1');
  } catch (error) {
    logger.error('app', error);
    await appContext?.stop();
  }
})();
