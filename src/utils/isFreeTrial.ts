import { User } from '@domain/entities/User';
import { differenceInDays } from 'date-fns';

export function isFreeTrial(user: User) {
  const currentDate = new Date();

  const diffDays = differenceInDays(currentDate, new Date(user.created_at));
  return diffDays <= 7;
}
