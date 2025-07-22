import { Controller, Get, OperationId, Route, Put, Body, Header } from 'tsoa';
import { WrappedResponse } from './index.interface';
import TokenRepository from '../repositories/token_repository';
import ProfileRepository from '../repositories/profile_repository';
import httpContext from 'express-http-context';
import { authorizePermission } from '../utils/authorization';
import { ProfileSerializer } from './profile_controller.serializer';
import { ProfileResult, ProfileUpdateBody } from './profile_controller.interface';
import { CustomError } from '../midlewares/error';
import { OBError } from '../utils/error_spec';
import ActivityLog from '../utils/activity_log';
import { EventProducer } from '../utils/kafka';
import cache from '../libs/cache';
import { isEmpty } from 'lodash';
import { Prisma } from '../../db/client';

@Route('me/profile')
export class ProfileController extends Controller {
  @Get('')
  @OperationId('profile.index')
  public async index(
    @Header('x-access-token') accessToken: string,
    @Header('x-account-id') accountId?: string,
  ): Promise<WrappedResponse<ProfileResult | null>> {
    let tokenAccountId: string | undefined;

    if (!accountId) {
      const result = await TokenRepository.findFirst({ where: { value: accessToken as string } });
      if (!result) {
        throw new CustomError(OBError.IAM_AUTH_001);
      }
      tokenAccountId = result.account_id;
    }
    const profile = await cache.getSet(`profile_${accountId}`, async () => {
      const profileData = await ProfileRepository.findFirst({
        where: { account_id: (accountId || tokenAccountId) as string },
      });
      if (profileData) {
        return JSON.stringify(profileData);
      } else {
        return '';
      }
    });

    if (isEmpty(profile)) throw new CustomError(OBError.IAM_PROF_001);

    const profileData = JSON.parse(profile) as Prisma.profileGetPayload<true>;
    if (accessToken) {
      const userPermission = httpContext.get('permissions');
      authorizePermission(userPermission, 'read', 'profile', profileData);
    }
    const result = ProfileSerializer(profileData);
    return {
      data: result,
    };
  }

  @Put('')
  @OperationId('profile.update')
  @ActivityLog('profile.update')
  public async update(
    @Body() body: ProfileUpdateBody,
    @Header('x-account-id') accountId: string,
    @Header('x-access-token') accessToken: string,
  ): Promise<WrappedResponse<ProfileResult | null>> {
    let tokenAccountId: string | undefined;

    if (!accountId) {
      const result = await TokenRepository.findFirst({ where: { value: accessToken } });
      if (!result) {
        throw new CustomError(OBError.IAM_AUTH_001);
      }
      tokenAccountId = result.account_id;
    }

    const { first_name, middle_name, last_name, title, dob, gender } = body;
    const restProfile = {
      title: title,
      dob: dob,
      gender: gender,
    };

    const profile = await ProfileRepository.update({
      where: { account_id: accountId || tokenAccountId },
      data: {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        ...restProfile,
      },
    });

    await cache.set(`profile_${accountId}`, JSON.stringify(profile));

    EventProducer.send({
      name: 'ob-iam.profile.updated',
      payload: {
        account_id: profile?.account_id,
        first_name: profile?.first_name,
        middle_name: profile?.middle_name,
        last_name: profile?.last_name,
        gender: profile?.gender,
        dob: profile?.dob,
      },
    });

    const result = ProfileSerializer(profile);
    return {
      data: result,
    };
  }
}
