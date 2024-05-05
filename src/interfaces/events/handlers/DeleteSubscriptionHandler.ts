import { IEventHandler } from '@domain/contracts/interfaces/IEventHandler';
import { IUpdateSubscriptionsUseCase } from '@domain/contracts/usecases/IUpdateSubscriptionsUseCase';
import { EventsOfSubscriptionDTO } from '@domain/dtos/EventsOfSubscriptionDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, ApplicationResultForbidden } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteSubscriptionHandler implements IEventHandler<User> {
  className: string;

  eventType: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UpdateSubscriptionsUseCase')
    private updateSubscriptionsUseCase: IUpdateSubscriptionsUseCase
  ) {
    this.className = 'DeleteSubscriptionHandler';
    this.eventType = 'customer.subscription.deleted';
  }

  canProcess(eventType: string): boolean {
    return eventType === this.eventType;
  }

  async process(data: Record<string, unknown>): Promise<ApplicationResult<User>> {
    const context = `${this.className}.process`;

    this.logger.info('Start execute', {
      context,
    });

    const { entity, errors } = EventsOfSubscriptionDTO.validate(EventsOfSubscriptionDTO, {
      id: data.id,
      status: data.status,
      customerId: data.customer,
    });

    if (errors.length !== 0) {
      this.logger.info('Validation fails', { errors });
      return new ApplicationResultForbidden('Validation fails');
    }

    this.logger.info('It is starting the usecase', { context, entity });
    const result = await this.updateSubscriptionsUseCase.execute(entity);

    return result;
  }
}
