import { WrappedArrayResponse } from './base_controller.interfaces';
import { Controller, Get, OperationId, Path, Route } from 'tsoa';
import { ACZoneData } from './ac_zone_controller.interfaces';
import { acZonesSerializer } from './ac_zone_controller.serializer';
import { ACZoneRepository } from '../repositories';

@Route('ac_zones')
export class ACZonesController extends Controller {
  @Get('{floor_id}')
  @OperationId('ac_zones.show')
  public async show(@Path() floor_id: string): Promise<WrappedArrayResponse<ACZoneData>> {
    const acZone = await ACZoneRepository.findMany({
      where: {
        floor_id,
      },
    });

    return { data: acZonesSerializer(acZone) };
  }
}
