import { CustomButton, CustomInput, FormItems, Notification, Segment } from '@/components';
import { useForm } from '@/components/custom-form';
import { mixpanelIdentify, mixpanelTrackSignIn } from '@/lib/mixpanel';
import { withPageWrapper } from '@/lib/page-wrapper';
import { trpc } from '@/lib/trpc';
import { zSignInScheme } from '@design-app/backend/src/schemas/z-sign-in-schema';
import Cookies from 'js-cookie';

export const SignInPage: React.FC = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign In',
})(() => {
  const trpcUtils = trpc.useContext();
  const singIn = trpc.signIn.useMutation();
  const { formik, buttonProps, notificationProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInScheme,
    onSubmit: async (values) => {
      const { token, userId } = await singIn.mutateAsync(values);
      mixpanelIdentify(userId);
      mixpanelTrackSignIn();
      Cookies.set('token', token, { expires: 99999 });
      void trpcUtils.invalidate();
    },
    resetOnSuccess: false,
  });

  const { handleSubmit } = formik;

  return (
    <Segment title="Sign In">
      <form onSubmit={handleSubmit}>
        <FormItems>
          <CustomInput label="Nick" name="nick" formik={formik} />
          <CustomInput label="Password" name="password" type="password" formik={formik} />
          <Notification {...notificationProps} />
          <CustomButton {...buttonProps}>Sign In</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
});
