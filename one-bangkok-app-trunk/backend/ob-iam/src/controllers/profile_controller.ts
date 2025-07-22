import { TypedRequest, TypedResponse } from '../libs/custom_express';
import { CustomError } from '../middlewares/error_middleware';
import { schemas } from '../openapi/interfaces/schemas';
import { TokenRepository, ProfileRepository } from '../repositories';
import { AccountService } from '../services';
import { authorizePermission } from '../utils/authorization';
import BaseController from './base_controller';
import httpContext from 'express-http-context';

export default class ProfileController extends BaseController {
  public async find(
    req: TypedRequest<''>,
    res: TypedResponse<schemas['FindProfileResponse']>,
  ) {
    const {
      headers: { 'x-access-token': token, 'x-account-id': accountId },
    } = req;

    let tokenAccountId: string | undefined;
    const tokenRepository = new TokenRepository();
    const profileRepository = new ProfileRepository();

    if (!accountId) {
      const result = await tokenRepository.findBy({ value: token as string });
      if (!result) {
        throw new CustomError(404, 'Token not found');
      }
      tokenAccountId = result.account_id;
    }

    const profile = await profileRepository.find(
      (accountId || tokenAccountId) as string,
    );
    if (!profile) {
      throw new CustomError(404, 'Profile not found');
    }
    const userPermission = httpContext.get('permissions');
    authorizePermission(userPermission, 'read', 'profile', profile);

    const stringDob = profile.dob.toISOString();

    const response = {
      data: {
        profile: {
          first_name: profile.first_name,
          middle_name: profile.middle_name,
          last_name: profile.last_name,
          dob: stringDob,
          title: profile.title,
          gender: profile.gender,
        },
      },
    };

    return res.json(response);
  }

  public async update(
    req: TypedRequest<schemas['UpdateProfileRequestBody']>,
    res: TypedResponse<schemas['UpdateProfileResponse']>,
  ) {
    const {
      headers: { 'x-access-token': token, 'x-account-id': accountId },
    } = req;
    let tokenAccountId: string | undefined;
    const tokenRepository = new TokenRepository();
    const accountService = new AccountService();

    if (!accountId) {
      const result = await tokenRepository.findBy({ value: token as string });
      if (!result) {
        throw new CustomError(404, 'Token not found');
      }
      tokenAccountId = result.account_id;
    }

    const { first_name, middle_name, last_name, ...restProfile } = req.body;

    const profile = await accountService.updateProfile(
      (accountId || tokenAccountId) as string,
      {
        first_name: first_name?.trim(),
        middle_name: middle_name?.trim(),
        last_name: last_name?.trim(),
        ...restProfile,
      },
    );

    const stringDob = profile?.dob.toISOString();

    const response = {
      data: {
        profile: {
          first_name: profile?.first_name as string,
          middle_name: profile?.middle_name as string,
          last_name: profile?.last_name as string,
          dob: stringDob as string,
          title: profile?.title,
          gender: profile?.gender,
        },
      },
    };

    return res.json(response);
  }
}
