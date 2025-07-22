import { Controller, Get, OperationId, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { TrafficRecordsIndexResponseData } from './traffic_records_controller.interfaces';
import { TrafficRecordService } from '../services';
import { Cache } from '../libs/cache';

@Route('traffic_records')
export class TranficRecordsController extends Controller {
  @Get('')
  @Cache('traffic_records.index', 300)
  @OperationId('traffic_records.index')
  public async index(): Promise<WrappedResponse<TrafficRecordsIndexResponseData>> {
    const trafficRecordService = new TrafficRecordService();
    const data = await trafficRecordService.getLatestRecords();

    this.setStatus(200);
    return {
      data,
    };
  }
}
