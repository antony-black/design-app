import z from 'zod';

export const zEditPasswordTrpcSchema = z.object({
  currentPassword: z.string().min(1).max(25),
  newPassword: z.string().min(1).max(25),
});
