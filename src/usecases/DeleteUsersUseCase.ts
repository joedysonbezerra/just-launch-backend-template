import { IAuthService } from '@domain/contracts/infrastructures/IAuthService';
import { IUsersRepository } from '@domain/contracts/infrastructures/IUsersRepository';
import { IDeleteUsersUseCase } from '@domain/contracts/usecases/IDeleteUsersUseCase';
import { RequestToDeleteUsersDTO } from '@domain/dtos/RequestToDeleteUsersDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteUsersUseCase implements IDeleteUsersUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<User>,
    @inject('AuthService')
    private authService: IAuthService
  ) {
    this.className = 'DeleteUsersUseCase';
  }

  async execute(data: RequestToDeleteUsersDTO): Promise<ApplicationResult<boolean>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      data,
      context,
    });

    const user = await this.usersRepository.findOneById(data.id);

    if (user.isError) {
      this.logger.error('Error on execute', user.errorMessage, {
        context,
      });
      return user;
    }

    const result = await this.usersRepository.delete(user.data);

    if (result.isError) {
      this.logger.error('Error on execute', result.errorMessage, {
        context,
      });
      return result;
    }
    const authResult = await this.authService.deleteUser(user.data.tenantId);

    if (authResult.isError) {
      this.logger.error('Error on execute', authResult.errorMessage, {
        context,
      });
      return authResult;
    }

    this.logger.info('Successful execution', {
      context,
    });
    return new ApplicationResultSuccess(true);
  }
}
