import { IUsersRepository } from '@domain/contracts/infrastructures/IUsersRepository';
import { IUpdateSubscriptionsUseCase } from '@domain/contracts/usecases/IUpdateSubscriptionsUseCase';
import { RequestToUpdateUsersDTO } from '@domain/dtos/RequestToUpdateUsersDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateUsersUseCase implements IUpdateSubscriptionsUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<User>
  ) {
    this.className = 'UpdateUsersUseCase';
  }

  async execute(data: RequestToUpdateUsersDTO): Promise<ApplicationResult<User>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      context,
      data,
    });
    const { id, ...rest } = data;

    const user = await this.usersRepository.findOneByTenantId(id);

    if (user.isError) {
      this.logger.error('Error on execute - UserRepository.findOneByTenantId', user.errorMessage, {
        context,
      });

      return user;
    }

    const userDomain = User.fromPlain(User, {
      ...user.data,
      ...rest,
    });

    const result = await this.usersRepository.upsert(userDomain);
    if (result.isError) {
      this.logger.error('Error on execute - UserRepository.upsert', result.errorMessage, {
        context,
      });

      return result;
    }

    this.logger.info('Successful execution', {
      context,
    });
    return new ApplicationResultSuccess(result.data);
  }
}
