import { RequestToUpsertExampleDTO } from '@domain/dtos/RequestToCreateExampleDTO';
import { Example } from '@domain/entities/Example';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface IUpsertExamplesUseCase extends IUseCase<RequestToUpsertExampleDTO, Example> {
  execute(data: RequestToUpsertExampleDTO): Promise<ApplicationResult<Example>>;
}
