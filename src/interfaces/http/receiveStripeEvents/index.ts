import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/UsersModule';

export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const receiveStripeEventsController = container.get('ReceiveStripeEventsController') as BaseController<APIGatewayEvent>;
  const response = await receiveStripeEventsController.handle(event);
  return response;
}
