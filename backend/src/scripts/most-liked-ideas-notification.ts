import { Prisma, type Idea } from '@prisma/client';
import { type AppContext } from '../lib//app-context';

export const getMostLikedIdeas = async (appContext: AppContext, limit: number = 10, now?: Date) => {
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

export const notifyAboutMostLikedIdeas = async (appContext: AppContext) => {
  const mostLikedIdeas = await getMostLikedIdeas(appContext);
  if (!mostLikedIdeas.length) {
    return;
  }
};
