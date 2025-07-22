import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { OtpService } from '../services';
import { schemas } from '../openapi/interfaces/schemas';
import BaseController from './base_controller';
import { getIdentifier } from '../utils/identifier';

export default class OtpController extends BaseController {
  public async request(
    req: TypedRequest<schemas['RequestOtpRequestBody']>,
    res: TypedResponse<schemas['RequestOtpResponse']>,
  ) {
    const { identity } = req.body;
    const countryCode = identity.country_code || '';
    const otpService = new OtpService();
    const otp = await otpService.generate(
      getIdentifier(identity.provider, identity.identifier, countryCode),
    );
    await otpService.sendCode(otp.code, otp.reference, identity);

    const response = {
      data: {
        otp: {
          reference: otp.reference,
        },
      },
    };

    return res.json(response);
  }

  public async verify(
    req: TypedRequest<schemas['VerifyOtpRequestBody']>,
    res: TypedResponse<schemas['VerifyOtpResponse']>,
  ) {
    const otpService = new OtpService();
    const {
      otp: { reference, code },
    } = req.body;
    const otp = await otpService.verify(reference, code);

    const response = {
      data: {
        otp: {
          id: otp.id,
        },
      },
    };

    return res.json(response);
  }
}
