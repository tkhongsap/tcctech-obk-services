export interface TaskPath {
  delete_deactivate_account: string;
  delete_expired_otp: string;
}
export type TaskName = 'delete_deactivate_account' | 'delete_expired_otp';
export interface TaskResult {
  result: boolean;
}
