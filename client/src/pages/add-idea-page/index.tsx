import { useFormik } from 'formik';
import { CustomInput } from '@/components/custom-input';
import { CustomTextArea } from '@/components/custom-textarea';
import { Segment } from '@/components/segment';
import type { TIdea } from '@/types/input-types';
import { validate } from '@/utils/validate-util';

const AddIdeaPage: React.FC = () => {
  const formik = useFormik<TIdea>({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate,
    onSubmit: (values) => {
      console.info('Submitted', values);
    },
  });
  console.log('formik:', formik);
  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <CustomInput name="name" label="Name" formik={formik} />
        <CustomInput name="nick" label="Nick" formik={formik} />
        <CustomInput name="description" label="Description" formik={formik} />
        <CustomTextArea name="text" label="Text" formik={formik} />
        {!formik.isValid && <div style={{ color: 'red' }}>Some fields are invalid</div>}
        <button type="submit">Create Idea</button>
      </form>
    </Segment>
  );
};

export default AddIdeaPage;
