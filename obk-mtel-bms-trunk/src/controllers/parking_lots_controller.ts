import { Controller, Get, OperationId, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { ParkingLotsIndexResponse } from './parking_lots_controller.interface';
import ParkingFloorRepository from '../repositories/parking_floor_repository';
import { ParkingLotDecorator } from '../decorators/parking_lot_decorator';
import { map } from 'lodash';
import { parkingSerializer } from './parking_lots_controller.serializer';
import cache from '../libs/cache';

@Route('parking_lots')
export class ParkingLotsController extends Controller {
  @Get('')
  @OperationId('parking_lots.index')
  public async index(): Promise<WrappedResponse<ParkingLotsIndexResponse>> {
    const parkingFloorsResponse = await cache.getSet(
      `parking_lots`,
      async () => {
        const parkingFloorsData = await ParkingFloorRepository.findMany({
          include: {
            parking_lots: {
              include: {
                spot_types: true,
              },
              orderBy: {
                name: 'asc',
              },
            },
          },
        });
        if (parkingFloorsData) {
          return JSON.stringify(parkingFloorsData);
        } else {
          return '';
        }
      },
      30,
    );
    const parkingFloors = JSON.parse(parkingFloorsResponse);
    const decoratedParkingLots = new ParkingLotDecorator(parkingFloors, { withTotalAvailableSpots: true }).decorate();
    const serializedParkingLots = map(decoratedParkingLots, parkingSerializer);

    this.setStatus(200);
    return { data: serializedParkingLots };
  }
}
