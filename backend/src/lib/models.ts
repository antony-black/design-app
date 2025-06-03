import { TPick } from '@design-app/shared/src/types/TPick';
import { type User } from '@prisma/client';

export const toClientMe = (user: User | null) => {
  return user && TPick(user, ['id', 'nick', 'name', 'permissions', 'email']);
};
