import { ApplicationResult } from '@kernelsoftware/shared';

export interface IEventHandler<T> {
  className: string;
  eventType: string;
  canProcess(eventType: string): boolean;
  process(data: Record<string, unknown>): Promise<ApplicationResult<T>>;
}
