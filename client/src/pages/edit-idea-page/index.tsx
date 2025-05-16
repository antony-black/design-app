import { CustomButton, CustomInput, CustomTextArea, FormItems, Notification, Segment, useForm } from '@/components';
import { useMe } from '@/lib/app-context';
import type { TEditIdeaRouteParams } from '@/lib/routes';
import * as routes from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import type { TIdea } from '@/types/input-types';
import type { TtrpcRouterOutput } from '@design-app/backend/src/lib/router/trpc-router';
import { zEditIdeaTrpcSchema } from '@design-app/backend/src/schemas/z-edit-idea-schema';
import pick from 'lodash/pick';
import { useNavigate, useParams } from 'react-router-dom';

const EditIdeaComponent = ({ idea }: { idea: NonNullable<TtrpcRouterOutput['getSingleIdea']['idea']> }) => {
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
};

export const EditIdeaPage = () => {
  const { nick } = useParams() as TEditIdeaRouteParams;

  const getIdeaResult = trpc.getSingleIdea.useQuery({
    nick,
  });
  const me = useMe();

  if (getIdeaResult.isLoading || getIdeaResult.isFetching) {
    return <span>Loading...</span>;
  }

  if (getIdeaResult.isError) {
    return <span>Error: {getIdeaResult.error.message}</span>;
  }

  if (!getIdeaResult.data.idea) {
    return <span>Idea not found</span>;
  }

  const idea = getIdeaResult.data.idea;

  if (!me) {
    return <span>Only for authorized</span>;
  }

  if (me.id !== idea.authorId) {
    return <span>An idea can only be edited by the author</span>;
  }

  return <EditIdeaComponent idea={idea} />;
};
