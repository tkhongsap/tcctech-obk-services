import { Prisma } from '../../db/client';
import { TowerData } from './towers_controller.interfaces';

export const towerSerializer = (tower: Prisma.TowerGetPayload<null>): TowerData => {
  return {
    id: tower.id,
    uid: tower.uid,
    name: tower.name,
    display_name: tower.display_name,
    project_id: tower.project_id,
    created_at: tower.created_at.toISOString(),
    updated_at: tower.updated_at.toISOString(),
  };
};

export const towersSerializer = (towers: Prisma.TowerGetPayload<null>[]): TowerData[] => {
  return towers.map((tower) => towerSerializer(tower));
};
