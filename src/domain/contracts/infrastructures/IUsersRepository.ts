import { ApplicationResult } from '@kernelsoftware/shared';

export interface IUsersRepository<T> {
  upsert(data: T): Promise<ApplicationResult<T>>;
  findOneByTenantId(id: string | undefined): Promise<ApplicationResult<T>>;
  delete(data: T): Promise<ApplicationResult<boolean>>;
  findByCustomerId(id: string): Promise<ApplicationResult<T>>;
  findOneById(id: string | undefined): Promise<ApplicationResult<T>>;
}
