import { CustomButton, CustomInput, FormItems, Notification, Segment, useForm } from '@/components';
import { withPageWrapper } from '@/lib/page-wrapper';
import { trpc } from '@/lib/trpc';
import { zEditProfileTrpcSchema } from '@design-app/backend/src/schemas/z-edit-user-profile-schema';

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    me: getAuthorizedMe(),
  }),
})(({ me }) => {
  const trpcUtils = trpc.useContext();
  const updateProfile = trpc.editUserProfile.useMutation();
  const { formik, notificationProps, buttonProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
    },
    validationSchema: zEditProfileTrpcSchema,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values);
      trpcUtils.getMe.setData(undefined, { me: updatedMe });
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  });

  return (
    <Segment title="Edit Profile">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <CustomInput label="Nick" name="nick" formik={formik} />
          <CustomInput label="Name" name="name" formik={formik} />
          <Notification {...notificationProps} />
          <CustomButton {...buttonProps}>Update Profile</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
});
