import { CustomButton, CustomInput, FormItems, Notification, Segment } from '@/components';
import { trpc } from '@/lib/trpc';
import { zSignUpScheme } from '@design-app/backend/src/schemas/z-sign-up-schema';
import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useEffect, useState } from 'react';
import { z } from 'zod';

type TSignUpPage = {
  nick: string;
  password: string;
  passwordAgain: string;
};

export const SignUpPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const singUp = trpc.signUp.useMutation();
  const formik = useFormik<TSignUpPage>({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpScheme
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
    ),
    onSubmit: async (values, { resetForm }) => {
      try {
        await singUp.mutateAsync(values);
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
          <CustomInput label="Password again" name="passwordAgain" type="password" formik={formik} />
          {!isValid && !!submitCount && <Notification color="red">Some fields are invalid.</Notification>}
          {error && <Notification color={'red'}>{error}</Notification>}
          {showSuccess && <Notification color={'green'}>Successfully sign up!</Notification>}
          <CustomButton isLoading={isSubmitting}>Sign up</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
};
