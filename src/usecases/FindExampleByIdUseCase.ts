import { IExamplesRepository } from '@domain/contracts/infrastructures/IExamplesRepository';
import { IFindExampleByIdUseCase } from '@domain/contracts/usecases/IFindExampleByIdUseCase';
import { RequestToFindExampleByIdDTO } from '@domain/dtos/RequestToFindExampleByIdDTO';
import { Example } from '@domain/entities/Example';
import { ApplicationResult, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';

@injectable()
export class FindExampleByIdUseCase implements IFindExampleByIdUseCase {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('ExamplesRepository')
    private exampleRepository: IExamplesRepository<Example>
  ) {
    this.className = 'FindExampleByIdUseCase';
  }

  async execute(data: RequestToFindExampleByIdDTO): Promise<ApplicationResult<Example>> {
    const context = `${this.className}.execute`;

    this.logger.info('Start execute', {
      data,
      context,
    });

    const result = await this.exampleRepository.findOneById(data.id);

    if (result.isError) {
      this.logger.error('Error on execute', result.errorMessage, {
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
