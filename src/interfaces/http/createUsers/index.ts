import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/UsersModule';

// NODE_ENV=development serverless invoke local --function createUsers --stage staging -p src/interfaces/http/createUsers/events/request.json --aws-profile kernelstudio
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const createUsersController = container.get('CreateUsersController') as BaseController<APIGatewayEvent>;
  const response = await createUsersController.handle(event);
  return response;
}
