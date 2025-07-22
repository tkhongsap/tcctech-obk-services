import { Body, Header, OperationId, Path, Put, Route } from 'tsoa';
import { WrappedResponse } from './visitors_controller.interfaces';
import { BaseController } from './base_controller';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { ResultResponseData } from 'ob-iam-sdk/dist/api';
import { UpdateVisitorScheduleBody } from './visitor_schedules_controller.interfaces';
import VisitorScheduleService from '../services/visitor_schedule_service';

@Route('visitor_schedules')
export class VisitorSchedulesController extends BaseController {
  @OperationId('visitor_schedules.update')
  @Put('{id}')
  public async update(
    @Path() id: string,
    @Body() body: UpdateVisitorScheduleBody,
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedResponse<ResultResponseData>> {
    if (!xAccountId) {
      throw new CustomError(OBError.BMS_VAL_001);
    }
    const service = new VisitorScheduleService();
    const res = await service.deleteVisitorPass(id, body.deleted_at);
    this.setStatus(200);
    return {
      data: { result: res.result },
    };
  }
}
