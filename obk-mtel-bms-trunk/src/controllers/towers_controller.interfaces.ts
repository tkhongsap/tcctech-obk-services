import { Prisma } from '../../db/client';
import { FloorData } from './floors_controller.interfaces';

export type TowerData = {
  id: string;
  uid: string;
  name: string;
  display_name: Prisma.JsonValue | null;
  project_id: string;
  created_at: string;
  updated_at: string;
  floors?: FloorData;
};

export type TowerIndexResponse = TowerData[];
