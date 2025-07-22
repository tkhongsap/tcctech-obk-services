import { Get, OperationId, Path, Queries, Route } from 'tsoa';
import { buildingAccessLogsSerializer } from './building_access_log_controller.serializer';
import {
  BuildingAccessgLogQuery,
  BuildingAccessLogResult,
  BuildingAccessLogShowQuery,
} from './building_access_log_controller.interface';
import { Prisma } from '../../db/client';
import BuildingAccessLogsService from '../services/building_access_log_service';
import { QueriesController } from './queries_controller';
import { Pagination, WrappedArrayResponse } from './queries_controller.interfaces';
@Route('building_access')
export class BuildingAccessLogController extends QueriesController {
  @Get('')
  @OperationId('building_access_logs.index')
  public async index(
    @Queries() query: BuildingAccessgLogQuery,
  ): Promise<WrappedArrayResponse<BuildingAccessLogResult>> {
    const _query = this.buildQuery<Prisma.BuildingAccessgLogFindManyArgs>({ ...query });

    const buildingAccessLogService = new BuildingAccessLogsService();
    const buildingLogsData = await buildingAccessLogService.index(_query);

    const pagination = this.paginationBuilder(
      buildingLogsData.totalData,
      query.page_size || this.DEFAULT_PAGE_SIZE,
      query.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;
    this.setStatus(200);

    return {
      data: buildingAccessLogsSerializer(buildingLogsData.buildingLogs),
      pagination,
    };
  }

  @Get('{id}')
  @OperationId('building_access_logs.show')
  public async show(
    @Path() id: string,
    @Queries() query: BuildingAccessLogShowQuery,
  ): Promise<WrappedArrayResponse<BuildingAccessLogResult>> {
    const buildingAccessLogService = new BuildingAccessLogsService();
    const buildingLogsData = await buildingAccessLogService.show(id, query.accessorType);

    this.setStatus(200);
    return { data: buildingAccessLogsSerializer(buildingLogsData as BuildingAccessLogResult[]) };
  }
}
