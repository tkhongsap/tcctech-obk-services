import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { schemas } from '../openapi/interfaces/schemas';
import ExternalIdentityService from '../services/external_identity_service';
import BaseController from './base_controller';

export default class ExternalIdentityController extends BaseController {
  public async link(
    req: TypedRequest<schemas['LinkExternalIdentityRequestBody']>,
    res: TypedResponse<schemas['LinkExternalIdentityResponse']>,
  ) {
    const { identifier, provider_type, uid, meta } = req.body;
    const externalIdentityService = new ExternalIdentityService();

    const isValid = await externalIdentityService.link({
      uid,
      type: provider_type,
      identifier: identifier,
      meta: meta,
    });

    return res.json({
      data: {
        result: isValid,
      },
    });
  }
}
