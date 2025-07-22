import logging from '../utils/logging';
import { TypedRequest, TypedResponse } from '../libs/custom_express';
import BaseController from './base_controller';
import { schemas } from '../openapi/interfaces/schemas';
import BroadcastModule from '../services/broadcast_service/broadcastModule';

export default class BroadcastController extends BaseController {
  public async broadcast(
    req: TypedRequest<never>,
    res: TypedResponse<schemas['BroadcastResponse']>,
  ) {
    logging.info('start call broadcast');
    const broadcastService = new BroadcastModule();
    broadcastService.broadcastToSpecificDevice(req.body);
    logging.info('finish call broadcast');
    res.json(req.body);
  }

  public async broadcastAll(
    req: TypedRequest<never>,
    res: TypedResponse<schemas['BroadcastResponse']>,
  ) {
    logging.info('start call broadcast all');
    const broadcastService = new BroadcastModule();
    broadcastService.broadcastToAllDevice(req.body);
    logging.info('finish call broadcast all');
    res.json(req.body);
  }
}
