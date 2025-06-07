import { z } from 'zod';

export const zBlockIdeaTrpcSchema = z.object({
  ideaId: z.string().min(1),
});
