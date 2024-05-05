import { nanoid } from 'nanoid';

export function buildReferralId() {
  return nanoid(4);
}
