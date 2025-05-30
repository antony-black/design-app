import { RewriteFrames as RewriteFramesImport } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as path from 'path';
import { env } from './env';
import type { TLoggerMetaData } from './logger';

if (env.BACKEND_SENTRY_DSN) {
  Sentry.init({
    dsn: env.BACKEND_SENTRY_DSN,
    environment: env.HOST_ENV,
    release: env.SOURCE_VERSION,
    normalizeDepth: 10,
    integrations: [
      new (RewriteFramesImport as any)({
        root: path.resolve(__dirname, '../../..'),
      }),
    ],
  });
}

export const sentryCaptureException = (error: Error, prettifiedMetaData?: TLoggerMetaData) => {
  if (env.BACKEND_SENTRY_DSN) {
    console.log('Set to Sentry');
    Sentry.captureException(error, prettifiedMetaData);
  }
};
