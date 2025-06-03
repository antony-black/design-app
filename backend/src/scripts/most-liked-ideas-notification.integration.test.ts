import { appContext, createIdeaLike, createIdeaWithAuthor, withoutNoize } from '../test/integration';
import { startOfMonth, sub } from 'date-fns';
import { sendEmail } from '../lib/emails/emails-utils';
import { notifyAboutMostLikedIdeas } from './most-liked-ideas-notification';

const createData = async (now: Date) => {
  // has 3 likes in prev month
  const { idea: idea1, author: author1 } = await createIdeaWithAuthor({ number: 1 });

  // has 2 like in prev month, and 2 like in prev prev month
  const { idea: idea2, author: author2 } = await createIdeaWithAuthor({ number: 2 });

  // has 1 like in prev month, and 1 like in prev prev month
  const { idea: idea3, author: author3 } = await createIdeaWithAuthor({ number: 3 });

  // has 3 likes in prev prev month
  const { idea: idea4, author: author4 } = await createIdeaWithAuthor({ number: 4 });

  // has no likes
  await createIdeaWithAuthor({ number: 5 });

  const prevMonthDate = sub(now, {
    days: 10,
  });
  const prevPrevMonthDate = sub(now, {
    days: 10,
    months: 1,
  });

  await createIdeaLike({ idea: idea1, liker: author1, createdAt: prevMonthDate });
  await createIdeaLike({ idea: idea1, liker: author2, createdAt: prevMonthDate });
  await createIdeaLike({ idea: idea1, liker: author3, createdAt: prevMonthDate });

  await createIdeaLike({ idea: idea2, liker: author1, createdAt: prevMonthDate });
  await createIdeaLike({ idea: idea2, liker: author2, createdAt: prevMonthDate });
  await createIdeaLike({ idea: idea2, liker: author3, createdAt: prevPrevMonthDate });
  await createIdeaLike({ idea: idea2, liker: author4, createdAt: prevPrevMonthDate });

  await createIdeaLike({ idea: idea3, liker: author1, createdAt: prevMonthDate });
  await createIdeaLike({ idea: idea3, liker: author2, createdAt: prevPrevMonthDate });

  await createIdeaLike({ idea: idea4, liker: author1, createdAt: prevPrevMonthDate });
  await createIdeaLike({ idea: idea4, liker: author2, createdAt: prevPrevMonthDate });
  await createIdeaLike({ idea: idea4, liker: author3, createdAt: prevPrevMonthDate });
};

describe('notifyAboutMostLikedIdeas', () => {
  it('send list of ideas to users', async () => {
    const now = startOfMonth(new Date());
    await createData(now);
    await notifyAboutMostLikedIdeas({ appContext, limit: 2, now });
    expect(sendEmail).toHaveBeenCalledTimes(5);
    const calls = jest.mocked(sendEmail).mock.calls;
    const prettifiedCallProps = calls.map(([props]) => withoutNoize(props));
    expect(prettifiedCallProps).toMatchInlineSnapshot(`
      [
        {
          "subject": "Most Liked Ideas!",
          "templateName": "mostLikedIdeas",
          "templateVariables": {
            "ideas": [
              {
                "name": "Idea 1",
              },
              {
                "name": "Idea 2",
              },
            ],
          },
          "to": "user1@example.com",
        },
        {
          "subject": "Most Liked Ideas!",
          "templateName": "mostLikedIdeas",
          "templateVariables": {
            "ideas": [
              {
                "name": "Idea 1",
              },
              {
                "name": "Idea 2",
              },
            ],
          },
          "to": "user2@example.com",
        },
        {
          "subject": "Most Liked Ideas!",
          "templateName": "mostLikedIdeas",
          "templateVariables": {
            "ideas": [
              {
                "name": "Idea 1",
              },
              {
                "name": "Idea 2",
              },
            ],
          },
          "to": "user3@example.com",
        },
        {
          "subject": "Most Liked Ideas!",
          "templateName": "mostLikedIdeas",
          "templateVariables": {
            "ideas": [
              {
                "name": "Idea 1",
              },
              {
                "name": "Idea 2",
              },
            ],
          },
          "to": "user4@example.com",
        },
        {
          "subject": "Most Liked Ideas!",
          "templateName": "mostLikedIdeas",
          "templateVariables": {
            "ideas": [
              {
                "name": "Idea 1",
              },
              {
                "name": "Idea 2",
              },
            ],
          },
          "to": "user5@example.com",
        },
      ]
    `);
  });
});
