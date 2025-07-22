import { Prisma } from '../../db/client';
import { FloorData } from './floors_controller.interfaces';

export const floorSerializer = (floor: Prisma.FloorGetPayload<null>): FloorData => {
  return {
    id: floor.id,
    uid: floor.uid,
    name: floor.name,
    display_name: floor.display_name,
    tower_id: floor.tower_id,
    created_at: floor.created_at.toISOString(),
    updated_at: floor.updated_at.toISOString(),
  };
};

export const floorsSerializer = (floors: Prisma.FloorGetPayload<null>[]): FloorData[] => {
  return floors.map((floor) => floorSerializer(floor));
};
