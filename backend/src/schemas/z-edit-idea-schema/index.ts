import z from 'zod';
import { zValidationScheme } from '../z-validation-schema';

export const zEditIdeaTrpcSchema = zValidationScheme.extend({
  ideaId: z.string().min(1),
});
