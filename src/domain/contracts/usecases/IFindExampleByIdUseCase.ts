import { RequestToFindExampleByIdDTO } from '@domain/dtos/RequestToFindExampleByIdDTO';
import { Example } from '@domain/entities/Example';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface IFindExampleByIdUseCase extends IUseCase<RequestToFindExampleByIdDTO, Example> {
  execute(data: RequestToFindExampleByIdDTO): Promise<ApplicationResult<Example>>;
}
