import { target_group } from '../../../db/client/';

export interface TargetGroupData extends Omit<target_group, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
}

export type TargetGroupsIndexResponseData = TargetGroupData[];
