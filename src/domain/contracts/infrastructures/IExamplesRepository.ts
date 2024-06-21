import { ApplicationResult } from '@kernelsoftware/shared';

export interface IExamplesRepository<T> {
  upsert(data: T): Promise<ApplicationResult<T>>;
  delete(data: T): Promise<ApplicationResult<boolean>>;
  findOneById(id: string | undefined): Promise<ApplicationResult<T>>;
}
