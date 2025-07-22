import crypto from 'crypto';

import { get, isEmpty, isNull } from 'lodash';
import { AuthService } from 'ob-iam/src/services';
import { CustomError } from 'ob-iam/src/middlewares/error';
import { EventProducer, JsonConvert, logging } from 'ob-common-lib/dist';
import { IdentityProvider, token } from 'ob-iam/db/client';
import {
  AccountUpdateData,
  AccountWhereData,
  AccountWhereUniqueData,
  AuthServiceRegisterInput,
  CreateAccountServiceInput,
  Identity,
  UpdateProfile,
  resetPasswordResult,
} from './index.interface';
import { otpStrategy, tokenStrategy } from '../auth_service/login_strategies';
import { Request } from 'express';
import { comparePassword, hashPassword } from '../../utils/encrypt';
import { OBError } from '../../openapi/error_spec';
import { CONST } from '../../utils/const';
import { BASE_PERMISSION } from '../../constants/base_permission';
import { account as AccountType } from 'ob-iam/db/client';

import {
  AccountRepository,
  IdentityRepository,
  ProfileRepository,
  OtpRepository,
} from '../../repositories';
import {
  ExternalIdentityType,
  PermitteeType,
  Prisma,
} from '../../../db/client';
import DeviceService from '../device_service';
import ExternalIdentityService from '../external_identity_service';
import { getIdentifier } from '../../utils/identifier';
export default class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly identityRepository: IdentityRepository;
  private readonly profileRepoitory: ProfileRepository;
  private readonly otpRepository: OtpRepository;
  private readonly authService: AuthService;
  private readonly deviceService: DeviceService;
  private readonly externalIdentityService: ExternalIdentityService;

  constructor(
    authService?: AuthService,
    accountRepository?: AccountRepository,
    identityRepository?: IdentityRepository,
    profileRepository?: ProfileRepository,
    otpRepository?: OtpRepository,
    deviceService?: DeviceService,
    externalIdentityService?: ExternalIdentityService,
  ) {
    this.authService = authService || new AuthService();
    this.accountRepository = accountRepository || new AccountRepository();
    this.identityRepository = identityRepository || new IdentityRepository();
    this.profileRepoitory = profileRepository || new ProfileRepository();
    this.otpRepository = otpRepository || new OtpRepository();
    this.deviceService = deviceService || new DeviceService();
    this.externalIdentityService =
      externalIdentityService || new ExternalIdentityService();
  }

  public async createServiceAccount(
    input?: CreateAccountServiceInput,
  ): Promise<typeof record> {
    const record = await this.accountRepository.createAccount({
      api_key: {
        create: [
          {
            secret: crypto.randomBytes(32).toString('hex'),
          },
        ],
      },
      attached_permission: {
        create: input?.permissions,
      },
    });

    return record;
  }

  public async register(input: AuthServiceRegisterInput): Promise<token> {
    logging.info('start call account service - register');
    const { profile, identities, password, device, push_token } = input;
    let transformIdentities: Identity = {} as Identity;

    const { identifier, provider, country_code } = identities;
    const result = await this.authService.validateIdentity(
      getIdentifier(provider, identifier, country_code),
      provider,
    );
    if (provider !== 'sso' && !password) {
      throw new CustomError(OBError.IAM_ACC_004);
    }
    if (result) {
      const transformProvider = provider === 'sso' ? 'email' : provider;

      const identityMeta = this.generateMeta(identities);
      transformIdentities = {
        identifier: getIdentifier(provider, identifier, country_code),
        provider: transformProvider,
        default: true,
        meta: identityMeta,
      };
    } else {
      throw new CustomError(OBError.IAM_IDT_002);
    }

    const encryptPassword = await hashPassword(password);

    const external_identity =
      identities.provider === 'sso'
        ? {
            create: {
              identifier: get(identities, 'identifier', ''),
              uid: get(identities, 'uid', ''),
              type: get(
                identities,
                'provider_type',
                '',
              ) as ExternalIdentityType,
              meta: JsonConvert.objectToJson(get(identities, 'meta', {})),
            },
          }
        : undefined;

    const attachedPermissions: Prisma.attached_permissionCreateManyAccountInput[] =
      BASE_PERMISSION.map((permission) => {
        return {
          permittee_type: PermitteeType.account,
          value: JsonConvert.objectToJson(permission),
        };
      });

    const { first_name, middle_name, last_name, ...restProfile } = profile;
    const account = await this.accountRepository.createAccount({
      password: encryptPassword,
      setting: { create: {} },
      profile: {
        create: {
          first_name: first_name?.trim(),
          middle_name: middle_name?.trim(),
          last_name: last_name?.trim(),
          ...restProfile,
        },
      },
      identities: { createMany: { data: transformIdentities } },
      external_identity: external_identity,
      attached_permission: {
        createMany: {
          data: attachedPermissions,
        },
      },
    });
    const accountId = get(account, 'id', '');

    this.externalIdentityService.checkMember(
      transformIdentities.identifier,
      accountId,
    );
    let payload: object = {
      account_id: accountId,
      identities: [{ ...identities, default: true }],
      push_token,
      profile,
    };
    if (process.env.ENABLE_DEVICE_STORING === 'true') {
      if (device) {
        payload = {
          ...payload,
          device: {
            device_id: device.device_id,
            device_os: device.os,
            device_unique_id: device.device_id,
          },
        };
        await this.deviceService.create({
          deviceId: device.device_id,
          os: device.os,
          accountId,
        });
      } else {
        throw new CustomError(OBError.OB_001);
      }
    }

    const token = await this.authService.generateToken(accountId);

    EventProducer.send({
      name: 'ob-iam.account.created',
      payload,
    });

    return token;
  }

  private generateMeta(identities: AuthServiceRegisterInput['identities']) {
    const { provider, identifier, country_code } = identities;
    return {
      identifier: getIdentifier(provider, identifier, country_code),
      country_code,
    };
  }

  public async createIdentity(
    identity: AuthServiceRegisterInput['identities'],
    accountId: string,
    otpId: string,
  ): Promise<boolean> {
    const { identifier, provider, country_code } = identity;
    const otp = await this.otpRepository.findBy({ id: otpId });
    if (!otp) {
      throw new CustomError(OBError.IAM_IDT_004);
    }
    const findingIdentifier = await this.identityRepository.findAll({
      account_id: accountId,
      provider: provider,
    });
    if (findingIdentifier.length >= CONST.IDENTITY_LIMIT) {
      throw new CustomError(OBError.IAM_IDT_009);
    }
    const isFirstIdentifier = isEmpty(findingIdentifier);
    const identityMeta = this.generateMeta(identity);

    await this.identityRepository.createIdentity(
      getIdentifier(provider, identifier, country_code),
      provider,
      accountId,
      isFirstIdentifier,
      identityMeta,
    );

    const eventName =
      provider === IdentityProvider.email
        ? 'ob-iam.identity.email_added'
        : 'ob-iam.identity.phone_added';

    EventProducer.send({
      name: eventName,
      payload: {
        account_id: accountId,
        identity: {
          identifier,
          provider,
          default: isFirstIdentifier,
        },
      },
    });
    logging.info('created Identity - createNewIdentity');

    return true;
  }

  public async getProfile(accountId: string): Promise<typeof profile> {
    logging.info('start call account service - get user profile');

    const profile = await this.profileRepoitory.find(accountId);

    return profile;
  }

  public async updateProfile(
    accountId: string,
    profileData: UpdateProfile,
  ): Promise<typeof profile> {
    logging.info('start call account service - get user profile');

    await this.profileRepoitory.update(accountId, profileData);

    const profile = await this.getProfile(accountId);

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

    return profile;
  }

  public async findAccount(req: Request): Promise<typeof account> {
    logging.info('start call account service - get user account');

    const account = await tokenStrategy(req);

    return account;
  }

  public async update(
    accountUpdateData: AccountUpdateData,
    accountWhereUniqueData: AccountWhereUniqueData,
  ): Promise<void> {
    logging.info('start call account service - update user account');

    await this.accountRepository.update(
      accountUpdateData,
      accountWhereUniqueData,
    );

    if (accountUpdateData.deleted_at) {
      EventProducer.send({
        name: 'ob-iam.account.deleted',
        payload: {
          account_id: accountWhereUniqueData.id,
        },
      });
    }

    logging.info('finish call account service - update user account');
  }

  public async bulkDelete(
    accountWhereData: AccountWhereData,
  ): Promise<boolean> {
    logging.info('start call account service - bulk delete user account');

    await this.accountRepository.bulkDelete(accountWhereData);

    logging.info('finish call account service - bulk delete user account');

    return true;
  }

  public async verifyPassword(
    accountId: string,
    password: string,
  ): Promise<boolean> {
    logging.info('start call account service - verify password');

    const account = await this.accountRepository.find({
      id: accountId,
      password: {
        not: null,
      },
    });
    if (!account) {
      throw new CustomError(OBError.IAM_IDT_003);
    }

    const dbPassword = account.password;

    if (!dbPassword) {
      throw new CustomError(OBError.IAM_ACC_005);
    }

    const compareResult = await comparePassword(password, dbPassword);

    logging.info('finish call account service - verify password');
    return compareResult;
  }

  public async updatePassword(
    accountId: string,
    password: string,
  ): Promise<boolean> {
    logging.info('start call account service - update password');

    const account = await this.accountRepository.find({ id: accountId });
    if (!account) {
      throw new CustomError(OBError.IAM_IDT_003);
    }

    const encryptPassword = await hashPassword(password);

    const eventName = isNull(account.password)
      ? 'ob-iam.account.password_set'
      : 'ob-iam.account.password_reset';

    await this.accountRepository.update(
      {
        password: encryptPassword,
      },
      {
        id: accountId,
      },
    );

    EventProducer.send({
      name: eventName,
      payload: {
        account_id: accountId,
      },
    });

    logging.info('finish call account service - update password');
    return true;
  }

  public async find(id: string): Promise<AccountType | null> {
    return await this.accountRepository.find({
      id,
    });
  }

  public async resetPassword(req: Request): Promise<resetPasswordResult> {
    logging.info('Start reset PASSWORD...');

    const identity = get(req, ['body', 'identity']);
    const { identifier, provider, country_code } = identity;

    const isDeleted = await this.identityRepository.findBy({
      identifier: getIdentifier(provider, identifier, country_code),
      provider: identity.provider,
      account: { deleted_at: { not: null } },
    });

    if (isDeleted) {
      throw new CustomError(OBError.IAM_AUTH_003);
    }

    const id = get(req, 'body.identity.otp', null);
    const reference = get(req, 'body.identity.reference', null);

    const account = await otpStrategy(req, id, reference);

    if (account) {
      const result = await this.authService.check2FA(
        account,
        'passwordStrategy',
        req,
      );

      if (result) {
        return result;
      }
      logging.info('starting reset password process');

      const {
        body: { hashedPassword },
      } = req;
      const encryptPassword = await hashPassword(hashedPassword);

      await this.accountRepository.update(
        {
          password: encryptPassword,
        },
        {
          id: account.id,
        },
      );

      const token = await this.authService.generateToken(account.id);

      EventProducer.send({
        name: 'ob-iam.account.password_reset',
        payload: {
          account_id: account.id,
        },
      });

      return {
        token: {
          value: token.value,
        },
      };
    }

    throw new CustomError(OBError.IAM_ACC_006);
  }

  public async getAccountDetail(accountId: string) {
    const device = await this.deviceService.find(accountId);
    if (device) {
      return {
        account: {
          device: {
            id: device.device_id,
          },
        },
      };
    }
    throw new CustomError(OBError.IAM_ACC_007);
  }
}
