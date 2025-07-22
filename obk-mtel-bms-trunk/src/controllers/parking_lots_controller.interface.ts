import { ParkingLot, SpotType, Tower, Zone, ParkingFloor } from '../../db/client/';

export interface TowerData extends Partial<Tower> {}

export interface SpotTypeData extends Partial<SpotType> {}
export interface ZoneData extends Partial<Zone> {
  tower: TowerData;
}
export interface ParkingLotData extends Partial<ParkingLot> {
  spot_types: SpotTypeData[];
  total_available_slots: number;
}

export interface ParkingFloorData extends Partial<ParkingFloor> {
  parking_lots: ParkingLotData[];
  total_available_slots: number;
}

export type ParkingLotsIndexResponse = ParkingFloorData[];
