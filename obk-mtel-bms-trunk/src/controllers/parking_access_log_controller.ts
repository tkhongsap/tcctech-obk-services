import { WrappedOneResponse } from './base_controller.interfaces';
import { Get, OperationId, Path, Queries, Route } from 'tsoa';
import { Prisma } from '../../db/client';
import { ParkingLogQuery, ParkingLogResult } from './parking_access_log_controller.interfaces';
import { ParkingAccessLogSerializer, ParkingAccessLogsSerializer } from './parking_access_log_controller.serializer';
import { ParkingAccessLogsService } from '../services';
import { QueriesController } from './queries_controller';
import { Pagination, WrappedArrayResponse } from './queries_controller.interfaces';

@Route('parking_access')
export class ParkingAccessLogController extends QueriesController {
  @Get('')
  @OperationId('parking_access_logs.index')
  public async index(@Queries() query: ParkingLogQuery): Promise<WrappedArrayResponse<ParkingLogResult>> {
    const buildQuery = this.buildQuery<Prisma.ParkingLogFindManyArgs>({ ...query });

    const parkingLogService = new ParkingAccessLogsService();
    const parkingLog = await parkingLogService.index(buildQuery);

    const pagination = this.paginationBuilder(
      parkingLog.totalData,
      query.page_size || this.DEFAULT_PAGE_SIZE,
      query.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    this.setStatus(200);
    return { data: ParkingAccessLogsSerializer(parkingLog), pagination };
  }

  @Get('{plate_number}')
  @OperationId('parking_access_logs.show')
  public async show(@Path() plate_number: string): Promise<WrappedOneResponse<ParkingLogResult>> {
    const parkingLogService = new ParkingAccessLogsService();
    const parkingLog = await parkingLogService.show(plate_number);

    this.setStatus(200);
    return { data: ParkingAccessLogSerializer(parkingLog) };
  }
}
