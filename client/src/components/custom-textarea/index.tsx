import cn from 'classnames';
import styles from './index.module.scss';
import type { TCustomInput } from '@/types/input-types';

export const CustomTextArea: React.FC<TCustomInput> = ({ name, label, formik, disabled }) => {
  const { values, errors, touched, setFieldValue, setFieldTouched, isSubmitting } = formik;
  const value = values[name];
  const error = errors[name];
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
