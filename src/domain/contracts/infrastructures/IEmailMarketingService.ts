import { User } from '@domain/entities/User';
import { ApplicationResult } from '@kernelsoftware/shared';

export interface IEmailMarketingService {
  createContacts(data: User): Promise<ApplicationResult<boolean>>;
}
