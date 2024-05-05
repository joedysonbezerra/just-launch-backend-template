import { RequestToCreateUsersDTO } from '@domain/dtos/RequestToCreateUsersDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface ICreateUsersUseCase extends IUseCase<RequestToCreateUsersDTO, User> {
  execute(data: RequestToCreateUsersDTO): Promise<ApplicationResult<User>>;
}
