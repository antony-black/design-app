import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { CustomButton, CustomInput, CustomTextArea, FormItems, Notification, Segment } from '@/components';
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
        <FormItems>
          <CustomInput name="name" label="Name" formik={formik} disabled={isSubmitting} />
          <CustomInput name="nick" label="Nick" formik={formik} disabled={isSubmitting} />
          {error && <Notification color={'red'}>{error}</Notification>}

          <CustomInput name="description" label="Description" formik={formik} disabled={isSubmitting} maxWidth={500} />
          <CustomTextArea name="text" label="Text" formik={formik} disabled={isSubmitting} />

          {showSuccess && <Notification color={'green'}>The idea is successfully added!</Notification>}
          <CustomButton isLoading={isSubmitting}>Create Idea</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
};

export default AddIdeaPage;
