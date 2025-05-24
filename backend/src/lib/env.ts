import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const zNonEmptyTrimmed = z.string().trim().min(1);
const zNonEmptyTrimmedRequiredOnNotLocal = zNonEmptyTrimmed.optional().refine(
  // eslint-disable-next-line node/no-process-env
  (val) => process.env.HOST_ENV === 'local' || !!val,
  'Required on local host',
);

const zEnv = z.object({
  PORT: zNonEmptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonEmptyTrimmed,
  JWT_SECRET_KEY: zNonEmptyTrimmed,
  PASSWORD_SALT: zNonEmptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zNonEmptyTrimmed,
  CLIENT_URL: zNonEmptyTrimmed,
  BREVO_API_KEY: zNonEmptyTrimmedRequiredOnNotLocal,
  FROM_EMAIL_NAME: zNonEmptyTrimmed,
  FROM_EMAIL_ADDRESS: zNonEmptyTrimmed,
});

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env);
