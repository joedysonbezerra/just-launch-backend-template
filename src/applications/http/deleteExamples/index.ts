import { BaseController } from '@kernelsoftware/shared';
import { IHttpResponse } from '@kernelsoftware/shared/dist/domain/contracts/interfaces/http/responses/IHttpResponse';
import { APIGatewayEvent } from 'aws-lambda';
import 'reflect-metadata';
import { container } from 'src/TemplateModule';

// NODE_ENV=development serverless invoke local --function deleteExamples --stage staging -p src/interfaces/http/deleteExamples/events/request.json
export async function main(event: APIGatewayEvent): Promise<IHttpResponse> {
  const deleteExamplesController = container.get('DeleteExamplesController') as BaseController<APIGatewayEvent>;
  const response = await deleteExamplesController.handle(event);
  return response;
}
