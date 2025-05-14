import { z } from 'zod';

export const zSignUpScheme = z.object({
  nick: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Nick may contain only lowercase letters, numbers and dashes'),
  password: z.string().min(1, 'Password is required'),
});
