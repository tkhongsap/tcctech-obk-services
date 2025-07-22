import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { AccountService, IdentityService } from '../services';
import { schemas } from '../openapi/interfaces/schemas';
import BaseController from './base_controller';
import { CustomError } from '../middlewares/error_middleware';
import { IdentityProvider } from '../../db/client';
import { getIdentifier } from '../utils/identifier';

export default class IdentityController extends BaseController {
  public async validate(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['ValidateIdentityResponse']>,
  ) {
    const identifier = req.query['identifier'] as string;
    const provider = req.query['provider'] as IdentityProvider;
    const countryCode = req.query['country_code'] as string;
    const identityService = new IdentityService();
    const isValid = await identityService.validate(
      getIdentifier(provider, identifier, countryCode),
      provider,
    );

    return res.json({
      data: {
        result: isValid,
      },
    });
  }
  public async create(
    req: TypedRequest<schemas['CreateIdentityRequestBody']>,
    res: TypedResponse<schemas['CreateIdentityResponse']>,
  ) {
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const accountService = new AccountService();

    const {
      identity: { identifier, provider, country_code },
      otp: { id: otpId },
    } = req.body;
    const identityService = new IdentityService();
    const isValid = await identityService.validate(
      getIdentifier(provider, identifier, country_code),
      provider,
    );
    if (!isValid) {
      throw new CustomError(500, 'Identity already exists');
    }

    const registerResult = await accountService.createIdentity(
      { identifier, provider, country_code },
      accountId as string,
      otpId,
    );

    return res.json({
      data: {
        result: registerResult,
      },
    });
  }
  public async default(
    req: TypedRequest<schemas['CreateIdentityRequestBody']>,
    res: TypedResponse<schemas['CreateIdentityResponse']>,
  ) {
    const identityService = new IdentityService();
    const {
      headers: { 'x-account-id': accountId },
    } = req;
    const { id } = req.params;
    const result = await identityService.updateDefault(id, accountId as string);

    return res.json({
      data: {
        result: result,
      },
    });
  }
  public async findAll(
    req: TypedRequest<unknown>,
    res: TypedResponse<schemas['GetIdentitiesResponse']>,
  ) {
    const identityService = new IdentityService();

    const provider = req.query['provider'] as IdentityProvider;
    const {
      headers: { 'x-account-id': accountId },
    } = req;
    const result = await identityService.findAll(accountId as string, provider);

    return res.json({
      data: result,
    });
  }
  public async delete(
    req: TypedRequest<unknown>,
    res: TypedResponse<schemas['DeleteIdentityResponse']>,
  ) {
    const identityService = new IdentityService();

    const { id } = req.params;
    const {
      headers: { 'x-account-id': accountId },
    } = req;

    const result = await identityService.delete(accountId as string, id);
    return res.json({
      data: { result },
    });
  }
}
