import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import { Segment } from '@/components/segment';
import * as routes from '@/lib/routes';
import { trpc } from '@/lib/trpc';

const AllIdeasPage = () => {
  const { data, isLoading, isFetching, error } = trpc.getAllIdeas.useQuery();
  if (isLoading || isFetching) {
    return <span>Loading...</span>;
  }
  if (!data?.ideas) {
    return <span>There are no ideas.</span>;
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <Segment title="All Ideas">
      <div className={styles.ideas}>
        {data.ideas.map((idea) => (
          <div className={styles.idea} key={idea.nick}>
            <Segment
              size={2}
              title={
                <Link className={styles.ideaLink} to={routes.getSingleIdeaRoute({ nick: idea.nick })}>
                  {idea.name}
                </Link>
              }
              description={idea.description}
            />
          </div>
        ))}
      </div>
    </Segment>
  );
};

export default AllIdeasPage;
