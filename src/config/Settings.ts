import { EnvironmentValidationError } from '@domain/errors/EnvironmentValidationError';
import { toCamelCase } from '@kernelsoftware/shared';
import { injectable } from 'inversify';
import * as yup from 'yup';

type EnvironmentVariables = ReturnType<(typeof envSchema)['validateSync']>;

const baseSchema = {
  applicationName: yup.string().required(),
  logLevel: yup.string().default('info').oneOf(['info', 'debug', 'warn', 'error']),
  awsRegion: yup.string().required(),
  usersTable: yup.string().required(),
  supabaseUrl: yup.string().required(),
  supabaseApiKey: yup.string().required(),
  stripeApiKey: yup.string().required(),
  stripeWebhookKey: yup.string().required(),
};

const productionSchema = {
  awsAccessKeyId: yup.string().required(),
  awsSecretAccessKey: yup.string().required(),
  awsSessionToken: yup.string().required(),
};

const developmentSchema = {
  awsAccessKeyId: yup.string().notRequired(),
  awsSecretAccessKey: yup.string().notRequired(),
  awsSessionToken: yup.string().notRequired(),
};

const finalSchema =
  process.env.NODE_ENV === 'development' ? { ...baseSchema, ...developmentSchema } : { ...baseSchema, ...productionSchema };

const envSchema = yup.object().shape(finalSchema);

@injectable()
export class Settings {
  public env: EnvironmentVariables;

  constructor() {
    this.tolowerCasedEnv();
    this.validateEnvironmentVariables();
  }

  public validateEnvironmentVariables(): void {
    try {
      this.env = envSchema.validateSync(toCamelCase(process.env), { stripUnknown: true });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        throw new EnvironmentValidationError(`Environment variables validation failed: ${error.message}`);
      } else {
        throw new EnvironmentValidationError('Environment variables validation failed for an unknown reason');
      }
    }
  }

  public tolowerCasedEnv() {
    process.env = Object.fromEntries(Object.entries(process.env).map(([key, value]) => [key.toLowerCase(), value]));
  }
}
