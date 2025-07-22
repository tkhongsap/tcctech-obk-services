import { Controller, Post, OperationId, Route, Body } from 'tsoa';
import { WrappedResponse } from './index.interface';
import { OtpBody, OtpResult, verifyOtpBody, verifyOtpResult } from './otp_controller.interface';
import OtpService from '../services/otp_service';
import { getIdentifier } from '../utils/identifier';
import { OtpSerializer } from './otp_controller.serializer';
import { OBError } from '../utils/error_spec';
import { CustomError } from '../midlewares/error';
@Route('otp')
export class OtpController extends Controller {
  @Post('request')
  @OperationId('otp.request')
  public async request(@Body() body: OtpBody): Promise<WrappedResponse<OtpResult | null>> {
    const { identity } = body;
    const countryCode = identity.country_code ? identity.country_code : identity.identifier.slice(0, 3);
    const whitelistCountry = JSON.parse(process.env.WHITELIST_COUNTRY_OTP || '[]');
    if (countryCode != '' && !whitelistCountry.includes(countryCode) && countryCode.slice(0, 1) == '+') {
      throw new CustomError(OBError.IAM_OTP_005);
    }

    const otpService = new OtpService();
    const countryCodes = identity.country_code || '';
    const otp = await otpService.generate(getIdentifier(identity.provider, identity.identifier, countryCodes));
    await otpService.sendCode(otp.code, otp.reference, identity);
    const result = OtpSerializer(otp);
    return {
      data: result,
    };
  }
  @Post('verify')
  @OperationId('otp.verify')
  public async verify(@Body() body: verifyOtpBody): Promise<WrappedResponse<verifyOtpResult | null>> {
    const {
      otp: { reference, code },
    } = body;

    const otpService = new OtpService();
    const otp = await otpService.verify(reference, code);

    return {
      data: { otp: { id: otp.id } },
    };
  }
}
