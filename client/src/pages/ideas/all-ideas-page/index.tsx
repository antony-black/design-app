import { layoutContentElRef, Loader, Notification, Segment } from '@/components';
import * as routes from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

export const AllIdeasPage = () => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getAllIdeas.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <Segment title="All Ideas">
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Notification color="red">{error.message}</Notification>
      ) : (
        <div className={styles.ideas}>
          <InfiniteScroll
            threshold={250}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage();
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className={styles.more} key="loader">
                <Loader type="page" />
              </div>
            }
            getScrollParent={() => layoutContentElRef.current}
            useWindow={
              layoutContentElRef.current ? getComputedStyle(layoutContentElRef.current).overflow !== 'auto' : true
            }
          >
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
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  );
};
