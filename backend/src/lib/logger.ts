import { env } from './env';
import { TOmit } from '@design-app/shared/src/types/TOmit';
import { TRPCError } from '@trpc/server';
import debug from 'debug';
import _ from 'lodash';
import { EOL } from 'os';
import pc from 'picocolors';
import { serializeError } from 'serialize-error';
import { MESSAGE } from 'triple-beam';
import winston from 'winston';
import * as yaml from 'yaml';
import { deepMap } from '../utils/deep-map';
import { ExpectedError } from './error';
import { sentryCaptureException } from './sentry';

export const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV !== 'local'
          ? winston.format.json()
          : winston.format((logData: any) => {
              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[logData.level as 'info' | 'error' | 'debug'];
              const levelAndType = `${logData.level} ${logData.logType}`;
              const topMessage = `${setColor(levelAndType)} ${pc.green(logData.timestamp)}${EOL}${logData.message}`;

              const visibleMessageTags = TOmit(logData, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'hostEnv',
              ]);

              const stringifyedLogData = _.trim(
                yaml.stringify(visibleMessageTags, (_k, v) => (_.isFunction(v) ? 'Function' : v)),
              );

              const resultLogData = {
                ...logData,
                [MESSAGE]:
                  [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifyedLogData}` : '']
                    .filter(Boolean)
                    .join('') + EOL,
              };

              return resultLogData;
            })(),
    }),
  ],
});

export type TLoggerMetaData = Record<string, any> | undefined;

const prettifyMeta = (meta: TLoggerMetaData): TLoggerMetaData => {
  return deepMap(meta, ({ key, value }) => {
    if (
      [
        'email',
        'password',
        'newPassword',
        'oldPassword',
        'token',
        'text',
        'description',
        'apiKey',
        'signature',
        'signedUrl',
      ].includes(key)
    ) {
      return '🙈';
    }

    return value;
  });
};

export const logger = {
  info: (logType: string, message: string, meta?: TLoggerMetaData) => {
    if (!debug.enabled(`design-app:${logType}`)) {
      return;
    }
    winstonLogger.info(message, { logType, ...prettifyMeta(meta) });
  },
  error: (logType: string, error: any, meta?: TLoggerMetaData) => {
    const isNativeExpectedError = error instanceof ExpectedError;
    const isTrpcExpectedError = error instanceof TRPCError && error.cause instanceof ExpectedError;
    const prettifiedMetaData = prettifyMeta(meta);
    if (!isNativeExpectedError && !isTrpcExpectedError) {
      sentryCaptureException(error, prettifiedMetaData);
    }
    // if (!debug.enabled(`design-app:${logType}`)) {
    //   return;
    // }
    const serializedError = serializeError(error);
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error,
      errorStack: serializedError.stack,
      prettifiedMetaData,
    });
  },
};
