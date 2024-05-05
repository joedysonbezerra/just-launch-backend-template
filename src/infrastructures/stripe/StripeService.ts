import { Settings } from '@config/Settings';
import { IPaymentGatewayService } from '@domain/contracts/infrastructures/IPaymentGatewayService';
import { PaymentGatewayServiceDTO } from '@domain/dtos/PaymentGatewayServiceDTO';
import { Plans } from '@domain/enums/Plans';
import {
  ApplicationResult,
  ApplicationResultError,
  ApplicationResultNotFound,
  ApplicationResultSuccess,
} from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { inject, injectable } from 'inversify';
import Stripe from 'stripe';

@injectable()
export class StripeService implements IPaymentGatewayService {
  private stripe: Stripe;

  className: string;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('Settings')
    private settings: Settings
  ) {
    this.className = 'StripeService';
    this.stripe = new Stripe(this.settings.env.stripeApiKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  async createCustomer(body: PaymentGatewayServiceDTO): Promise<ApplicationResult<string>> {
    const context = `${this.className}.createCustomer`;

    try {
      this.logger.info('Start createCustomer item on stripe', {
        email: body.email,
        context,
      });
      const customer = await this.stripe.customers.create({
        name: body.name,
        email: body.email,
        metadata: {
          userId: body.userId,
          tenantId: body.tenantId,
        },
      });

      if (!customer.id) {
        this.logger.error('User was create - stripe error StripeService', customer, {
          context,
        });
        return new ApplicationResultError('User wasn`t create - stripe error StripeService');
      }

      this.logger.info('Successfully inserted customer on stripe', {
        id: customer.id,
        context,
      });

      return new ApplicationResultSuccess(customer.id);
    } catch (error: unknown) {
      this.logger.error('User was create - server error StripeService', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t create - server error StripeService', error);
    }
  }

  async deleteCustomer(id: string): Promise<ApplicationResult<boolean>> {
    const context = `${this.className}.deleteCustomer`;

    try {
      this.logger.info('Start deleteCustomer item on stripe', {
        id,
        context,
      });
      await this.stripe.customers.del(id);

      this.logger.info('Successfully deleted customer on stripe', {
        id,
        context,
      });

      return new ApplicationResultSuccess(true);
    } catch (error: unknown) {
      this.logger.error('User was delete - server error StripeService', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t delete - server error StripeService', error);
    }
  }

  async fetchSubscriptionName(id: string): Promise<ApplicationResult<Plans>> {
    const context = `${this.className}.fetchSubscription`;

    try {
      this.logger.info('Start fetchSubscription item on stripe', {
        id,
        context,
      });

      const subscription = await this.stripe.subscriptions.retrieve(id);

      if (!subscription.items.data[0].plan.nickname) {
        this.logger.error('Subscription wasn`t found - stripe error StripeService', subscription, {
          context,
        });
        return new ApplicationResultNotFound('Subscription wasn`t found - stripe error StripeService');
      }

      this.logger.info('Successfully fetch subscription on stripe', {
        id,
        context,
      });

      return new ApplicationResultSuccess(subscription.items.data[0].plan.nickname as Plans);
    } catch (error: unknown) {
      this.logger.error('Fetch Subscription - server error StripeService', error, {
        context,
      });

      return new ApplicationResultError('Fetch Subscription - server error StripeService', error);
    }
  }

  async constructWebhookEvent(body: string, signature: string): Promise<ApplicationResult<Stripe.Event>> {
    const context = `${this.className}.constructWebhookEvent`;

    try {
      this.logger.info('Start constructWebhook event on stripe', {
        context,
      });

      const stripeEvent = await this.stripe.webhooks.constructEvent(body, signature, this.settings.env.stripeWebhookKey);

      this.logger.info('Successfully constructWebhookEvent on stripe', {
        context,
      });

      return new ApplicationResultSuccess(stripeEvent);
    } catch (error) {
      this.logger.error('Event wasn`t create - server error StripeService', error, {
        context,
      });
      return new ApplicationResultError('Event wasn`t create - server error StripeService', error);
    }
  }
}
