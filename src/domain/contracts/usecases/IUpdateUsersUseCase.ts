import { RequestToUpdateUsersDTO } from '@domain/dtos/RequestToUpdateUsersDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface IUpdateUsersUseCase extends IUseCase<RequestToUpdateUsersDTO, User> {
  execute(data: RequestToUpdateUsersDTO): Promise<ApplicationResult<User>>;
}
