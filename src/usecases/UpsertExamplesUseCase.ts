import { IExamplesRepository } from '@domain/contracts/infrastructures/IExamplesRepository';
import { IUpsertExamplesUseCase } from '@domain/contracts/usecases/IUpsertExamplesUseCase';
import { RequestToUpsertExampleDTO } from '@domain/dtos/RequestToCreateExampleDTO';
import { Example } from '@domain/entities/Example';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class UpsertExamplesUseCase implements IUpsertExamplesUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('ExamplesRepository')
    private exampleRepository: IExamplesRepository<Example>
  ) {
    this.className = 'ExampleUseCase';
  }

  async execute(data: RequestToUpsertExampleDTO): Promise<ApplicationResult<Example>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      text: data.text,
      context,
    });

    const exampleDomain = Example.fromPlain(Example, {
      text: data.text,
    });

    const result = await this.exampleRepository.upsert(exampleDomain);

    if (result.isError) {
      this.logger.error('Error on execute - ExamplesRepository', result.errorMessage, {
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
