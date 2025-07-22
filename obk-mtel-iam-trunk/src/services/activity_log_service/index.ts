import { PlatformType } from '../../../db/client';
import ActivityLogRepository from '../../repositories/activity_log_repository';
import TokenRepository from '../../repositories/token_repository';
import logging from '../../utils/logging';

export default class ActivityLogService {
  public async createActivityLog(tokenValue: string, actionName: string) {
    const loggingContext = logging.getLogContext();
    const token = await TokenRepository.findFirst({ where: { value: tokenValue } });
    if (token) {
      await ActivityLogRepository.create({
        data: {
          account_id: token.account_id,
          action: actionName,
          trace_id: loggingContext.traceId!,
          status: 'completed',
          platform: loggingContext.platform as PlatformType,
        },
      });
    }
  }

  public async showActivityLog(accountId: string) {
    const result = await ActivityLogRepository.findFirst({
      where: { account_id: accountId },
      orderBy: {
        created_at: 'desc',
      },
    });
    return result;
  }
}
