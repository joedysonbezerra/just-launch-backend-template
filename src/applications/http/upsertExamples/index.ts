import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/TemplateModule';

// NODE_ENV=development serverless invoke local --function upsertExamples --stage staging -p src/applications/http/upsertExamples/events/request.json
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const upsertExamplesController = container.get('UpsertExamplesController') as BaseController<APIGatewayEvent>;
  const response = await upsertExamplesController.handle(event);
  return response;
}
