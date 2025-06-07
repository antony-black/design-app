import { z } from 'zod';

export const zPrepareS3UploadTrpcSchema = z.object({
  fileName: z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it'),
  fileType: z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it'),
  fileSize: z.number().int().positive(),
});
