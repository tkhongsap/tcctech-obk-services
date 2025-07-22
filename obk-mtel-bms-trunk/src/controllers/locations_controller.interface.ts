import { JsonValue } from '@prisma/client/runtime/library';

export type LocationData = {
  id: string;
  uid: string;
  name: string;
  coordinate: string;
  floor: FloorData;
  tower: TowerData;
};

export type FloorData = {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  tower_id: string;
  created_at: string;
  updated_at: string;
};

export type TowerData = {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  project_id: string;
  created_at: string;
  updated_at: string;
};

export type LocationIndexResponse = LocationData[];
