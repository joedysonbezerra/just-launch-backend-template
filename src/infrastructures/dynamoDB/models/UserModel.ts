import { Settings } from '@config/Settings';
import { IDatabaseModel } from '@kernelsoftware/shared';
import * as dynamoose from 'dynamoose';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import { inject, injectable } from 'inversify';

@injectable()
export class UserModel implements IDatabaseModel<ModelType<AnyItem>> {
  public tableName: string;

  public model: ModelType<AnyItem>;

  constructor(
    @inject('Settings')
    private settings: Settings
  ) {
    this.tableName = this.settings.env.usersTable;
    this.initModel();
  }

  public initModel(): void {
    const schema = new dynamoose.Schema(
      {
        id: {
          hashKey: true,
          type: String,
        },
        tenant_id: {
          type: String,
          index: {
            name: 'TenantIdCreatedAtIndex',
            rangeKey: 'createdAt',
          },
        },
        name: {
          type: String,
        },
        phone: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          index: {
            name: 'EmailCreatedAtIndex',
            rangeKey: 'createdAt',
          },
        },
        subscription_id: {
          type: String,
          required: false,
        },
        is_confirmed: {
          type: Boolean,
          default: false,
        },
        customer_id: {
          type: String,
          index: {
            name: 'CustomerIdCreatedAtIndex',
            rangeKey: 'createdAt',
          },
        },
        referral_id: {
          type: String,
        },
        subscription_status: {
          type: String,
        },
        created_at: {
          type: String,
          rangeKey: true,
        },
      },
      {
        timestamps: {
          updatedAt: ['updated_at'],
        },
      }
    );
    this.model = dynamoose.model(this.tableName, schema, {
      create: false,
      waitForActive: false,
    });
  }
}
