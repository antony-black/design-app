import { Notification, Segment } from '@/components';
import * as routes from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

export const AllIdeasPage = () => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getAllIdeas.useInfiniteQuery(
      {
        limit: 2,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      },
    );

  return (
    <Segment title="All Ideas">
      {isLoading || isRefetching ? (
        <div>Loading...</div>
      ) : isError ? (
        <Notification color="red">{error.message}</Notification>
      ) : (
        <div className={styles.ideas}>
          {data.pages
            .flatMap((page) => page.ideas)
            .map((idea) => (
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
          <div className={styles.more}>
            {hasNextPage && !isFetchingNextPage && (
              <button
                onClick={() => {
                  void fetchNextPage();
                }}
              >
                Load more
              </button>
            )}
            {isFetchingNextPage && <span>Loading...</span>}
          </div>
        </div>
      )}
    </Segment>
  );
};
