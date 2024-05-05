import { IPaymentGatewayService } from '@domain/contracts/infrastructures/IPaymentGatewayService';
import { IUsersRepository } from '@domain/contracts/infrastructures/IUsersRepository';
import { IFindUserByTenantIdUseCase } from '@domain/contracts/usecases/IFindUserByTenantIdUseCase';
import { RequestToFindUserByTenantIdDTO } from '@domain/dtos/RequestToFindUserByTenantIdDTO';
import { User } from '@domain/entities/User';
import { Plans } from '@domain/enums/Plans';
import { SubscriptionStatus } from '@domain/enums/SubscriptionStatus';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { isFreeTrial } from '@utils/isFreeTrial';
import { inject, injectable } from 'inversify';

@injectable()
export class FindUserByTenantIdUseCase implements IFindUserByTenantIdUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<User>,
    @inject('PaymentGatewayService')
    private paymentGatewayService: IPaymentGatewayService
  ) {
    this.className = 'FindUserByTenantIdUseCase';
  }

  async execute(data: RequestToFindUserByTenantIdDTO): Promise<ApplicationResult<User>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      data,
      context,
    });

    const result = await this.usersRepository.findOneByTenantId(data.id);

    if (result.isError) {
      this.logger.error('Error on execute', result.errorMessage, {
        context,
      });
      return result;
    }

    let user: User = result.data;
    let planName = Plans.FREE_TRIAL;

    if (this.isSubscriptionActiveOrRetry(result.data) && result.data.subscriptionId) {
      const resultOfSubscription = await this.paymentGatewayService.fetchSubscriptionName(result.data.subscriptionId);

      if (resultOfSubscription.isError) {
        this.logger.error('Error on execute - fetchSubscriptionName', resultOfSubscription.errorMessage, {
          context,
        });
        return result;
      }

      planName = resultOfSubscription.data;
    }

    user = this.createUserWithPlan(user, planName);

    this.logger.info('Successful execution', {
      context,
    });
    return new ApplicationResultSuccess(user);
  }

  private isSubscriptionActiveOrRetry(data: User): boolean {
    return data.subscriptionStatus === SubscriptionStatus.ACTIVE || data.subscriptionStatus === SubscriptionStatus.RETRY;
  }

  private createUserWithPlan(user: User, planName: string): User {
    return User.fromPlain(User, {
      ...user,
      planName,
      freeTrial: isFreeTrial(user),
    });
  }
}
