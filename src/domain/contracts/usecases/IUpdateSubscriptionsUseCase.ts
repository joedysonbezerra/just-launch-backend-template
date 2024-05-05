import { EventsOfSubscriptionDTO } from '@domain/dtos/EventsOfSubscriptionDTO';
import { User } from '@domain/entities/User';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface IUpdateSubscriptionsUseCase extends IUseCase<EventsOfSubscriptionDTO, User> {
  execute(data: EventsOfSubscriptionDTO): Promise<ApplicationResult<User>>;
}
