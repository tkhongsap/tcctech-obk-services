import { ParkingFloor, ParkingLot, ParkingSpace } from '../../db/client/';

export interface ParkingLotData extends Partial<ParkingLot> {
  parking_floors: ParkingFloorsData;
  parking_spaces: ParkingSpacesData[];
}
export interface ParkingFloorsData extends Partial<ParkingFloor> {}
export interface ParkingSpacesData extends Partial<ParkingSpace> {}

export type ParkingSpacesIndexResponse = ParkingLotData;
