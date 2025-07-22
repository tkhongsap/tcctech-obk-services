import { Controller, Get, OperationId, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { LocationIndexResponse } from './locations_controller.interface';
import locationSerializer from './locations_controller.serializer';
import BeaconRepository from '../repositories/beacon_repository';

@Route('locations')
export class LocationsController extends Controller {
  @Get('')
  @OperationId('locations.index')
  public async index(): Promise<WrappedResponse<LocationIndexResponse>> {
    const beacons = await BeaconRepository.findMany({
      include: {
        location: {
          include: {
            floor: true,
            tower: true,
          },
        },
      },
    });

    const data = locationSerializer(beacons);

    this.setStatus(200);
    return {
      data: data,
    };
  }
}
