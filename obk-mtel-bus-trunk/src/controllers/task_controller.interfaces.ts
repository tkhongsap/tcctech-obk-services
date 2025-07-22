export interface TaskPath {
  delete_bus_position: string;
  process_bus_position: string;
}
export type TaskName = 'delete_bus_position' | 'process_bus_position';
export interface TaskResult {
  result: boolean;
}
