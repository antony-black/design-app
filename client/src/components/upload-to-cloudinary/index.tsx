import {
  type TCloudinaryUploadPresetName,
  type TCloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@design-app/shared/src/types/cloudinary-types';
import cn from 'classnames';
import { type FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { trpc } from '../../lib/trpc';
import { CustomButton, CustomButtons } from '../custom-button';
import styles from './index.module.scss';

const useUploadToCloudinary = (type: TCloudinaryUploadTypeName) => {
  const prepareCloudinaryUpload = trpc.prepareCloudinaryUpload.useMutation();

  const uploadToCloudinary = async (file: File) => {
    const { preparedData } = await prepareCloudinaryUpload.mutateAsync({ type });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', preparedData.timestamp);
    formData.append('folder', preparedData.folder);
    formData.append('transformation', preparedData.transformation);
    formData.append('eager', preparedData.eager);
    formData.append('signature', preparedData.signature);
    formData.append('api_key', preparedData.apiKey);

    return await fetch(preparedData.url, {
      method: 'POST',
      body: formData,
    })
      .then(async (rawRes) => {
        return await rawRes.json();
      })
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message);
        }
        return {
          publicId: res.public_id as string,
          res,
        };
      });
  };

  return { uploadToCloudinary };
};

export const UploadToCloudinary = <TTypeName extends TCloudinaryUploadTypeName>({
  label,
  name,
  formik,
  type,
  preset,
}: {
  label: string;
  name: string;
  formik: FormikProps<any>;
  type: TTypeName;
  preset: TCloudinaryUploadPresetName<TTypeName>;
}) => {
  const value = formik.values[name];
  const error = formik.errors[name] as string | undefined;
  const touched = formik.touched[name] as boolean;
  const invalid = touched && !!error;
  const disabled = formik.isSubmitting;

  const inputEl = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const { uploadToCloudinary } = useUploadToCloudinary(type);

  return (
    <div className={cn({ [styles.field]: true, [styles.disabled]: disabled })}>
      <input
        className={styles.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="image/*"
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true);
            try {
              if (files?.length) {
                const file = files[0];
                const { publicId } = await uploadToCloudinary(file);
                void formik.setFieldValue(name, publicId);
              }
            } catch (err: any) {
              console.error(err);
              formik.setFieldError(name, err.message);
            } finally {
              void formik.setFieldTouched(name, true, false);
              setLoading(false);
              if (inputEl.current) {
                inputEl.current.value = '';
              }
            }
          })();
        }}
      />
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      {!!value && !loading && (
        <div className={styles.previewPlace}>
          <img className={styles.preview} alt="" src={getCloudinaryUploadUrl(value, type, preset)} />
        </div>
      )}
      <div className={styles.buttons}>
        <CustomButtons>
          <CustomButton
            type="button"
            onClick={() => inputEl.current?.click()}
            isLoading={loading}
            disabled={loading || disabled}
            color="green"
          >
            {value ? 'Upload another' : 'Upload'}
          </CustomButton>
          {!!value && !loading && (
            <CustomButton
              type="button"
              color="red"
              onClick={() => {
                void formik.setFieldValue(name, null);
                formik.setFieldError(name, undefined);
                void formik.setFieldTouched(name);
              }}
              disabled={disabled}
            >
              Remove
            </CustomButton>
          )}
        </CustomButtons>
      </div>
      {invalid && <div className={styles.error}>{error}</div>}
    </div>
  );
};
