import { IPaymentGatewayService } from '@domain/contracts/infrastructures/IPaymentGatewayService';
import { IEventHandler } from '@domain/contracts/interfaces/IEventHandler';
import { User } from '@domain/entities/User';
import { BaseController } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class ReceiveStripeEventsController extends BaseController<APIGatewayEvent> {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('PaymentGatewayService')
    private paymentGatewayService: IPaymentGatewayService,
    @inject('CreateSubscriptionHandler')
    private createSubscriptionHandler: IEventHandler<User>,
    @inject('DeleteSubscriptionHandler')
    private deleteSubscriptionHandler: IEventHandler<User>,
    @inject('UpdateSubscriptionHandler')
    private updateSubscriptionHandler: IEventHandler<User>
  ) {
    super();
    this.className = 'ReceiveStripeEventsController';
  }

  public async handle(event: APIGatewayEvent): Promise<{ statusCode: StatusCodes; body: string }> {
    const context = `${this.className}.handle`;

    this.logger.info('Receiving events of stripe', {
      event,
      context,
    });
    const { headers, body } = event;
    const stripeSignature = headers['Stripe-Signature'];

    if (!body || !stripeSignature) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    const stripeEvents = await this.paymentGatewayService.constructWebhookEvent(body, stripeSignature);

    if (stripeEvents.isError) {
      this.logger.error('Error on execute - PaymentGatewayService', stripeEvents.errorMessage, {
        context,
      });
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    this.logger.info('Stripe events', {
      context,
      type: stripeEvents.data.type,
    });

    const eventData = stripeEvents.data.data.object as unknown as Record<string, unknown>;

    const allHandlers = [
      this.createSubscriptionHandler,
      this.deleteSubscriptionHandler,
      this.updateSubscriptionHandler,
    ] as IEventHandler<User>[];

    const handler = allHandlers.find((process) => process.canProcess(stripeEvents.data.type));

    if (!handler) {
      this.logger.error('Error on find - Handler', {
        context,
      });

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }
    this.logger.info('It is starting the handler', { context });
    const result = await handler.process(eventData);

    const { statusCode, body: data } = this.handleResult(result);

    this.logger.info('Result of execution', { statusCode, data, context });
    return {
      statusCode,
      body: data,
    };
  }
}
