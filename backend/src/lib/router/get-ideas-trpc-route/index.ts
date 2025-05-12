import _ from 'lodash';
import { trpc } from '../../../lib/trpc';
import { ideas } from '../../mock-data';

export const getIdeasTrpcRoute = trpc.procedure.query(() => {
  return { ideas: ideas.map((idea) => _.pick(idea, ['nick', 'name', 'description'])) };
});
