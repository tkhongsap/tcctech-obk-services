import { HealthService } from '../services/health_service';
import { logging } from 'ob-common-lib/dist';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { CustomError } from '../middlewares/error_middleware';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';

export default class HealthController extends BaseController {
  public async get(
    _req: TypedRequest<never>,
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
