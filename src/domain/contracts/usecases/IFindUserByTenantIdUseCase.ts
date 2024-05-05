import { RequestToFindUserByTenantIdDTO } from '@domain/dtos/RequestToFindUserByTenantIdDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface IFindUserByTenantIdUseCase extends IUseCase<RequestToFindUserByTenantIdDTO, User> {
  execute(data: RequestToFindUserByTenantIdDTO): Promise<ApplicationResult<User>>;
}
