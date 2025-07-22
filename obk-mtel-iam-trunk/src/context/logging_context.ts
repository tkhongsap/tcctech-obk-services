import { PlatformType } from '../../db/client';

export interface LoggingContext {
  traceId?: string;
  accountId?: string;
  platform?: PlatformType;
}
