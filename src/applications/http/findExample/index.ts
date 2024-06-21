import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/TemplateModule';

// NODE_ENV=development serverless invoke local --function findExampleById --stage staging -p src/applications/http/findExampleById/events/request.json
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const findExampleById = container.get('FindExampleByIdController') as BaseController<APIGatewayEvent>;
  const response = await findExampleById.handle(event);
  return response;
}
