import { IUsersRepository } from '@domain/contracts/infrastructures/IUsersRepository';
import { IUpdateSubscriptionsUseCase } from '@domain/contracts/usecases/IUpdateSubscriptionsUseCase';
import { EventsOfSubscriptionDTO } from '@domain/dtos/EventsOfSubscriptionDTO';
import { User } from '@domain/entities/User';
import { SubscriptionStatus } from '@domain/enums/SubscriptionStatus';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateSubscriptionsUseCase implements IUpdateSubscriptionsUseCase {
  private subscriptionStatusMap: Record<string, SubscriptionStatus>;

  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<User>
  ) {
    this.className = 'UpdateSubscriptionsUseCase';

    this.subscriptionStatusMap = {
      incomplete: SubscriptionStatus.RETRY,
      incomplete_expired: SubscriptionStatus.CANCELED,
      active: SubscriptionStatus.ACTIVE,
      past_due: SubscriptionStatus.RETRY,
      canceled: SubscriptionStatus.CANCELED,
      trialing: SubscriptionStatus.ACTIVE,
    };
  }

  async execute(data: EventsOfSubscriptionDTO): Promise<ApplicationResult<User>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      context,
      data,
    });

    const user = await this.usersRepository.findByCustomerId(data.customerId);

    if (user.isError) {
      this.logger.error('Error on execute - UserRepository.findByCustomerId', user.errorMessage, {
        context,
      });

      return user;
    }

    const userDomain = User.fromPlain(User, {
      ...user.data,
      subscriptionStatus: this.subscriptionStatusMap[data.status],
      subscriptionId: data.id,
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
