import { IUpdateUsersUseCase } from '@domain/contracts/usecases/IUpdateUsersUseCase';
import { RequestToUpdateUsersDTO } from '@domain/dtos/RequestToUpdateUsersDTO';
import { BaseController, ErrorHttpHandler } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateUsersController extends BaseController<APIGatewayEvent> {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UpdateUsersUseCase')
    private updateUsersUseCase: IUpdateUsersUseCase
  ) {
    super();
    this.className = 'UpdateUsersController';
  }

  public async handle(event: APIGatewayEvent): Promise<{ statusCode: StatusCodes; body: string }> {
    const context = `${this.className}.handle`;

    this.logger.info('It is starting the validation of the request', {
      context,
      tenantId: event.headers['x-tenant-id'],
    });

    const { body, headers } = event;

    if (!body) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    const { entity, errors } = RequestToUpdateUsersDTO.validate(RequestToUpdateUsersDTO, {
      ...JSON.parse(body),
      id: headers['x-tenant-id'],
    });

    if (errors.length !== 0) {
      this.logger.info('Validation fails', { errors });
      return new ErrorHttpHandler(this.logger).handleValidationErrors(errors, context);
    }
    this.logger.info('It is starting the usecase', { context, id: entity.id });

    const result = await this.updateUsersUseCase.execute(entity);

    this.logger.info('It is starting the update of user', { context });
    const { statusCode, body: data } = this.handleResult(result);

    this.logger.info('Result of execution', { statusCode, data, context });
    return {
      statusCode,
      body: data,
    };
  }
}
