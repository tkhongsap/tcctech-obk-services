import { Body, Controller, Get, Header, OperationId, Patch, Route } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import ValetService from '../services/valet_service';
import { ValetParkingDetail, ValetStation } from '../libs/tcc_client';
import logging from '../utils/logging';
import { CallingBody } from './valet_controller.interfaces';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';

@Route('valet')
export class ValetController extends Controller {
  @Get('station/retrieve')
  @OperationId('station.retrieve')
  public async locationRetrieve(): Promise<WrappedResponse<ValetStation[]>> {
    logging.info('Start get valet valet station');
    const service = new ValetService();
    const result = await service.findStations();
    this.setStatus(200);
    return {
      data: result,
    };
  }

  @Patch('calling')
  @OperationId('calling')
  public async calling(@Body() body: CallingBody): Promise<WrappedResponse<ValetStation[]>> {
    logging.info('Start calling valet car');
    const service = new ValetService();
    const result = await service.calling(body);
    this.setStatus(200);
    return {
      data: result,
    };
  }

  @Get('find')
  @OperationId('find')
  public async find(@Header('x-account-id') xAccountId?: string): Promise<WrappedResponse<ValetParkingDetail>> {
    logging.info('Start find valet car');
    const service = new ValetService();
    if (!xAccountId) {
      throw new CustomError(OBError.BMS_VAL_001);
    }
    const result = await service.find(xAccountId);
    this.setStatus(200);
    return {
      data: {
        ...result,
        pickUpStation: (result.pickUpStation as any)?.name,
      },
    };
  }
}
