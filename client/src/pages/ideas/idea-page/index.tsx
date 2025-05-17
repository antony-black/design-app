import { Segment } from '@/components';
import { LinkButton } from '@/components/link-button';
import { withPageWrapper } from '@/lib/page-wrapper';
import { getEditIdeaRoute, type TideaRouteParams } from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import type { TtrpcRouterOutput } from '@design-app/backend/src/lib/router/trpc-router';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';

const LikeButton = ({ idea }: { idea: NonNullable<TtrpcRouterOutput['getSingleIdea']['idea']> }) => {
  const trpcUtils = trpc.useContext();
  const setIdeaLike = trpc.setLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getSingleIdea.getData({ nick: idea.nick });
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        };
        trpcUtils.getSingleIdea.setData({ nick: idea.nick }, newGetIdeaData);
      }
    },
    onSuccess: () => {
      void trpcUtils.getSingleIdea.invalidate({ nick: idea.nick });
    },
  });
  return (
    <button
      className={styles.likeButton}
      onClick={() => {
        void setIdeaLike.mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe });
      }}
    >
      {idea.isLikedByMe ? 'Unlike' : 'Like'}
    </button>
  );
};

export const IdeaPage: React.FC = withPageWrapper({
  useQuery: () => {
    const { nick } = useParams() as TideaRouteParams;
    return trpc.getSingleIdea.useQuery({
      nick,
    });
  },
  checkExists: ({ queryResult }) => !!queryResult.data.idea,
  checkExistsMessage: 'Idea not found',
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={styles.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
    <div className={styles.author}>
      Author: {idea.author.nick}
      {idea.author.name ? ` (${idea.author.name})` : ''}
    </div>
    <div className={styles.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
    <div className={styles.likes}>
      Likes: {idea.likesCount}
      {me && (
        <>
          <br />
          <LikeButton idea={idea} />
        </>
      )}
    </div>
    {me?.id === idea.authorId && (
      <div className={styles.editButton}>
        <LinkButton to={getEditIdeaRoute({ nick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
  </Segment>
));
