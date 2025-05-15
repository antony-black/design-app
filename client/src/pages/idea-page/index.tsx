import { Segment } from '@/components';
import { LinkButton } from '@/components/link-button';
import type { TideaRouteParams } from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import * as routes from '../../lib/routes';
import styles from './index.module.scss';

export const IdeaPage: React.FC = () => {
  const { nick } = useParams<TideaRouteParams>();
  const getMeResult = trpc.getMe.useQuery();

  // TODO: refactor "routes" & remove redundant checks
  if (!nick) {
    return <span>Missing idea nick.</span>;
  }

  const { data, isLoading, isFetching, error } = trpc.getSingleIdea.useQuery({ nick });

  if (isLoading || isFetching || getMeResult.isLoading || getMeResult.isFetching) {
    return <span>Loading...</span>;
  }

  if (isLoading || isFetching) {
    return <span>Loading...</span>;
  }
  if (!data?.idea) {
    return <span>There are no idea.</span>;
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  const createdAt = format(data.idea.createdAt, 'yyyy-MM--dd');

  return (
    <Segment title={data.idea.name} description={data.idea.description}>
      <div className={styles.createdAt}>{createdAt}</div>
      <div className={styles.author}>Author: {data.idea.author.nick}</div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: data.idea.text }} />
      {getMeResult?.data?.me?.id === data.idea.authorId && (
        <div className={styles.editButton}>
          <LinkButton to={routes.getEditIdeaRoute({ nick: data.idea.nick })}>Edit Idea</LinkButton>
        </div>
      )}
    </Segment>
  );
};
