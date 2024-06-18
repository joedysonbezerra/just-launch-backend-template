import { Settings } from '@config/Settings';
import { IEmailMarketingService } from '@domain/contracts/infrastructures/IEmailMarketingService';
import { User } from '@domain/entities/User';
import { ApplicationResult, ApplicationResultError, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import axios from 'axios';
import { inject, injectable } from 'inversify';

@injectable()
export class BrevoService implements IEmailMarketingService {
  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('Settings')
    private settings: Settings
  ) {
    this.className = 'BrevoService';
  }

  async createContacts(data: User): Promise<ApplicationResult<boolean>> {
    const context = `${this.className}.createContacts`;

    try {
      this.logger.info('Start createContacts item on brevo', {
        email: data.email,
        context,
      });

      await axios.post(
        `${this.settings.env.brevoUrl}/contacts`,
        {
          email: data.email,
          ext_id: data.tenantId,
          attributes: {
            FNAME: data.getFirstName(),
          },
          emailBlacklisted: false,
          smsBlacklisted: false,
          listIds: [6],
          updateEnabled: false,
        },
        {
          headers: {
            accept: 'application/json',
            'api-key': this.settings.env.brevoApiKey,
            'content-type': 'application/json',
          },
        }
      );

      this.logger.info('Successfully inserted contact on brevo', {
        id: data.email,
        context,
      });

      return new ApplicationResultSuccess(true);
    } catch (error: unknown) {
      this.logger.error('User was create - server error BrevoService', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t create - server error BrevoService', error);
    }
  }
}
