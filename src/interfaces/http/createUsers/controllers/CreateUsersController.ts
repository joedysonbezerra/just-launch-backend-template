import { ICreateUsersUseCase } from '@domain/contracts/usecases/ICreateUsersUseCase';
import { RequestToCreateUsersDTO } from '@domain/dtos/RequestToCreateUsersDTO';
import { BaseController, ErrorHttpHandler } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateUsersController extends BaseController<APIGatewayEvent> {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('CreateUsersUseCase')
    private createUsersUseCase: ICreateUsersUseCase
  ) {
    super();
    this.className = 'CreateUsersController';
  }

  public async handle(event: APIGatewayEvent): Promise<{ statusCode: StatusCodes; body: string }> {
    const context = `${this.className}.handle`;

    this.logger.info('It is starting the validation of the request', {
      context,
    });

    const { body } = event;

    if (!body) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    const { entity, errors } = RequestToCreateUsersDTO.validate(RequestToCreateUsersDTO, {
      ...JSON.parse(body),
    });

    if (errors.length !== 0) {
      this.logger.info('Validation fails', { errors });
      return new ErrorHttpHandler(this.logger).handleValidationErrors(errors, context);
    }
    this.logger.info('It is starting the usecase', { context, email: entity.email, name: entity.name });

    const result = await this.createUsersUseCase.execute(entity);

    this.logger.info('It is starting the creation of user', { context });
    const { statusCode, body: data } = this.handleResult(result);

    this.logger.info('Result of execution', { statusCode, data, context });
    return {
      statusCode,
      body: data,
    };
  }
}
