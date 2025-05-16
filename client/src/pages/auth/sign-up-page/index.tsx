import { CustomButton, CustomInput, FormItems, Notification, Segment } from '@/components';
import { useForm } from '@/components/custom-form';
import { withPageWrapper } from '@/lib/page-wrapper';
import { trpc } from '@/lib/trpc';
import { zSignUpScheme } from '@design-app/backend/src/schemas/z-sign-up-schema';
import Cookies from 'js-cookie';
import { z } from 'zod';

export const SignUpPage: React.FC = withPageWrapper({
  redirectAuthorized: true,
})(() => {
  const trpcUtils = trpc.useContext();
  const signUp = trpc.signUp.useMutation();
  const { formik, buttonProps, notificationProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpScheme
      .extend({
        passwordAgain: z.string().min(1),
      })
      .superRefine((val, ctx) => {
        if (val.password !== val.passwordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords must be the same',
            path: ['passwordAgain'],
          });
        }
      }),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values);
      Cookies.set('token', token, { expires: 99999 });
      void trpcUtils.invalidate();
    },
    resetOnSuccess: false,
  });

  const { handleSubmit } = formik;

  return (
    <Segment title="Sign Up">
      <form onSubmit={handleSubmit}>
        <FormItems>
          <CustomInput label="Nick" name="nick" formik={formik} />
          <CustomInput label="Password" name="password" type="password" formik={formik} />
          <CustomInput label="Password again" name="passwordAgain" type="password" formik={formik} />
          <Notification {...notificationProps} />
          <CustomButton {...buttonProps}>Sign Up</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
});
