import { CustomButton, FormItems, Notification, Segment, useForm } from '@/components';
import { Icon } from '@/components/icon';
import { LinkButton } from '@/components/link-button';
import { mixpanelSetLike } from '@/lib/mixpanel';
import { withPageWrapper } from '@/lib/page-wrapper';
import { getEditIdeaRoute, getSingleIdeaRoute } from '@/lib/routes';
import { trpc } from '@/lib/trpc';
import type { TtrpcRouterOutput } from '@design-app/backend/src/lib/router/trpc-router';
import { canBlockIdeas, canEditIdea } from '@design-app/backend/src/utils/handle-permissions-idea';
import { getS3UploadName, getS3UploadUrl } from '@design-app/shared/src/s3';
import { getAvatarUrl, getCloudinaryUploadUrl } from '@design-app/shared/src/types/cloudinary-types';
import { format } from 'date-fns';
import { Fragment } from 'react';
import ImageGallery from 'react-image-gallery';
import styles from './index.module.scss';

const BlockIdea = ({ idea }: { idea: NonNullable<TtrpcRouterOutput['getSingleIdea']['idea']> }) => {
  const blockIdea = trpc.blockIdea.useMutation();
  const trpcUtils = trpc.useContext();
  const { formik, notificationProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id });
      await trpcUtils.getSingleIdea.refetch({ nick: idea.nick });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Notification {...notificationProps} />
        <CustomButton color="red" {...buttonProps}>
          Block Idea
        </CustomButton>
      </FormItems>
    </form>
  );
};

const LikeButton = ({ idea }: { idea: NonNullable<TtrpcRouterOutput['getSingleIdea']['idea']> }) => {
  const trpcUtils = trpc.useContext();
  const setLike = trpc.setLike.useMutation({
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
        void setLike
          .mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
          .then(({ idea: { isLikedByMe } }) => {
            if (isLikedByMe) {
              mixpanelSetLike(idea);
            }
          });
      }}
    >
      <Icon size={32} className={styles.likeIcon} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  );
};

export const IdeaPage: React.FC = withPageWrapper({
  useQuery: () => {
    const { nick } = getSingleIdeaRoute.useParams();
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
  title: ({ idea }) => idea.name,
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={styles.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
    <div className={styles.author}>
      <img className={styles.avatar} alt="" src={getAvatarUrl(idea.author.avatar, 'small')} />
      <div className={styles.name}>
        Author:
        <br />
        {idea.author.nick}
        {idea.author.name ? ` (${idea.author.name})` : ''}
      </div>
    </div>
    {!!idea.images.length && (
      <div className={styles.gallery}>
        <ImageGallery
          showPlayButton={false}
          showFullscreenButton={false}
          items={idea.images.map((image) => ({
            original: getCloudinaryUploadUrl(image, 'image', 'large'),
            thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
          }))}
        />
      </div>
    )}
    {idea.certificate && (
      <div className={styles.certificate}>
        Certificate:{' '}
        <a className={styles.certificateLink} target="_blank" href={getS3UploadUrl(idea.certificate)} rel="noreferrer">
          {getS3UploadName(idea.certificate)}
        </a>
      </div>
    )}
    {!!idea.documents.length && (
      <div className={styles.documents}>
        Documents:{' '}
        {idea.documents.map((document) => (
          <Fragment key={document}>
            <br />
            <a className={styles.documentLink} target="_blank" href={getS3UploadUrl(document)} rel="noreferrer">
              {getS3UploadName(document)}
            </a>
          </Fragment>
        ))}
      </div>
    )}
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
    {canEditIdea(me, idea) && (
      <div className={styles.editButton}>
        <LinkButton to={getEditIdeaRoute({ nick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
    {canBlockIdeas(me) && (
      <div className={styles.blockIdea}>
        <BlockIdea idea={idea} />
      </div>
    )}
  </Segment>
));
