import { Route, Get } from 'tsoa';
import { ShuttleBusResponse, shuttleBusSerializer } from './shuttle_bus_controller.serializer';
import { BaseController } from './base_controller';
import { WrappedResponse } from './base_controller.interfaces';
import DestinationsRepository from '../repositories/destinations_repository';

@Route('shuttle-bus')
export class ShuttleBusController extends BaseController {
  @Get()
  public async index(): Promise<WrappedResponse<ShuttleBusResponse>> {
    const stations = await DestinationsRepository.findMany({
      include: {
        shuttle_bus_mapping_details: {
          include: {
            shuttle_buses: true,
          },
        },
        time_tables: { orderBy: { time: 'asc' } },
        destination_flags: true,
      },
    });

    const response = shuttleBusSerializer(stations);
    this.setStatus(200);

    return { data: response };
  }
}
