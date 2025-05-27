import { type Idea } from '@prisma/client';
import { AppContext } from '../lib/app-context';
import { sendMostLikedIdeasEmail } from '../lib/emails-service';

export const mostLikedIdeasNotification = async (appContext: AppContext) => {
  const mostLikedIdeas = await appContext.prisma.$queryRaw<
    Array<Pick<Idea, 'id' | 'nick' | 'name'> & { thisMonthLikesCount: number }>
  >`
    with "topIdeas" as (
      select id,
        nick,
        name,
        (
          select count(*)::int
          from "Like" il
          where il."ideaId" = i.id
            and il."createdAt" > now() - interval '1 month'
            and i."blockedAt" is null
        ) as "thisMonthLikesCount"
      from "Idea" i
      order by "thisMonthLikesCount" desc
      limit 10
    )
    select *
    from "topIdeas"
    where "thisMonthLikesCount" > 0
  `;
  // logger.info(mostLikedIdeas);
  if (!mostLikedIdeas) {
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
