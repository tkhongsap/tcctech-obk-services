import { ParkingFloorData } from './parking_lots_controller.interface';
import { map } from 'lodash';
import { Prisma } from '../../db/client';
import { ParkingLotData } from './parking_spaces_controller.interfaces';

export function parkingSerializer(parkingLot: ParkingFloorData): ParkingFloorData {
  return parkingLot;
}

export function parkingLotsSerializer(
  parkingLots: Prisma.ParkingLotGetPayload<{
    include: {
      parking_spaces: true;
      parking_floors: true;
    };
  }>[],
): ParkingLotData[] {
  return map(parkingLots, (parkingLot) => {
    return parkingLotShowSerializer(parkingLot);
  });
}

export function parkingLotShowSerializer(
  parkingLot: Prisma.ParkingLotGetPayload<{
    include: {
      parking_spaces: true;
      parking_floors: true;
    };
  }>,
): ParkingLotData {
  return {
    id: parkingLot.id,
    uid: parkingLot.uid,
    name: parkingLot.name,
    display_name: parkingLot.display_name,
    created_at: parkingLot.created_at,
    updated_at: parkingLot.updated_at,
    parking_floor_id: parkingLot.parking_floor_id,
    total_spots: parkingLot.total_spots,
    parking_floors: parkingLot.parking_floors,
    parking_spaces: parkingLot.parking_spaces,
  };
}
