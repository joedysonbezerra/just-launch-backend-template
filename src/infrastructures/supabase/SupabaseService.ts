import { Settings } from '@config/Settings';
import { IAuthService } from '@domain/contracts/infrastructures/IAuthService';
import { RequestToCreateUsersDTO } from '@domain/dtos/RequestToCreateUsersDTO';
import { ApplicationResult, ApplicationResultError, ApplicationResultSuccess } from '@kernelsoftware/shared';
import { ILogger } from '@kernelsoftware/shared/dist/domain/contracts/infrastructure/ILogger';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { inject, injectable } from 'inversify';

@injectable()
export class SupabaseService implements IAuthService {
  private supabase: SupabaseClient;

  constructor(
    @inject('Logger')
    private logger: ILogger,
    @inject('Settings')
    private settings: Settings
  ) {
    this.supabase = createClient(this.settings.env.supabaseUrl, this.settings.env.supabaseApiKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async signUp(body: RequestToCreateUsersDTO): Promise<ApplicationResult<string>> {
    const context = 'SupabaseService.signUp';

    try {
      this.logger.info('Start signup item from supabase', {
        email: body.email,
        context,
      });

      const { data, error } = await this.supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
        user_metadata: { name: body.name, source: body.source },
        email_confirm: true,
      });

      if (error || !data.user?.id) {
        this.logger.error('User was create - supabase error repository', error, {
          context,
        });
        return new ApplicationResultError('User wasn`t create - supabase error repository', error);
      }

      this.logger.info('Successfully inserted item on supabase', {
        id: data.user.id,
        context,
      });

      return new ApplicationResultSuccess(data.user?.id);
    } catch (error: unknown) {
      this.logger.error('User was create - server error repository', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t create - server error repository', error);
    }
  }

  async deleteUser(id: string): Promise<ApplicationResult<boolean>> {
    const context = 'SupabaseService.deleteUser';

    try {
      this.logger.info('Start deleteUser item from supabase', {
        id,
        context,
      });

      const { data, error } = await this.supabase.auth.admin.deleteUser(id);

      if (error || !data.user?.id) {
        this.logger.error('User was delete - supabase error repository', error, {
          context,
        });
        return new ApplicationResultError('User wasn`t delete - supabase error repository', error);
      }

      this.logger.info('Successfully inserted item on supabase', {
        id: data.user.id,
        context,
      });

      return new ApplicationResultSuccess(true);
    } catch (error: unknown) {
      this.logger.error('User was create - server error repository', error, {
        context,
      });

      return new ApplicationResultError('User wasn`t create - server error repository', error);
    }
  }
}
