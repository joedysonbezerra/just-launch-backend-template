import { RequestToCreateUsersDTO } from '@domain/dtos/RequestToCreateUsersDTO';
import { ApplicationResult } from '@kernelsoftware/shared';

export interface IAuthService {
  signUp(data: RequestToCreateUsersDTO): Promise<ApplicationResult<string>>;
  deleteUser(id: string): Promise<ApplicationResult<boolean>>;
}
