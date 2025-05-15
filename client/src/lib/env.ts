import { z } from 'zod';

export const zEnv = z.object({
  VITE_SERVER_TRPC_URL: z.string().trim().min(1),
});

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(import.meta.env);
