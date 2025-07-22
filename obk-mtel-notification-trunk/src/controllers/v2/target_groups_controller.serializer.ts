import { target_group } from '../../../db/client/';
import { TargetGroupData } from './index.interface';

export function targetGroupSerializer(targetGroup: target_group): TargetGroupData {
  return {
    ...targetGroup,
    created_at: targetGroup.created_at.toISOString(),
    updated_at: targetGroup.updated_at.toISOString(),
  };
}
