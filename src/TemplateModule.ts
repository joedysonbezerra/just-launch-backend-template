import { DeleteExamplesController } from '@applications/http/deleteExamples/controllers/DeleteExamplesController';
import { FindExampleByIdController } from '@applications/http/findExample/controllers/FindExampleByIdController';
import { UpsertExamplesController } from '@applications/http/upsertExamples/controllers/UpsertExamplesController';
import { Settings } from '@config/Settings';
import { ExampleModel } from '@infrastructures/dynamoDB/models/ExampleModel';
import { ExamplesRepository } from '@infrastructures/repositories/ExamplesRepository';
import { Logger } from '@kernelsoftware/shared';
import { DeleteExamplesUseCase } from '@usecases/DeleteExamplesUseCase';
import { FindExampleByIdUseCase } from '@usecases/FindExampleByIdUseCase';
import { UpsertExamplesUseCase } from '@usecases/UpsertExamplesUseCase';
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
container.bind('UpsertExamplesUseCase').to(UpsertExamplesUseCase).inSingletonScope();
container.bind('FindExampleByIdUseCase').to(FindExampleByIdUseCase).inSingletonScope();
container.bind('DeleteExamplesUseCase').to(DeleteExamplesUseCase).inSingletonScope();

// Model
container.bind('ExampleModel').to(ExampleModel).inSingletonScope();

// Infrastructures
container.bind('ExamplesRepository').to(ExamplesRepository).inSingletonScope();

// Function
container.bind('UpsertExamplesController').to(UpsertExamplesController).inSingletonScope();
container.bind('FindExampleByIdController').to(FindExampleByIdController).inSingletonScope();
container.bind('DeleteExamplesController').to(DeleteExamplesController).inSingletonScope();

export { container };
