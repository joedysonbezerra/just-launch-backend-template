import { Settings } from '@config/Settings';
import { IExamplesRepository } from '@domain/contracts/infrastructures/IExamplesRepository';
import { Example } from '@domain/entities/Example';
import {
  AWSConfig,
  ApplicationResult,
  ApplicationResultError,
  ApplicationResultNotFound,
  ApplicationResultSuccess,
  DynamoHelper,
  IDatabaseModel,
} from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import * as dynamoose from 'dynamoose';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import { inject, injectable } from 'inversify';

@injectable()
export class ExamplesRepository implements IExamplesRepository<Example> {
  private config: AWSConfig;

  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('ExampleModel')
    private exampleModel: IDatabaseModel<ModelType<AnyItem>>,
    @inject('Settings')
    private settings: Settings
  ) {
    this.className = 'ExamplesRepository';
    this.config = {
      credentials: {
        accessKeyId: this.settings.env.awsAccessKeyId as string,
        secretAccessKey: this.settings.env.awsSecretAccessKey as string,
        sessionToken: this.settings.env.awsSessionToken as string,
      },
      region: this.settings.env.awsRegion as string,
    };

    const ddb = new dynamoose.aws.ddb.DynamoDB(this.config);

    dynamoose.aws.ddb.set(ddb);
  }

  async upsert(data: Example): Promise<ApplicationResult<Example>> {
    const context = `${this.className}.upsert`;

    try {
      this.logger.info('Start upsert item from database', {
        id: data.toDatabase().id,
        context,
      });

      const result = await DynamoHelper.upsert(this.config, this.exampleModel.model, data.toDatabase());

      this.logger.info('Successfully inserted or updated item from database', {
        data,
        result,
        context,
      });

      const example = Example.fromDatabaseToDomain(result);

      return new ApplicationResultSuccess(example);
    } catch (error: unknown) {
      this.logger.error('Example was create - server error repository', error, {
        context,
      });

      return new ApplicationResultError('Example wasn`t create - server error repository', error);
    }
  }

  async findOneById(id: string | undefined): Promise<ApplicationResult<Example>> {
    const context = `${this.className}.findOneById`;

    try {
      this.logger.info('Start find of item from database', {
        id,
        context,
      });
      if (!id) {
        return new ApplicationResultNotFound('Example not found');
      }

      const result = await DynamoHelper.findOne(this.exampleModel.model, 'id', id);

      if (!result) {
        return new ApplicationResultNotFound('Example not found!');
      }

      const example = Example.fromDatabaseToDomain(result);

      return new ApplicationResultSuccess(example);
    } catch (error: unknown) {
      this.logger.error('Example wasn`t found - server error repository', error, {
        context,
      });

      return new ApplicationResultError('Example wasn`t found - server error repository', error);
    }
  }

  async delete(data: Example): Promise<ApplicationResult<boolean>> {
    const context = `${this.className}.delete`;

    try {
      this.logger.info('Start delete item from database', {
        id: data.toDatabase().id,
        context,
      });

      const item = data.toDatabase();
      await this.exampleModel.model.delete({
        id: item.id,
        created_at: item.created_at,
      });

      return new ApplicationResultSuccess(true);
    } catch (error: unknown) {
      this.logger.error('Example wasn`t delete - server error repository', error, {
        context,
      });
      return new ApplicationResultError('Example wasn`t delete - server error repository', error);
    }
  }
}
