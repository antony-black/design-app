import type { TCustomInput } from '@/types/input-types';
import cn from 'classnames';
import styles from './index.module.scss';

export const CustomTextArea = <T,>({ name, label, formik, disabled }: TCustomInput<T>) => {
  const { values, errors, touched, setFieldValue, setFieldTouched, isSubmitting } = formik;
  const value = values[name] as string;
  const error = errors[name] as string;
  const invalid = !!touched[name] && !!error;

  return (
    <div className={cn({ [styles.field]: true, [styles.disabled]: isSubmitting })}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <br />
      <textarea
        className={cn({
          [styles.input]: true,
          [styles.invalid]: invalid,
        })}
        onChange={(e) => {
          void setFieldValue(name, e.target.value);
        }}
        onBlur={() => {
          void setFieldTouched(name);
        }}
        value={value}
        name={name}
        id={name}
        disabled={disabled}
      />
      {invalid && <div className={styles.error}>{error}</div>}
    </div>
  );
};
