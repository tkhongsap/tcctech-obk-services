import { ParkingLogPaginationResult, ParkingLogResult } from './parking_access_log_controller.interfaces';

export function ParkingAccessLogsSerializer(data: ParkingLogPaginationResult): ParkingLogResult[] {
  return data.parkingLogs.map((parkingLog) => {
    return ParkingAccessLogSerializer(parkingLog);
  });
}

export function ParkingAccessLogSerializer(parkingLog: ParkingLogResult): ParkingLogResult {
  return {
    id: parkingLog.id,
    uid: parkingLog.uid,
    identifier: parkingLog.identifier,
    type: parkingLog.type,
    status: parkingLog.status,
    plate_number: parkingLog.plate_number,
    transaction_date: parkingLog.transaction_date,
    terminal_id: parkingLog.terminal_id,
    data: parkingLog.data,
    name: parkingLog.name,
    display_status: parkingLog.display_status,
    display_termianl: parkingLog.display_termianl,
    created_at: parkingLog.created_at,
    updated_at: parkingLog.updated_at,
    member: parkingLog.member,
    durationTime: parkingLog.durationTime,
    accessGate: parkingLog.accessGate,
  };
}
