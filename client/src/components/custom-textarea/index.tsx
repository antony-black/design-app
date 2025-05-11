import type { TCustomInput } from '@/types/input-types';

export const CustomTextArea: React.FC<TCustomInput> = ({ name, label, value, setValue }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />
      <textarea
        onChange={(e) => {
          setValue({ ...value, [name]: e.target.value });
        }}
        value={value[name]}
        name={name}
        id={name}
      />
    </div>
  );
};
