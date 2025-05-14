import { CustomButton, CustomInput, FormItems, Notification, Segment } from '@/components';
import { trpc } from '@/lib/trpc';
import { zSignUpScheme } from '@design-app/backend/src/schemas/z-sign-up-schema';
import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useEffect, useState } from 'react';

type TSignInPage = {
  nick: string;
  password: string;
};

export const SignInPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const singIn = trpc.signIn.useMutation();
  const formik = useFormik<TSignInPage>({
    initialValues: {
      nick: '',
      password: '',
    },
    validate: withZodSchema(zSignUpScheme),
    onSubmit: async (values, { resetForm }) => {
      try {
        await singIn.mutateAsync(values);
        resetForm();
        setShowSuccess(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
  });

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

  const { handleSubmit, isValid, submitCount, isSubmitting } = formik;

  return (
    <Segment title="Sign Up">
      <form onSubmit={handleSubmit}>
        <FormItems>
          <CustomInput label="Nick" name="nick" formik={formik} />
          <CustomInput label="Password" name="password" type="password" formik={formik} />
          {!isValid && !!submitCount && <Notification color="red">Some fields are invalid.</Notification>}
          {error && <Notification color={'red'}>{error}</Notification>}
          {showSuccess && <Notification color={'green'}>Successfully sign in!</Notification>}
          <CustomButton isLoading={isSubmitting}>Sign in</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
};
