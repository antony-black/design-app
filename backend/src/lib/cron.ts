import { CronJob } from 'cron';
import { getMostLikedIdeas } from '../scripts/most-liked-ideas-notification';
import { type AppContext } from './app-context';
import { logger } from './logger';

export const applyCron = (appContext: AppContext) => {
  // mostLikedIdeasNotification(appContext).catch(logger.error);
  new CronJob(
    '0 10 1 * *', // At 10:00 on day-of-month 1
    () => {
      getMostLikedIdeas({ appContext }).catch((error) => {
        logger.error('cron', error);
      });
    },
    null, // onComplete
    true, // start right now
  );
};
