import { RequestToDeleteExampleDTO } from '@domain/dtos/RequestToDeleteExampleDTO';
import { ApplicationResult, IUseCase } from '@kernelsoftware/shared';

export interface IDeleteExamplesUseCase extends IUseCase<RequestToDeleteExampleDTO, boolean> {
  execute(data: RequestToDeleteExampleDTO): Promise<ApplicationResult<boolean>>;
}
