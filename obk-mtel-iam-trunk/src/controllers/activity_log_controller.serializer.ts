import { ActivityLogDataResponse } from './activity_log_controller.interface';
import { Prisma } from '../../db/client';

export function activityLogDataSerializer(activityLog: Prisma.ActivityLogGetPayload<null>): ActivityLogDataResponse {
  return {
    id: activityLog.id,
    trace_id: activityLog.trace_id,
    account_id: activityLog.account_id,
    action: activityLog.action,
    status: activityLog.status,
    created_at: activityLog.created_at.toISOString(),
    updated_at: activityLog.updated_at.toISOString(),
    platform: activityLog.platform || null,
  };
}
