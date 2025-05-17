import { CustomInput, layoutContentElRef, Loader, Notification, Segment, useForm } from '@/components';
import * as routes from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import { zGetIdeasTrpcSchema } from '@design-app/backend/src/schemas/z-get-ideas-schema';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';
import styles from './index.module.scss';
import { withPageWrapper } from '@/lib/page-wrapper';

export const AllIdeasPage = withPageWrapper({
  title: 'IdeaNick',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetIdeasTrpcSchema.pick({ search: true }),
  });
  const [search] = useDebounceValue(formik.values.search, 500);
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getAllIdeas.useInfiniteQuery(
      {
        search,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <Segment title="All Ideas">
      <div className={styles.filter}>
        <CustomInput maxWidth={'100%'} label="Search" name="search" formik={formik} />
      </div>
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Notification color="red">{error.message}</Notification>
      ) : !data.pages[0].ideas.length ? (
        <Notification color="brown">Nothing found by search</Notification>
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
                  >
                    Likes: {idea.likesCount}
                  </Segment>
                </div>
              ))}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  );
});
