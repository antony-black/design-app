// eslint-disable-next-line node/no-process-env
const cloudinaryCloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryUrl = `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload`;

type TCloudinaryUploadType = {
  folder: string;
  transformation: string;
  format: string;
  presets: Record<string, string>;
};

export const cloudinaryUploadTypes = {
  avatar: {
    folder: 'avatars',
    transformation: 'w_400,h_400,c_fill',
    format: 'png',
    presets: {
      small: 'w_200,h_200,c_fill',
      big: 'w_400,h_400,c_fill',
    },
  },
  image: {
    folder: 'images',
    transformation: 'w_1000,h_1000,c_limit',
    format: 'jpg',
    presets: {
      preview: 'w_200,h_200,c_fit,q_80',
      large: 'w_1000,h_1000,c_limit,q_80',
    },
  },
} satisfies Record<string, TCloudinaryUploadType>;

type TCloudinaryUploadTypes = typeof cloudinaryUploadTypes;
export type TCloudinaryUploadTypeName = keyof TCloudinaryUploadTypes;
export type TCloudinaryUploadPresetName<TTypeName extends TCloudinaryUploadTypeName> =
  keyof TCloudinaryUploadTypes[TTypeName]['presets'];

export const getCloudinaryUploadUrl = <TTypeName extends TCloudinaryUploadTypeName>(
  publicId: string,
  typeName: TTypeName,
  presetName: TCloudinaryUploadPresetName<TTypeName>,
) => {
  const type = cloudinaryUploadTypes[typeName] as TCloudinaryUploadType;
  const preset = type.presets[presetName as string];

  return `${cloudinaryUrl}/${preset}/${publicId}`;
};

export const getAvatarUrl = (
  publicId: string | null | undefined,
  preset: keyof TCloudinaryUploadTypes['avatar']['presets'],
) =>
  publicId
    ? getCloudinaryUploadUrl(publicId, 'avatar', preset)
    : getCloudinaryUploadUrl('v1749205680/avatars/avatar-placeholder.png', 'avatar', preset);
