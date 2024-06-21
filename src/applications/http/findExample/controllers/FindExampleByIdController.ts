import { IFindExampleByIdUseCase } from '@domain/contracts/usecases/IFindExampleByIdUseCase';
import { RequestToFindExampleByIdDTO } from '@domain/dtos/RequestToFindExampleByIdDTO';
import { BaseController, ErrorHttpHandler } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class FindExampleByIdController extends BaseController<APIGatewayEvent> {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('FindExampleByIdUseCase')
    private findExampleByIdUseCase: IFindExampleByIdUseCase
  ) {
    super();
    this.className = 'FindExampleByIdController';
  }

  public async handle(event: APIGatewayEvent): Promise<{ statusCode: StatusCodes; body: string }> {
    const context = `${this.className}.handle`;

    this.logger.info('It is starting the validation of the request', {
      request: event.pathParameters,
      context,
    });

    const { pathParameters } = event;

    const { entity, errors } = RequestToFindExampleByIdDTO.validate(RequestToFindExampleByIdDTO, {
      id: pathParameters?.id,
    });

    if (errors.length !== 0) {
      this.logger.info('Validation fails', { errors });
      return new ErrorHttpHandler(this.logger).handleValidationErrors(errors, context);
    }

    this.logger.info('It is starting the usecase', { context });

    const result = await this.findExampleByIdUseCase.execute(entity);

    this.logger.info('It is starting the Find Example By Id', { context });
    const { statusCode, body: data } = this.handleResult(result);

    this.logger.info('Result of execution', { statusCode, data, context });
    return {
      statusCode,
      body: data,
    };
  }
}
