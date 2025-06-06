import {
  getCloudinaryUploadUrl,
  type TCloudinaryUploadPresetName,
  type TCloudinaryUploadTypeName,
} from '@design-app/shared/src/types/cloudinary-types';
import cn from 'classnames';
import type { FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { useUploadToCloudinary } from '..';
import { CustomButton } from '../custom-button';
import { Icon } from '../icon';
import styles from './index.module.scss';

export const UploadManyImagesToCloudinary = <TTypeName extends TCloudinaryUploadTypeName>({
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
  const value = formik.values[name] as string[];
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
        multiple
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true);
            try {
              if (files?.length) {
                const newValue = [...value];
                await Promise.all(
                  Array.from(files).map(async (file) => {
                    await uploadToCloudinary(file).then(({ publicId }) => {
                      newValue.push(publicId);
                    });
                  }),
                );
                void formik.setFieldValue(name, newValue);
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
      {!!value?.length && (
        <div className={styles.previews}>
          {value.map((publicId) => (
            <div key={publicId} className={styles.previewPlace}>
              <button
                type="button"
                className={styles.delete}
                onClick={() => {
                  void formik.setFieldValue(
                    name,
                    value.filter((deletedPublicId) => deletedPublicId !== publicId),
                  );
                }}
              >
                <Icon className={styles.deleteIcon} name="delete" />
              </button>
              <img className={styles.preview} alt="" src={getCloudinaryUploadUrl(publicId, type, preset)} />
            </div>
          ))}
        </div>
      )}
      <div className={styles.buttons}>
        <CustomButton
          type="button"
          onClick={() => inputEl.current?.click()}
          isLoading={loading}
          disabled={loading || disabled}
          color="green"
        >
          {value?.length ? 'Upload more' : 'Upload'}
        </CustomButton>
      </div>
      {invalid && <div className={styles.error}>{error}</div>}
    </div>
  );
};
