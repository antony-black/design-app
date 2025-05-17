import { z } from 'zod';

export const zSetLikeTrpcSchema = z.object({
  ideaId: z.string().min(1),
  isLikedByMe: z.boolean(),
});
