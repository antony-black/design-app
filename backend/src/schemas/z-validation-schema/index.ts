import { z } from 'zod';

export const zValidationScheme = z.object({
  name: z.string().min(1, 'Name is required'),
  nick: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Nick may contain only lowercase letters, numbers and dashes'),
  description: z.string().min(1, 'Description is required'),
  text: z.string().min(3, 'Text should be at least 100 characters long'),
  images: z.array(z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it')).optional(),
  certificate: z.string().nullable().optional(),
  documents: z.array(z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it')).optional(),
});
