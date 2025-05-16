import { CustomButton, CustomInput, CustomTextArea, FormItems, Notification, Segment, useForm } from '@/components';
import { withPageWrapper } from '@/lib/page-wrapper';
import { trpc } from '@/lib/trpc';
import { zValidationScheme } from '@design-app/backend/src/schemas/z-validation-schema';

export const AddIdeaPage: React.FC = withPageWrapper({
  authorizedOnly: true,
})(() => {
  const addIdea = trpc.addIdea.useMutation();
  const { formik, buttonProps, notificationProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validationSchema: zValidationScheme,
    onSubmit: async (values) => {
      await addIdea.mutateAsync(values);
      formik.resetForm();
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
        <FormItems>
          <CustomInput name="name" label="Name" formik={formik} disabled={isSubmitting} />
          <CustomInput name="nick" label="Nick" formik={formik} disabled={isSubmitting} />
          <CustomInput name="description" label="Description" formik={formik} disabled={isSubmitting} maxWidth={500} />
          <CustomTextArea name="text" label="Text" formik={formik} disabled={isSubmitting} />
          <Notification {...notificationProps} />
          <CustomButton {...buttonProps}>Create Idea</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
});
