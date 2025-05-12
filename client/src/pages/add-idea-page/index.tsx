import { useFormik } from 'formik';
import { CustomInput } from '@/components/custom-input';
import { CustomTextArea } from '@/components/custom-textarea';
import { Segment } from '@/components/segment';
import { trpc } from '@/lib/trpc';
import type { TIdea } from '@/types/input-types';
import { validate } from '@/utils/validate-util';

const AddIdeaPage: React.FC = () => {
  const addIdea = trpc.addIdea.useMutation();

  const formik = useFormik<TIdea>({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate,
    onSubmit: async (values) => {
      await addIdea.mutateAsync(values);
    },
  });
  console.log('formik:', formik);
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
        <CustomInput name="name" label="Name" formik={formik} />
        <CustomInput name="nick" label="Nick" formik={formik} />
        <CustomInput name="description" label="Description" formik={formik} />
        <CustomTextArea name="text" label="Text" formik={formik} />
        {!isValid && !!isSubmitting && <div style={{ color: 'red' }}>Some fields are invalid</div>}
        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Idea'}
        </button>
      </form>
    </Segment>
  );
};

export default AddIdeaPage;
