/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { PlatformType } from '../../db/client';
import ActivityLogRepository from '../repositories/activity_log_repository';
import logging from './logging';

// Define a decorator function
function ActivityLog(actionName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const loggingContext = logging.getLogContext();

      if (loggingContext.accountId) {
        const activityLogResult = await ActivityLogRepository.create({
          data: {
            account_id: loggingContext.accountId!,
            action: actionName,
            trace_id: loggingContext.traceId!,
            status: 'failed',
            platform: loggingContext.platform as PlatformType,
          },
        });
        const result = await originalMethod.apply(this, args);
        await ActivityLogRepository.update({
          data: {
            status: 'completed',
          },
          where: { id: activityLogResult.id },
        });
        return result;
      } else {
        const result = await originalMethod.apply(this, args);
        return result;
      }
    };
    return descriptor;
  };
}

export default ActivityLog;
