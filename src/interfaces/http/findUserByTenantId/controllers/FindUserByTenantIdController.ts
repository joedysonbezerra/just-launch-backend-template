import { IFindUserByTenantIdUseCase } from '@domain/contracts/usecases/IFindUserByTenantIdUseCase';
import { RequestToFindUserByTenantIdDTO } from '@domain/dtos/RequestToFindUserByTenantIdDTO';
import { BaseController, ErrorHttpHandler } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class FindUserByTenantIdController extends BaseController<APIGatewayEvent> {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('FindUserByTenantIdUseCase')
    private findByIdUserUseCase: IFindUserByTenantIdUseCase
  ) {
    super();
    this.className = 'FindUserByTenantIdController';
  }

  public async handle(event: APIGatewayEvent): Promise<{ statusCode: StatusCodes; body: string }> {
    const context = `${this.className}.handle`;

    this.logger.info('It is starting the validation of the request', {
      request: event.pathParameters,
      context,
    });

    const { pathParameters } = event;

    const { entity, errors } = RequestToFindUserByTenantIdDTO.validate(RequestToFindUserByTenantIdDTO, {
      id: pathParameters?.id,
    });

    if (errors.length !== 0) {
      this.logger.info('Validation fails', { errors });
      return new ErrorHttpHandler(this.logger).handleValidationErrors(errors, context);
    }
    this.logger.info('It is starting the usecase', { context });

    const result = await this.findByIdUserUseCase.execute(entity);

    this.logger.info('It is starting the Find All Users By TenantId', { context });
    const { statusCode, body: data } = this.handleResult(result);

    this.logger.info('Result of execution', { statusCode, data, context });
    return {
      statusCode,
      body: data,
    };
  }
}
