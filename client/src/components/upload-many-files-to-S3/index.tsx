import { getS3UploadName, getS3UploadUrl } from '@design-app/shared/src/s3';
import cn from 'classnames';
import { type FormikProps } from 'formik';
import { useRef, useState } from 'react';
import { CustomButton } from '../custom-button';
import { Icon } from '../icon';
import { useUploadToS3 } from '../upload-one-file-to-S3';
import styles from './index.module.scss';

export const UploadsManyFilesToS3 = ({
  label,
  name,
  formik,
}: {
  label: string;
  name: string;
  formik: FormikProps<any>;
}) => {
  const value = formik.values[name] as string[];
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
                    await uploadToS3(file).then(({ s3Key }) => {
                      newValue.push(s3Key);
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
        <div className={styles.uploads}>
          {value.map((s3Key) => (
            <div key={s3Key} className={styles.upload}>
              <a className={styles.uploadLink} target="_blank" href={getS3UploadUrl(s3Key)} rel="noreferrer">
                {getS3UploadName(s3Key)}
              </a>
              <button
                type="button"
                className={styles.delete}
                onClick={() => {
                  void formik.setFieldValue(
                    name,
                    value.filter((deletedS3Key) => deletedS3Key !== s3Key),
                  );
                }}
              >
                <Icon className={styles.deleteIcon} name="delete" />
              </button>
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
          {value ? 'Upload more' : 'Upload'}
        </CustomButton>
      </div>
      {invalid && <div className={styles.error}>{error}</div>}
    </div>
  );
};
