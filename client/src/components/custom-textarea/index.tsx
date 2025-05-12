import type { TCustomInput } from '@/types/input-types';

export const CustomTextArea: React.FC<TCustomInput> = ({ name, label, formik }) => {
  const value = formik.values[name];
  const error = formik.errors[name];

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <textarea
        onChange={(e) => {
          void formik.setFieldValue(name, e.target.value);
        }}
        value={value}
        name={name}
        id={name}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};
