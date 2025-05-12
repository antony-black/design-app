import type { TIdea } from '@/types/input-types';

export const validate = (values: TIdea) => {
  const errors: Partial<typeof values> = {};
  if (!values.name) {
    errors.name = 'Name is required';
  }
  if (!values.nick) {
    errors.nick = 'Nick is required';
  } else if (!values.nick.match(/^[a-z0-9-]+$/)) {
    errors.nick = 'Nick may contain only lowercase letters, numbers and dashes';
  }
  if (!values.description) {
    errors.description = 'Description is required';
  }
  if (!values.text) {
    errors.text = 'Text is required';
  } else if (values.text.length < 3) {
    errors.text = 'Text should be at least 100 characters long';
  }
  return errors;
};
