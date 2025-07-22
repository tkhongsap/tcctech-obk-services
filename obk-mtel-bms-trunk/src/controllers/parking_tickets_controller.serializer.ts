import {
  ParkingSpaceDetailAndSpaceDetailData,
  ParkingSpaceDetailAndSpaceDetailResponse,
  ParkingTicketData,
} from './parking_tickets_controller.interfaces';
import { GetParkingDetailByPersonIDDataResponse } from '../libs/fs_parking_client';
import { RedeemParkingDataResponse } from '../libs/tcc_client';
import { dayjs } from '../libs/dayjs';
import { map } from 'lodash';

export function parkingTicketsSerializer(
  parkingTickets: GetParkingDetailByPersonIDDataResponse[],
  sub_code?: string,
): ParkingTicketData[] {
  return map(parkingTickets, (parkingTicket) => {
    return {
      ...parkingTicketSerializer(parkingTicket),
      sub_code: sub_code,
    };
  });
}

export function parkingTicketSerializer(
  parkingTicket: GetParkingDetailByPersonIDDataResponse | RedeemParkingDataResponse,
): ParkingTicketData {
  return {
    id: parkingTicket.logId,
    ticket_number: parkingTicket.ticketNo,
    plate_number: parkingTicket.plateNo,
    vehicle_type: parkingTicket.vehicleTypeName,
    parked_at: covertToUTC(parkingTicket.entryDateTime),
    total_fee: parkingTicket.total,
    vehicle_type_id: parkingTicket.vehicleTypeId,
    member_type_id: parkingTicket.memberTypeId,
    rate_detail: {
      en: parkingTicket.rateDetailEN,
      th: parkingTicket.rateDetailTH,
    },
  };
}

const covertToUTC = (string: string): string => {
  const dayjsInBangkokTimeZone = dayjs(string).tz('Asia/Bangkok', true);
  return dayjsInBangkokTimeZone.utc().toISOString();
};

export function parkingAllDetailSerializer(
  parkingDetails: ParkingSpaceDetailAndSpaceDetailResponse,
): ParkingSpaceDetailAndSpaceDetailData {
  return {
    id: parkingDetails.logId,
    plate_number: parkingDetails.plateNo,
    ticket_number: parkingDetails.ticketNo,
    vehicle_type: parkingDetails.vehicleTypeName,
    total_fee: parkingDetails.total,
    parked_at: covertToUTC(parkingDetails.entryDateTime),
    rate_detail: {
      en: parkingDetails.rateDetailEN,
      th: parkingDetails.rateDetailTH,
    },
    member_type_id: parkingDetails.memberTypeId,
    vehicle_type_id: parkingDetails.vehicleTypeId,
    zone_name: parkingDetails.zoneName,
    pole_id: parkingDetails.parkingExtension?.poleId,
    pole_name: parkingDetails.parkingExtension?.poleName,
    pole_row: parkingDetails.parkingExtension?.poleRow,
    pole_column: parkingDetails.parkingExtension?.poleColumn,
    pole_color_name: parkingDetails.parkingExtension?.poleColorName,
    pole_color_code: parkingDetails.parkingExtension?.poleColorCode,
    record_syscode: parkingDetails.recordSyscode,
    space_syscode: parkingDetails.spaceSyscode,
    space_no: parkingDetails.spaceNo,
    space_pic_uri: parkingDetails.spacePicUri,
    parking_time: parkingDetails.parkingTime,
    park_syscode: parkingDetails.parkSyscode,
    park_name: parkingDetails.parkName,
    floor_syscode: parkingDetails.floorSyscode,
    floor_name: parkingDetails.floorName,
    plate_no_pic_uri: parkingDetails.plateNoPicUri,
    asw_syscode: parkingDetails.aswSyscode,
    plate_no: parkingDetails.plateNo,
    space_pic_url: parkingDetails.spacePicUrl,
    plate_no_pic_url: parkingDetails.plateNoPicUrl,
    space_pic_binary: parkingDetails.spacePicBinary,
    ibeacon_ipc_uuid: parkingDetails.ibeaconIpcUuid,
    ibeacon_ipc_major: parkingDetails.ibeaconIpcMajor,
    ibeacon_ipc_minor: parkingDetails.ibeaconIpcMinor,
  };
}
