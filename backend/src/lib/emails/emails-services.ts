import { addNewIdeaRoute, getSingleIdeaRoute } from '@design-app/client/src/lib/routes';
import { type Idea, type User } from '@prisma/client';
import { sendEmail } from './emails-utils';

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registration!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${addNewIdeaRoute({ abs: true })}`,
    },
  });
};

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your Idea Blocked!',
    templateName: 'ideaBlocked',
    templateVariables: {
      ideaNick: idea.nick,
    },
  });
};

export const sendMostLikedIdeasEmail = async ({
  user,
  ideas,
}: {
  user: Pick<User, 'email'>;
  ideas: Array<Pick<Idea, 'nick' | 'name'>>;
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Most Liked Ideas!',
    templateName: 'mostLikedIdeas',
    templateVariables: {
      ideas: ideas.map((idea) => ({ name: idea.name, url: getSingleIdeaRoute({ abs: true, nick: idea.nick }) })),
    },
  });
};
