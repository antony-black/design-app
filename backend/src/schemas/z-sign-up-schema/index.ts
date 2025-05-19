import { z } from 'zod';

export const zSignUpScheme = z.object({
  nick: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9-]+$/, 'Nick may contain only letters, numbers and dashes'),
  email: z.string().min(1).email(),
  password: z.string().min(1, 'Password is required'),
});
