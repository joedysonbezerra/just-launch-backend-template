import { PaymentGatewayServiceDTO } from '@domain/dtos/PaymentGatewayServiceDTO';
import { Plans } from '@domain/enums/Plans';
import { ApplicationResult } from '@kernelsoftware/shared';
import Stripe from 'stripe';

export interface IPaymentGatewayService {
  createCustomer(data: PaymentGatewayServiceDTO): Promise<ApplicationResult<string>>;
  deleteCustomer(id: string): Promise<ApplicationResult<boolean>>;
  constructWebhookEvent(body: string, signature: string): Promise<ApplicationResult<Stripe.Event>>;
  fetchSubscriptionName(id: string): Promise<ApplicationResult<Plans>>;
}
