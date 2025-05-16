import { z } from 'zod';

export const zEditProfileTrpcSchema = z.object({
  nick: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9-]+$/, 'Nick may contain only letters, numbers and dashes'),
  name: z.string().max(50).default(''),
});
