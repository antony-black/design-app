import { CustomButton, CustomInput, CustomTextArea, FormItems, Notification, Segment, useForm } from '@/components';
import { withPageWrapper } from '@/lib/page-wrapper';
import * as routes from '@/lib/routes';
import { getEditIdeaRoute } from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import type { TIdea } from '@/types/input-types';
import { zEditIdeaTrpcSchema } from '@design-app/backend/src/schemas/z-edit-idea-schema';
import { canEditIdea } from '@design-app/backend/src/utils/handle-permissions-idea';
import pick from 'lodash/pick';
import { useNavigate } from 'react-router-dom';

export const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  title: ({ idea }) => `Edit Idea "${idea.name}"`,
  useQuery: () => {
    const { nick } = getEditIdeaRoute.useParams();
    return trpc.getSingleIdea.useQuery({
      nick,
    });
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const idea = checkExists(queryResult.data.idea, 'Idea not found');
    checkAccess(canEditIdea(ctx.me, idea), 'An idea can only be edited by the author');
    return {
      idea,
    };
  },
})(({ idea }) => {
  const navigate = useNavigate();
  const updateIdea = trpc.editIdea.useMutation();
  const { formik, buttonProps, notificationProps } = useForm({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text']),
    validationSchema: zEditIdeaTrpcSchema.omit({ ideaId: true }),
    onSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values });
      navigate(routes.getSingleIdeaRoute({ nick: values.nick }));
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  });

  return (
    <Segment title={`Edit Idea: ${idea.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <CustomInput<TIdea> label="Name" name="name" formik={formik} />
          <CustomInput<TIdea> label="Nick" name="nick" formik={formik} />
          <CustomInput<TIdea> label="Description" name="description" maxWidth={500} formik={formik} />
          <CustomTextArea<TIdea> label="Text" name="text" formik={formik} />
          <Notification {...notificationProps} />
          <CustomButton {...buttonProps}>Update Idea</CustomButton>
        </FormItems>
      </form>
    </Segment>
  );
});
