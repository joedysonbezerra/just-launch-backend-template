import { Settings } from '@config/Settings';
import { IDatabaseModel } from '@kernelsoftware/shared';
import * as dynamoose from 'dynamoose';
import { ModelType } from 'dynamoose/dist/General';
import { AnyItem } from 'dynamoose/dist/Item';
import { inject, injectable } from 'inversify';

@injectable()
export class ExampleModel implements IDatabaseModel<ModelType<AnyItem>> {
  public tableName: string;

  public model: ModelType<AnyItem>;

  constructor(
    @inject('Settings')
    private settings: Settings
  ) {
    this.tableName = this.settings.env.examplesTable;
    this.initModel();
  }

  public initModel(): void {
    const schema = new dynamoose.Schema(
      {
        id: {
          hashKey: true,
          type: String,
        },
        text: {
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
