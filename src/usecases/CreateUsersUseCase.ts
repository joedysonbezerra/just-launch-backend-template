import { IAuthService } from '@domain/contracts/infrastructures/IAuthService';
// import { IPaymentGatewayService } from '@domain/contracts/infrastructures/IPaymentGatewayService';
import { IUsersRepository } from '@domain/contracts/infrastructures/IUsersRepository';
import { ICreateUsersUseCase } from '@domain/contracts/usecases/ICreateUsersUseCase';
import { RequestToCreateUsersDTO } from '@domain/dtos/RequestToCreateUsersDTO';
import { User } from '@domain/entities/User';
import { SubscriptionStatus } from '@domain/enums/SubscriptionStatus';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { buildReferralId } from '@utils/buildReferralId';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateUsersUseCase implements ICreateUsersUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('AuthService')
    private authService: IAuthService,
    // @inject('PaymentGatewayService')
    // private paymentGatewayService: IPaymentGatewayService,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository<User>
  ) {
    this.className = 'CreateUsersUseCase';
  }

  async execute(data: RequestToCreateUsersDTO): Promise<ApplicationResult<User>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      email: data.email,
      name: data.name,
      context,
    });

    const authResult = await this.authService.signUp(data);

    if (authResult.isError) {
      this.logger.error('Error on execute - AuthService', authResult.errorMessage, {
        context,
      });
      return authResult;
    }

    const uuid = User.generateId();

    // const paymentGatewayResult = await this.paymentGatewayService.createCustomer({
    //   ...data,
    //   userId: uuid,
    //   tenantId: authResult.data,
    // });

    // if (paymentGatewayResult.isError) {
    //   this.logger.error('Error on execute - PaymentGatewayService', paymentGatewayResult.errorMessage, {
    //     context,
    //   });

    //   await this.authService.deleteUser(authResult.data);

    //   return paymentGatewayResult;
    // }

    const userDomain = User.fromPlain(User, {
      id: uuid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      subscriptionStatus: SubscriptionStatus.PENDING,
      tenantId: authResult.data,
      referralId: buildReferralId(),
      customerId: uuid, // paymentGatewayResult.data,
    });

    const result = await this.usersRepository.upsert(userDomain);
    if (result.isError) {
      this.logger.error('Error on execute - AuthService', result.errorMessage, {
        context,
      });

      await this.authService.deleteUser(authResult.data);
      // await this.paymentGatewayService.deleteCustomer(paymentGatewayResult.data);

      return result;
    }

    this.logger.info('Successful execution', {
      context,
    });
    return new ApplicationResultSuccess(result.data);
  }
}
