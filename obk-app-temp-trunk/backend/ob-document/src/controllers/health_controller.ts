import { logging } from 'ob-common-lib/dist';
import { TypedRequestBody, TypedResponse } from '../libs/custom_express';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import { HealthService } from '../services/health_service';

export default class HealthController extends BaseController {
  public async get(
    _req: TypedRequestBody<never>,
    res: TypedResponse<schemas['HealthResponse']>,
  ){
    logging.info('start call health');
  
    const healthService = new HealthService();
    healthService.checkHealth();
    logging.info('finish call health');
    
    const healthResponse = {
      data: {
        health: true,
      },
    };
    res.json(healthResponse);
  };
}
