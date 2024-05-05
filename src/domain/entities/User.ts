import { SubscriptionStatus } from '@domain/enums/SubscriptionStatus';
import { BaseEntity } from '@kernelsoftware/shared';

class User extends BaseEntity {
  name: string;

  phone?: string;

  customerId: string;

  subscriptionId?: string;

  subscriptionStatus: SubscriptionStatus;

  email: string;

  tenantId: string;

  referralId: string;

  freeTrial?: boolean;

  planName?: string;

  isConfirmed: boolean;

  toDatabase() {
    return {
      id: this.uuid,
      name: this.name,
      email: this.email,
      phone: this.phone,
      tenant_id: this.tenantId,
      customer_id: this.customerId,
      subscription_id: this.subscriptionId,
      subscription_status: this.subscriptionStatus,
      referral_id: this.referralId,
      is_confirmed: this.setDefaultConfirmation(this.isConfirmed),
      created_at: new Date(this.created_at).toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static fromDatabaseToDomain(data: Record<string, unknown>): User {
    return User.fromPlain(User, data);
  }

  setDefaultConfirmation(isConfirmed: boolean | undefined): boolean {
    return isConfirmed !== undefined ? isConfirmed : false;
  }

  getFirstName(): string {
    return this.name.split(' ')[0];
  }
}

export { User };
