import { z } from 'zod';

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  VITE_SERVER_TRPC_URL: z.string().trim().min(1),
  VITE_CLIENT_URL: z.string().trim().min(1),
});

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env);
