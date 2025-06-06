import {
  CustomButton,
  CustomInput,
  FormItems,
  Notification,
  Segment,
  UploadOneImageToCloudinary,
  useForm,
} from '@/components';
import { withPageWrapper } from '@/lib/page-wrapper';
import { trpc } from '@/lib/trpc';
import type { TtrpcRouterOutput } from '@design-app/backend/src/lib/router/trpc-router';
import { zEditPasswordTrpcSchema } from '@design-app/backend/src/schemas/z-edit-password-schema';
import { zEditProfileTrpcSchema } from '@design-app/backend/src/schemas/z-edit-user-profile-schema';
import { z } from 'zod';

const General = ({ me }: { me: NonNullable<TtrpcRouterOutput['getMe']['me']> }) => {
  const trpcUtils = trpc.useContext();
  const updateProfile = trpc.editUserProfile.useMutation();
  const { formik, notificationProps, buttonProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
      avatar: me.avatar,
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
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <CustomInput label="Nick" name="nick" formik={formik} />
        <CustomInput label="Name" name="name" formik={formik} />
        <UploadOneImageToCloudinary label="Avatar" name="avatar" type="avatar" preset="big" formik={formik} />
        <Notification {...notificationProps} />
        <CustomButton {...buttonProps}>Update Profile</CustomButton>
      </FormItems>
    </form>
  );
};

const Password = () => {
  const updatePassword = trpc.editPassword.useMutation();
  const { formik, notificationProps, buttonProps } = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zEditPasswordTrpcSchema
      .extend({
        newPasswordAgain: z.string().min(1),
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.newPasswordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords must be the same',
            path: ['newPasswordAgain'],
          });
        }
      }),
    onSubmit: async ({ newPassword, currentPassword }) => {
      await updatePassword.mutateAsync({ newPassword, currentPassword });
    },
    successMessage: 'Password updated',
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <CustomInput label="Old password" name="currentPassword" type="password" formik={formik} />
        <CustomInput label="New password" name="newPassword" type="password" formik={formik} />
        <CustomInput label="New password again" name="newPasswordAgain" type="password" formik={formik} />
        <Notification {...notificationProps} />
        <CustomButton {...buttonProps}>Update Password</CustomButton>
      </FormItems>
    </form>
  );
};

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
  title: 'Edit Profile',
})(({ me }) => {
  return (
    <>
      <Segment title="General" size={2}>
        <General me={me} />
      </Segment>
      <Segment title="Password" size={2}>
        <Password />
      </Segment>
    </>
  );
});
