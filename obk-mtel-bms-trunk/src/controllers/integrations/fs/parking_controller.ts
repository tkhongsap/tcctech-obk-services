import { Route, Get, Controller, Middlewares } from 'tsoa';

import { Authorizer } from '../../../middlewares/authorizer';
import { FetchParkingResult } from './parking_controller_interface';
import { WrappedResponse } from '../../base_controller.interfaces';
import ParkingService from '../../../services/parking_service';

@Route('integrations/fs/parking')
@Middlewares(
  Authorizer({
    resource: 'fs',
    action: '*',
  }),
)
export class ParkingController extends Controller {
  @Get()
  public async fetch(): Promise<WrappedResponse<FetchParkingResult>> {
    const parkingService = new ParkingService();
    const result = await parkingService.getParkingAvailabilityData();

    this.setStatus(200);
    return {
      data: {
        result,
        error: [],
      },
    };
  }
}
