import { IExamplesRepository } from '@domain/contracts/infrastructures/IExamplesRepository';
import { IDeleteExamplesUseCase } from '@domain/contracts/usecases/IDeleteExamplesUseCase';
import { RequestToDeleteExampleDTO } from '@domain/dtos/RequestToDeleteExampleDTO';
import { Example } from '@domain/entities/Example';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteExamplesUseCase implements IDeleteExamplesUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('ExamplesRepository')
    private examplesRepository: IExamplesRepository<Example>
  ) {
    this.className = 'DeleteExamplesUseCase';
  }

  async execute(data: RequestToDeleteExampleDTO): Promise<ApplicationResult<boolean>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      data,
      context,
    });

    const example = await this.examplesRepository.findOneById(data.id);

    if (example.isError) {
      this.logger.error('Error on execute', example.errorMessage, {
        context,
      });
      return example;
    }

    const result = await this.examplesRepository.delete(example.data);

    if (result.isError) {
      this.logger.error('Error on execute', result.errorMessage, {
        context,
      });
      return result;
    }

    this.logger.info('Successful execution', {
      context,
    });
    return new ApplicationResultSuccess(true);
  }
}
