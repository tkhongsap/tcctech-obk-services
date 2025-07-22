import { ACZoneData } from './ac_zone_controller.interfaces';
import { Prisma } from '../../db/client';

export function acZonesSerializer(acZones: Prisma.ACZoneGetPayload<null>[]): ACZoneData[] {
  return acZones.map((acZone) => {
    return {
      id: acZone.id,
      name: acZone.name,
      floor_id: acZone.floor_id,
      area_size: acZone.area_size,
      created_at: acZone.created_at.toISOString(),
      updated_at: acZone.updated_at.toISOString(),
    };
  });
}
