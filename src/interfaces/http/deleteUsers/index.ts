import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/UsersModule';

// NODE_ENV=development serverless invoke local --function deleteUsers --stage staging -p src/interfaces/http/deleteUsers/events/request.json --aws-profile kernelstudio
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const deleteUsersController = container.get('DeleteUsersController') as BaseController<APIGatewayEvent>;
  const response = await deleteUsersController.handle(event);
  return response;
}
