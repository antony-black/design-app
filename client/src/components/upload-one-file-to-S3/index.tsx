import { getS3UploadName, getS3UploadUrl } from '@design-app/shared/src/s3';
import cn from 'classnames';
import { type FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { trpc } from '../../lib/trpc';
import { CustomButton, CustomButtons } from '../custom-button';
import styles from './index.module.scss';

export const useUploadToS3 = () => {
  const prepareS3Upload = trpc.prepareS3Upload.useMutation();

  const uploadToS3 = async (file: File) => {
    const { signedUrl, s3Key } = await prepareS3Upload.mutateAsync({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    return await fetch(signedUrl, {
      method: 'PUT',
      body: file,
    })
      .then(async (rawRes) => {
        return await rawRes.text();
      })
      .then((res) => {
        return { s3Key, res };
      });
  };

  return { uploadToS3 };
};

export const UploadOneFileToS3 = ({
  label,
  name,
  formik,
}: {
  label: string;
  name: string;
  formik: FormikProps<any>;
}) => {
  const value = formik.values[name];
  const error = formik.errors[name] as string | undefined;
  const touched = formik.touched[name] as boolean;
  const invalid = touched && !!error;
  const disabled = formik.isSubmitting;

  const inputEl = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const { uploadToS3 } = useUploadToS3();

  return (
    <div className={cn({ [styles.field]: true, [styles.disabled]: disabled })}>
      <input
        className={styles.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="*"
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true);
            try {
              if (files?.length) {
                const file = files[0];
                const { s3Key } = await uploadToS3(file);
                void formik.setFieldValue(name, s3Key);
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
        <div className={styles.uploads}>
          <div className={styles.upload}>
            <a className={styles.uploadLink} target="_blank" href={getS3UploadUrl(value)} rel="noreferrer">
              {getS3UploadName(value)}
            </a>
          </div>
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
