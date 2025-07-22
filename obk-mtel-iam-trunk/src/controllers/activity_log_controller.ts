import { Route, Get, OperationId, Queries } from 'tsoa';
import { Pagination, WrappedResponse } from './index.interface';
import { ActivityLogDataResponse, ActivityLogIndexQuery, QueriesController } from './activity_log_controller.interface';
import ActivityLogRepository from '../repositories/activity_log_repository';
import { activityLogDataSerializer } from './activity_log_controller.serializer';

@Route('activity_log')
export class ActivityLogController extends QueriesController {
  @Get('')
  @OperationId('activity_log.index')
  public async index(@Queries() query?: ActivityLogIndexQuery): Promise<WrappedResponse<ActivityLogDataResponse>> {
    const _query = this.buildQuery({ ...query }) as { where: object };

    const activities = await ActivityLogRepository.findMany({
      ..._query,
    });
    const totalData = await ActivityLogRepository.count({
      where: {
        ..._query.where,
      },
    });

    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    const sanitizedAcctivityLog = activities.map((activity) => activityLogDataSerializer(activity));

    return {
      data: sanitizedAcctivityLog,
      pagination,
    };
  }

  @Get('/account/{accountId}')
  @OperationId('activity_log.account.show')
  public async show(
    accountId: string,
    @Queries() query?: ActivityLogIndexQuery,
  ): Promise<WrappedResponse<ActivityLogDataResponse>> {
    const _query = this.buildQuery({ ...query }) as { where: object };
    const activities = await ActivityLogRepository.findMany({
      ..._query,
      where: {
        ..._query.where,
        account_id: accountId,
      },
    });
    const totalData = await ActivityLogRepository.count({
      where: {
        ..._query.where,
        account_id: accountId,
      },
    });

    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    const sanitizedAcctivityLog = activities.map((activity) => activityLogDataSerializer(activity));

    return {
      data: sanitizedAcctivityLog,
      pagination,
    };
  }
}
