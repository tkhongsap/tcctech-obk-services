import { Prisma } from '../../db/client';
import { LocationIndexResponse, FloorData, TowerData } from './locations_controller.interface';

function locationSerializer(
  beacons: Prisma.BeaconGetPayload<{
    include: {
      location: {
        include: {
          floor: true;
          tower: true;
        };
      };
    };
  }>[],
): LocationIndexResponse {
  return beacons.map((beacon) => {
    const floorData: FloorData = {
      id: beacon.location.floor.id,
      uid: beacon.location.floor.uid,
      name: beacon.location.floor.name,
      display_name: beacon.location.floor.display_name,
      tower_id: beacon.location.floor.tower_id,
      created_at: beacon.location.floor.created_at.toISOString(),
      updated_at: beacon.location.floor.updated_at.toISOString(),
    };

    const towerData: TowerData = {
      id: beacon.location.tower.id,
      uid: beacon.location.tower.uid,
      name: beacon.location.tower.name,
      display_name: beacon.location.tower.display_name,
      project_id: beacon.location.tower.project_id,
      created_at: beacon.location.tower.created_at.toISOString(),
      updated_at: beacon.location.tower.updated_at.toISOString(),
    };

    return {
      id: beacon.location.id,
      uid: beacon.location.uid,
      name: beacon.location.name,
      coordinate: `${beacon.major},${beacon.minor}`,
      floor: floorData,
      tower: towerData,
    };
  });
}

export default locationSerializer;
