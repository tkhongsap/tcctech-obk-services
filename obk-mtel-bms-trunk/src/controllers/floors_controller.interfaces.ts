import { JsonValue } from '@prisma/client/runtime/library';

export type FloorData = {
  id: string;
  uid: string;
  name: string;
  display_name: JsonValue;
  tower_id: string;
  created_at: string;
  updated_at: string;
};

export type FloorIndexResponse = FloorData[];
