import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/UsersModule';

// NODE_ENV=development serverless invoke local --function findUserByTenantId --stage staging -p src/interfaces/http/findUserByTenantId/events/request.json --aws-profile kernelstudio
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const findUserByTenantId = container.get('FindUserByTenantIdController') as BaseController<APIGatewayEvent>;
  const response = await findUserByTenantId.handle(event);
  return response;
}
