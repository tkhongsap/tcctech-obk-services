import { BaseController } from './base_controller';
import { WrappedArrayResponse } from './base_controller.interfaces';
import { Get, OperationId, Route } from 'tsoa';

import ParkingSpaceService from '../services/parking_spaces_service';
import { ParkingSpacesIndexResponse } from './parking_spaces_controller.interfaces';
import { parkingLotsSerializer } from './parking_lots_controller.serializer';

@Route('parking_spaces')
export class ParkingSpacesController extends BaseController {
  @Get('')
  @OperationId('parking_spaces.list')
  public async list(): Promise<WrappedArrayResponse<ParkingSpacesIndexResponse>> {
    const parkingSpaceServcie = new ParkingSpaceService();
    const parkingSpace = await parkingSpaceServcie.list();

    const data = parkingLotsSerializer(parkingSpace);

    this.setStatus(200);
    return { data: data };
  }
}
