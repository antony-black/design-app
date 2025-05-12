import type { FormikProps } from 'formik';

export type TIdea = {
  name: string;
  nick: string;
  description: string;
  text: string;
};

export type TCustomInput = {
  name: keyof TIdea;
  label: string;
  formik: FormikProps<TIdea>;
};
