import { Body, Controller, Get, OperationId, Post, Queries, Route } from 'tsoa';
import {
  ExternalIdentityIndexResponse,
  ExternalIdentityIndexQuery,
  LinkExternalIdentityRequestBody,
  ValidateExternalIdentityRequestBody,
  ExternalIdentityEvBody
} from './external_identity_controller.interfaces';
import { Provider, ResultResponseData, WrappedResponse } from './index.interface';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import { getIdentifier } from '../utils/identifier';
import AuthService from '../services/auth_service';
import ExternalIdentityService from '../services/external_identity_service';
import { EvResponseSyncData } from '../services/external_identity_service/index.interface';

@Route('external_identity')
export class ExternalIdentityController extends Controller {
  @Post('link')
  @OperationId('external_identity.link')
  public async link(@Body() body: LinkExternalIdentityRequestBody): Promise<WrappedResponse<ResultResponseData>> {
    const { identifier, provider_type: providerType, uid, meta, provider, country_code: countryCode } = body;
    const externalIdentityService = new ExternalIdentityService();
    const identifierType: Provider = provider ?? 'email';
    const formatIdentifier = getIdentifier(identifierType, identifier, countryCode);
    const isValid = await externalIdentityService.link(
      {
        uid,
        type: providerType,
        identifier: formatIdentifier,
        meta: meta,
      },
      identifierType,
    );

    return {
      data: {
        result: isValid,
      },
    };
  }

  @Get('validate')
  @OperationId('external_identity.validate')
  public async validate(
    @Queries() query: ValidateExternalIdentityRequestBody,
  ): Promise<WrappedResponse<ResultResponseData>> {
    const { provider, identifier, provider_type: providerType, country_code: countryCode } = query;
    const externalIdentityService = new ExternalIdentityService();

    const formatIdentifier = getIdentifier(provider, identifier, countryCode);
    if (process.env.ENABLE_REGISTRATION_WHITELIST === 'true') {
      const isWhitelisted = await new AuthService().validateWhitelist(formatIdentifier, provider);
      if (!isWhitelisted) {
        throw new CustomError(OBError.IAM_IDT_0010);
      }
    }

    const isValid = await externalIdentityService.validate({
      uid: '',
      type: providerType,
      identifier: identifier,
      meta: {},
    });

    return {
      data: {
        result: isValid,
      },
    };
  }
  @Get('')
  @OperationId('external_identity.index')
  public async index(
    @Queries() query?: ExternalIdentityIndexQuery,
  ): Promise<WrappedResponse<ExternalIdentityIndexResponse[]>> {
    const externalIdentityService = new ExternalIdentityService();
    const externalIdentity = await externalIdentityService.GetExternalIdentity(query);

    return {
      data: externalIdentity,
    };
  }


  @Post('ev')
  @OperationId('external_identity.ev')
  public async ev(
    @Body() body: ExternalIdentityEvBody,
  ): Promise<WrappedResponse<EvResponseSyncData>> {
    const externalIdentityService = new ExternalIdentityService();
    const externalIdentity = await externalIdentityService.SyncEv(body);

    return {
      data: externalIdentity,
    };
  }
}
