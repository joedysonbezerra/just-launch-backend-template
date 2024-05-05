import { Settings } from '@config/Settings';
import { UserModel } from '@infrastructures/dynamoDB/models/UserModel';
import { UsersRepository } from '@infrastructures/repositories/UsersRepository';
import { StripeService } from '@infrastructures/stripe/StripeService';
import { SupabaseService } from '@infrastructures/supabase/SupabaseService';
import { CreateSubscriptionHandler } from '@interfaces/events/handlers/CreateSubscriptionHandler';
import { DeleteSubscriptionHandler } from '@interfaces/events/handlers/DeleteSubscriptionHandler';
import { UpdateSubscriptionHandler } from '@interfaces/events/handlers/UpdateSubscriptionHandler';
import { CreateUsersController } from '@interfaces/http/createUsers/controllers/CreateUsersController';
import { DeleteUsersController } from '@interfaces/http/deleteUsers/controllers/DeleteUsersController';
import { FindUserByTenantIdController } from '@interfaces/http/findUserByTenantId/controllers/FindUserByTenantIdController';
import { ReceiveStripeEventsController } from '@interfaces/http/receiveStripeEvents/controllers/ReceiveStripeEventsController';
import { UpdateUsersController } from '@interfaces/http/updateUsers/controllers/UpdateUsersController';
import { Logger } from '@kernelsoftware/shared';
import { CreateUsersUseCase } from '@usecases/CreateUsersUseCase';
import { DeleteUsersUseCase } from '@usecases/DeleteUsersUseCase';
import { FindUserByTenantIdUseCase } from '@usecases/FindUserByTenantIdUseCase';
import { UpdateSubscriptionsUseCase } from '@usecases/UpdateSubscriptionsUseCase';
import { UpdateUsersUseCase } from '@usecases/UpdateUsersUseCase';
import { Container, interfaces } from 'inversify';

const container: interfaces.Container = new Container();

// General
container.bind('Settings').to(Settings).inSingletonScope();

// Services
container
  .bind('Logger')
  .toDynamicValue(() => {
    const settings = container.get('Settings') as Settings;
    const { applicationName, logLevel } = settings.env;
    return new Logger(logLevel, applicationName);
  })
  .inSingletonScope();

// UseCases
container.bind('CreateUsersUseCase').to(CreateUsersUseCase).inSingletonScope();
container.bind('UpdateUsersUseCase').to(UpdateUsersUseCase).inSingletonScope();
container.bind('DeleteUsersUseCase').to(DeleteUsersUseCase).inSingletonScope();
container.bind('FindUserByTenantIdUseCase').to(FindUserByTenantIdUseCase).inSingletonScope();
container.bind('UpdateSubscriptionsUseCase').to(UpdateSubscriptionsUseCase).inSingletonScope();

// Model
container.bind('UserModel').to(UserModel).inSingletonScope();

// Infrastructures
container.bind('UsersRepository').to(UsersRepository).inSingletonScope();
container.bind('AuthService').to(SupabaseService).inSingletonScope();
container.bind('PaymentGatewayService').to(StripeService).inSingletonScope();

// Function
container.bind('CreateUsersController').to(CreateUsersController).inSingletonScope();
container.bind('UpdateUsersController').to(UpdateUsersController).inSingletonScope();
container.bind('DeleteUsersController').to(DeleteUsersController).inSingletonScope();
container.bind('FindUserByTenantIdController').to(FindUserByTenantIdController).inSingletonScope();
container.bind('ReceiveStripeEventsController').to(ReceiveStripeEventsController).inSingletonScope();

// Handlers
container.bind('CreateSubscriptionHandler').to(CreateSubscriptionHandler).inSingletonScope();
container.bind('DeleteSubscriptionHandler').to(DeleteSubscriptionHandler).inSingletonScope();
container.bind('UpdateSubscriptionHandler').to(UpdateSubscriptionHandler).inSingletonScope();

export { container };
