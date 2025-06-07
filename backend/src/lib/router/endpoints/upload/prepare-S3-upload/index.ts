import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from 'process';
import { zPrepareS3UploadTrpcSchema } from '../../../../../schemas/z-prepare-S3-upload-schema';
import { getRandomString } from '../../../../../utils/get-random-string';
import { ExpectedError } from '../../../../error';
import { getS3Client } from '../../../../s3';
import { trpcLoggedProcedure } from '../../../../trpc';

const maxFileSize = 10 * 1024 * 1024; // 10MB

export const prepareS3UploadTrpcRoute = trpcLoggedProcedure
  .input(zPrepareS3UploadTrpcSchema)
  .mutation(async ({ input }) => {
    if (input.fileSize > maxFileSize) {
      throw new ExpectedError('File size should be less then 10MB');
    }

    const s3Client = getS3Client();
    const s3Key = `uploads/${getRandomString(32)}-${input.fileName}`;
    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: s3Key,
        ContentType: input.fileType,
        ContentLength: input.fileSize,
      }),
      {
        expiresIn: 3600,
      },
    );

    return {
      s3Key,
      signedUrl,
    };
  });
