import { CustomButton, CustomInput, FormItems, Notification, Segment } from '@/components';
import { getAllIdeasRoute } from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import { zSignUpScheme } from '@design-app/backend/src/schemas/z-sign-up-schema';
import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type TSignInPage = {
  nick: string;
  password: string;
};

export const SignInPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const trpcUtils = trpc.useContext();
  const singIn = trpc.signIn.useMutation();
  const formik = useFormik<TSignInPage>({
    initialValues: {
      nick: '',
      password: '',
    },
    validate: withZodSchema(zSignUpScheme),
    onSubmit: async (values) => {
      try {
        const { token } = await singIn.mutateAsync(values);
        Cookies.set('token', token, { expires: 99999 });
        void trpcUtils.invalidate();
        navigate(getAllIdeasRoute());
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    },
  });

  // TODO: add to utils
  useEffect(() => {
    if (error.length > 0) {
      const timeout = setTimeout(() => {
        setError('');
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [error]);

  const { handleSubmit, isValid, submitCount, isSubmitting } = formik;

  return (
    <Segment title="Sign Up">
      <form onSubmit={handleSubmit}>
        <FormItems>
          <CustomInput label="Nick" name="nick" formik={formik} />
          <CustomInput label="Password" name="password" type="password" formik={formik} />
          {!isValid && !!submitCount && <Notification color="red">Some fields are invalid.</Notification>}
          {error && <Notification color={'red'}>{error}</Notification>}
          <CustomButton isLoading={isSubmitting}>Sign in</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
};
