import { type Idea, type User } from '@prisma/client';
import _ from 'lodash';
import { createAppContext } from '../lib/app-context';
import { trpcRouter } from '../lib/router/trpc-router';
import { getTrpcContext } from '../lib/trpc';
import { ExpressRequest } from '../types';
import { deepMap } from '../utils/deep-map';
import { getPasswordHash } from '../utils/get-password-hash';

export const appContext = createAppContext();

afterAll(appContext.stop);

beforeEach(async () => {
  await appContext.prisma.like.deleteMany();
  await appContext.prisma.idea.deleteMany();
  await appContext.prisma.user.deleteMany();
});

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest;
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }));
};

export const withoutNoize = (input: any): any => {
  return deepMap(input, ({ value }) => {
    if (_.isObject(value) && !_.isArray(value)) {
      return _.entries(value).reduce((acc, [objectKey, objectValue]: [string, any]) => {
        if ([/^id$/, /Id$/, /At$/].some((regex) => regex.test(objectKey))) {
          return acc;
        }
        return {
          ...acc,
          [objectKey]: objectValue,
        };
      }, {});
    }
    return value;
  });
};

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      nick: `user${number}`,
      email: `user${number}@example.com`,
      password: getPasswordHash(user.password || '1234'),
      ..._.omit(user, ['password']),
    },
  });
};

export const createIdea = async ({
  idea = {},
  author,
  number = 1,
}: {
  idea?: Partial<Idea>;
  author: Pick<User, 'id'>;
  number?: number;
}) => {
  return await appContext.prisma.idea.create({
    data: {
      nick: `idea${number}`,
      authorId: author.id,
      name: `Idea ${number}`,
      description: `Idea ${number} description`,
      text: `Idea ${number} text text text text text text text text text text text text text text text text text text text text text`,
      ...idea,
    },
  });
};

export const createIdeaWithAuthor = async ({
  author,
  idea,
  number,
}: {
  author?: Partial<User>;
  idea?: Partial<Idea>;
  number?: number;
} = {}) => {
  const createdUser = await createUser({ user: author, number });
  const createdIdea = await createIdea({ idea, author: createdUser, number });
  return {
    author: createdUser,
    idea: createdIdea,
  };
};

export const createIdeaLike = async ({
  idea,
  liker,
  createdAt,
}: {
  idea: Pick<Idea, 'id'>;
  liker: Pick<User, 'id'>;
  createdAt?: Date;
}) => {
  return await appContext.prisma.like.create({
    data: {
      ideaId: idea.id,
      userId: liker.id,
      createdAt,
    },
  });
};
