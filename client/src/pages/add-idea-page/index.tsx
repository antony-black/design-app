import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { CustomInput } from '@/components/custom-input';
import { CustomTextArea } from '@/components/custom-textarea';
import { Segment } from '@/components/segment';
import { trpc } from '@/lib/trpc';
import type { TIdea } from '@/types/input-types';
import { validate } from '@/utils/validate-util';

const AddIdeaPage: React.FC = () => {
  const addIdea = trpc.addIdea.useMutation();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const formik = useFormik<TIdea>({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addIdea.mutateAsync(values);
        resetForm();
        setShowSuccess(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
  });
  console.log('formik:', formik);
  // TODO: add to utils
  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }

    if (error.length > 0) {
      const timeout = setTimeout(() => {
        setError('');
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showSuccess, error]);
  const { handleSubmit, isValid, isSubmitting } = formik;
  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) {
            handleSubmit();
          }
        }}
      >
        <CustomInput name="name" label="Name" formik={formik} disabled={isSubmitting} />
        <CustomInput name="nick" label="Nick" formik={formik} disabled={isSubmitting} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <CustomInput name="description" label="Description" formik={formik} disabled={isSubmitting} />
        <CustomTextArea name="text" label="Text" formik={formik} disabled={isSubmitting} />
        {!isValid && !!isSubmitting && <div style={{ color: 'red' }}>Some fields are invalid</div>}
        {showSuccess && <div style={{ color: 'lightgreen' }}>The idea is successfully added!</div>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Idea'}
        </button>
      </form>
    </Segment>
  );
};

export default AddIdeaPage;
