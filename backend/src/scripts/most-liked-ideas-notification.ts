import { Prisma, type Idea } from '@prisma/client';
import { type AppContext } from '../lib//app-context';
import { sendMostLikedIdeasEmail } from '../lib/emails/emails-services';

type TMostLikedIdeas = {
  appContext: AppContext;
  limit?: number;
  now?: Date;
};

export const getMostLikedIdeas = async ({ appContext, limit = 10, now }: TMostLikedIdeas) => {
  const sqlNow = now ? Prisma.sql`${now.toISOString()}::timestamp` : Prisma.sql`now()`;
  return await appContext.prisma.$queryRaw<Array<Pick<Idea, 'id' | 'nick' | 'name'> & { thisMonthLikesCount: number }>>`
  with "topIdeas" as (
    select id,
      nick,
      name,
      (
        select count(*)::int
        from "Like" il
        where il."ideaId" = i.id
          and il."createdAt" > ${sqlNow} - interval '1 month'
          and i."blockedAt" is null
      ) as "thisMonthLikesCount"
    from "Idea" i
    order by "thisMonthLikesCount" desc
    limit ${limit}
  )
  select *
  from "topIdeas"
  where "thisMonthLikesCount" > 0
`;
};

export const notifyAboutMostLikedIdeas = async ({ appContext, limit, now }: TMostLikedIdeas) => {
  const mostLikedIdeas = await getMostLikedIdeas({ appContext, limit, now });

  if (!mostLikedIdeas.length) {
    return;
  }

  const users = await appContext.prisma.user.findMany({
    select: {
      email: true,
    },
  });

  for (const user of users) {
    await sendMostLikedIdeasEmail({ user, ideas: mostLikedIdeas });
  }
};
