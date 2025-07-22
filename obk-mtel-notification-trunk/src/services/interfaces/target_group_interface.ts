export interface TargetGroupBody {
  name: string;
  account_id_group: string[];
}

export interface TargetGroupResponse {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
