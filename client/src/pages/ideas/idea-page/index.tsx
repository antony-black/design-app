import { Segment } from '@/components';
import { LinkButton } from '@/components/link-button';
import { withPageWrapper } from '@/lib/page-wrapper';
import { getEditIdeaRoute, type TideaRouteParams } from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';

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
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={styles.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
    <div className={styles.author}>Author: {idea.author.nick}</div>
    <div className={styles.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
    {me?.id === idea.authorId && (
      <div className={styles.editButton}>
        <LinkButton to={getEditIdeaRoute({ nick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
  </Segment>
));
