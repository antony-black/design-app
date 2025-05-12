import type { TCustomInput } from '@/types/input-types';

export const CustomTextArea: React.FC<TCustomInput> = ({ name, label, formik }) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } = formik;
  const value = values[name];
  const error = errors[name];
  const isTouched = touched[name];

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <textarea
        onChange={(e) => {
          void setFieldValue(name, e.target.value);
        }}
        onBlur={() => {
          void setFieldTouched(name);
        }}
        value={value}
        name={name}
        id={name}
      />
      {!!isTouched && !!error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
