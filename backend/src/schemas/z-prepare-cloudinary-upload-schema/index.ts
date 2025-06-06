import { getKeysAsArray } from '@design-app/shared/src/types/cloudinary-types/get-keys-as-array';
import { cloudinaryUploadTypes } from '@design-app/shared/src/types/cloudinary-types/index';
import { z } from 'zod';

export const zPrepareCloudinaryUploadTrpcSchema = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
});
