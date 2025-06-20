/* eslint-disable node/no-process-env */
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const findEnvFilePath = (dir: string, pathPart: string): string | null => {
  const maybeEnvFilePath = path.join(dir, pathPart);
  if (fs.existsSync(maybeEnvFilePath)) {
    return maybeEnvFilePath;
  }
  if (dir === '/') {
    return null;
  }
  return findEnvFilePath(path.dirname(dir), pathPart);
};
const clientEnvFilePath = findEnvFilePath(__dirname, 'client/.env');
if (clientEnvFilePath) {
  dotenv.config({ path: clientEnvFilePath, override: true });
  dotenv.config({ path: `${clientEnvFilePath}.${process.env.NODE_ENV}`, override: true });
}

const backendEnvFilePath = findEnvFilePath(__dirname, 'backend/.env');
if (backendEnvFilePath) {
  dotenv.config({ path: backendEnvFilePath, override: true });
  dotenv.config({ path: `${backendEnvFilePath}.${process.env.NODE_ENV}`, override: true });
}

const zNonEmptyTrimmed = z.string().trim().min(1);
const zNonEmptyTrimmedRequiredOnNotLocal = zNonEmptyTrimmed.optional().refine(
  // eslint-disable-next-line node/no-process-env
  (val) => process.env.HOST_ENV === 'local' || !!val,
  'Required on local host',
);

const zEnv = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']),
  PORT: zNonEmptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonEmptyTrimmed.refine((val) => {
    if (process.env.NODE_ENV !== 'test') {
      return true;
    }
    const [databaseUrl] = val.split('?');
    const [databaseName] = databaseUrl.split('/').reverse();
    return databaseName.endsWith('-test');
  }, `Data base name should ends with "-test" on test environment`),
  JWT_SECRET_KEY: zNonEmptyTrimmed,
  PASSWORD_SALT: zNonEmptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zNonEmptyTrimmed,
  CLIENT_URL: zNonEmptyTrimmed,
  BREVO_API_KEY: zNonEmptyTrimmedRequiredOnNotLocal,
  FROM_EMAIL_NAME: zNonEmptyTrimmed,
  FROM_EMAIL_ADDRESS: zNonEmptyTrimmed,
  DEBUG: z
    .string()
    .optional()
    .refine(
      (val) => process.env.HOST_ENV === 'local' || process.env.NODE_ENV !== 'production' || (!!val && val.length > 0),
      'Required on not local host on production',
    ),
  BACKEND_SENTRY_DSN: zNonEmptyTrimmedRequiredOnNotLocal,
  SOURCE_VERSION: zNonEmptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_KEY: zNonEmptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zNonEmptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zNonEmptyTrimmed,
  S3_ACCESS_KEY_ID: zNonEmptyTrimmedRequiredOnNotLocal,
  S3_SECRET_ACCESS_KEY: zNonEmptyTrimmedRequiredOnNotLocal,
  S3_BUCKET_NAME: zNonEmptyTrimmedRequiredOnNotLocal,
  S3_REGION: zNonEmptyTrimmedRequiredOnNotLocal,
  // S3_URL: zNonEmptyTrimmed,
});

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env);
