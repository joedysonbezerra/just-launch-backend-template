import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

import { RequestToDeleteUsersDTO } from '@domain/dtos/RequestToDeleteUsersDTO';

export interface IDeleteUsersUseCase extends IUseCase<RequestToDeleteUsersDTO, boolean> {
  execute(data: RequestToDeleteUsersDTO): Promise<ApplicationResult<boolean>>;
}
