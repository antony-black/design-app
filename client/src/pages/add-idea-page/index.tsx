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
        console.error('error:', error);
      }
    },
  });
  console.log('formik:', formik);

  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showSuccess]);
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
