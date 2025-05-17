import type { FormikProps } from 'formik';

export type TIdea = {
  name: string;
  nick: string;
  description: string;
  text: string;
};

export type TCustomInput<T> = {
  name: Extract<keyof T, string>;
  label: string;
  formik: FormikProps<T>;
  disabled?: boolean;
  maxWidth?: number | string;
  type?: 'text' | 'password';
};
