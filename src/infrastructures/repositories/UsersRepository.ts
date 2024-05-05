import { Settings } from '@config/Settings';
import { IUsersRepository } from '@domain/contracts/infrastructures/IUsersRepository';
import { User } from '@domain/entities/User';
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
export class UsersRepository implements IUsersRepository<User> {
  private config: AWSConfig;

  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('UserModel')
    private userModel: IDatabaseModel<ModelType<AnyItem>>,
    @inject('Settings')
    private settings: Settings
  ) {
    this.className = 'UsersRepository';
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

  async upsert(data: User): Promise<ApplicationResult<User>> {
    const context = `${this.className}.upsert`;

    try {
      this.logger.info('Start upsert item from database', {
        id: data.toDatabase().id,
        context,
      });

      const result = await DynamoHelper.upsert(this.config, this.userModel.model, data.toDatabase());

      this.logger.info('Successfully inserted or updated item from database', {
        data,
        result,
        context,
      });

      const user = User.fromDatabaseToDomain(result);

      return new ApplicationResultSuccess(user);
    } catch (error: unknown) {
      this.logger.error('User was create - server error repository', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t create - server error repository', error);
    }
  }

  async findOneByTenantId(id: string | undefined): Promise<ApplicationResult<User>> {
    const context = `${this.className}.findOneByTenantId`;

    try {
      this.logger.info('Start find of item from database', {
        id,
        context,
      });
      if (!id) {
        return new ApplicationResultNotFound('User not found');
      }

      const [result] = await this.userModel.model.query('tenant_id').eq(id).using('TenantIdCreatedAtIndex').limit(1).exec();

      if (!result) {
        return new ApplicationResultNotFound('User not found!');
      }

      const user = User.fromDatabaseToDomain(result);

      return new ApplicationResultSuccess(user);
    } catch (error: unknown) {
      this.logger.error('User wasn`t found - server error repository', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t found - server error repository', error);
    }
  }

  async findOneById(id: string | undefined): Promise<ApplicationResult<User>> {
    const context = `${this.className}.findOneById`;

    try {
      this.logger.info('Start find of item from database', {
        id,
        context,
      });
      if (!id) {
        return new ApplicationResultNotFound('User not found');
      }

      const result = await DynamoHelper.findOne(this.userModel.model, 'id', id);

      if (!result) {
        return new ApplicationResultNotFound('User not found!');
      }

      const user = User.fromDatabaseToDomain(result);

      return new ApplicationResultSuccess(user);
    } catch (error: unknown) {
      this.logger.error('User wasn`t found - server error repository', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t found - server error repository', error);
    }
  }

  async delete(data: User): Promise<ApplicationResult<boolean>> {
    const context = `${this.className}.delete`;

    try {
      this.logger.info('Start delete item from database', {
        id: data.toDatabase().id,
        context,
      });

      const item = data.toDatabase();
      await this.userModel.model.delete({
        id: item.id,
        created_at: item.created_at,
      });

      return new ApplicationResultSuccess(true);
    } catch (error: unknown) {
      this.logger.error('User wasn`t delete - server error repository', error, {
        context,
      });
      return new ApplicationResultError('User wasn`t delete - server error repository', error);
    }
  }

  async findByCustomerId(id: string): Promise<ApplicationResult<User>> {
    const context = `${this.className}.findByCustomerId`;

    try {
      this.logger.info('Start findByCustomerId item from database', {
        id,
        context,
      });

      const [result] = await this.userModel.model.query('customer_id').eq(id).exec();

      if (!result) {
        return new ApplicationResultNotFound('User not found!');
      }

      const user = User.fromDatabaseToDomain(result);

      return new ApplicationResultSuccess(user);
    } catch (error: unknown) {
      this.logger.error('User wasn`t found- server error repository', error, {
        context,
        id,
      });
      return new ApplicationResultError('User wasn`t found - server error repository', error);
    }
  }
}
