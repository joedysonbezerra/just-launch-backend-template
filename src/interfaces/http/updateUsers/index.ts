import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/UsersModule';

// NODE_ENV=development serverless invoke local --function updateUsers --stage staging -p src/interfaces/http/updateUsers/events/request.json --aws-profile kernelstudio
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const updateUsersController = container.get('UpdateUsersController') as BaseController<APIGatewayEvent>;
  const response = await updateUsersController.handle(event);
  return response;
}
