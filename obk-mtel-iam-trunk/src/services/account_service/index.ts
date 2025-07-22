import { get, isEmpty, isNull } from 'lodash';
import crypto from 'crypto';
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
import { Request } from 'express';
import { comparePassword, hashPassword } from '../../utils/encrypt';
import { BASE_PERMISSION } from '../../constants/base_permission';
import {
  ExternalIdentityType,
  IdentityProvider,
  PermitteeType,
  Prisma,
  token,
  account as AccountType,
} from '../../../db/client';
import { getIdentifier } from '../../utils/identifier';
import AccountRepository from '../../repositories/account_repository';
import DeviceService from '../device_service';
import ExternalIdentityService from '../external_identity_service';
import OtpRepository from '../../repositories/otp_repository';
import IdentityRepository from '../../repositories/identity_repository';
import ProfileRepository from '../../repositories/profile_repository';
import AuthService from '../auth_service';
import logging from '../../utils/logging';
import { CustomError } from '../../midlewares/error';
import { OBError } from '../../utils/error_spec';
import { JsonConvert } from '../../utils/json_convert';
import { EventProducer } from '../../utils/kafka';
import { CONST } from '../../utils/const';
import { otpStrategy, tokenStrategy } from '../auth_service/login_strategies';
import { AccountDataResponse } from '../../controllers/accounts_controller.interfaces';
import TCCClient from '../../libs/tcc_client';
import ExternalIdentityRepository from '../../repositories/external_identity_repository';
import IdentityService from '../identity_service';
import SignInIdentityLogService from '../sign_in_identity_log_service';
import cache from '../../libs/cache';

export default class AccountService {
  private readonly authService: AuthService;
  private readonly deviceService: DeviceService;
  private readonly externalIdentityService: ExternalIdentityService;
  private readonly identityService: IdentityService;

  constructor(
    authService?: AuthService,
    deviceService?: DeviceService,
    externalIdentityService?: ExternalIdentityService,
    identityService?: IdentityService,
  ) {
    this.authService = authService || new AuthService();
    this.deviceService = deviceService || new DeviceService();
    this.externalIdentityService = externalIdentityService || new ExternalIdentityService();
    this.identityService = identityService || new IdentityService();
  }
  public async createServiceAccount(input?: CreateAccountServiceInput): Promise<typeof record> {
    const record = await AccountRepository.create({
      data: {
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
      },
    });

    return record;
  }
  public async register(input: AuthServiceRegisterInput): Promise<{ token: token; refreshToken: token }> {
    const { profile, identities, password, device, push_token } = input;
    let transformIdentities: Identity = {} as Identity;
    const { identifier, provider, country_code } = identities;
    const formmatedIdentifier = getIdentifier(provider, identifier, country_code);
    const result = await this.authService.validateIdentity(formmatedIdentifier, provider);
    if (provider !== 'sso' && provider !== 'keycloak' && !password) {
      throw new CustomError(OBError.IAM_ACC_004);
    }
    if (result) {
      const transformProvider = provider === 'sso' || provider === 'keycloak' ? 'email' : provider;

      const identityMeta = this.generateMeta(identities);
      transformIdentities = {
        identifier: formmatedIdentifier,
        provider: transformProvider,
        default: true,
        meta: identityMeta,
      };
    } else {
      throw new CustomError(OBError.IAM_IDT_002);
    }

    const external_identity =
      identities.provider === 'sso'
        ? {
            create: {
              identifier: get(identities, 'identifier', ''),
              uid: get(identities, 'uid', ''),
              type: get(identities, 'provider_type', '') as ExternalIdentityType,
              meta: JsonConvert.objectToJson(get(identities, 'meta', {})),
            },
          }
        : undefined;

    const attachedPermissions: Prisma.attached_permissionCreateManyAccountInput[] = BASE_PERMISSION.map(
      (permission) => {
        return {
          permittee_type: PermitteeType.account,
          value: JsonConvert.objectToJson(permission),
        };
      },
    );

    const { first_name, middle_name, last_name, ...restProfile } = profile;
    const encryptPassword = await hashPassword(password);
    const account = await AccountRepository.create({
      data: {
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
      },
    });
    const accountId = get(account, 'id', '');

    const identitie = [{ ...identities, default: true }];
    if (provider === IdentityProvider.phone) {
      identitie[0].identifier = `${country_code}${identifier}`;
    }
    let payload: object = {
      account_id: accountId,
      identities: identitie,
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

    const [rToken, rRefreshToken] = await this.authService.generateRegisterToken(accountId);

    EventProducer.send({
      name: 'ob-iam.account.created',
      payload,
    });

    this.createTCCAccount(formmatedIdentifier, account.password!, first_name, last_name, account.id);

    this.externalIdentityService.checkMember(transformIdentities.identifier, accountId);

    const SigninIdentityLog = new SignInIdentityLogService();
    await SigninIdentityLog.create(account.id, formmatedIdentifier);
    if (provider === 'email' || provider === 'phone') {
      let dataCheckAndBinding;
      if (provider === 'email') {
        dataCheckAndBinding = {
          provider,
          tenantEmail: identifier,
        };
      } else {
        dataCheckAndBinding = {
          provider,
          phoneNumber: identifier,
          countryCode: country_code,
        };
      }
      logging.info(`BindingAccountResident: ${dataCheckAndBinding}`);
      await TCCClient.checkAndBindingAccountResident(dataCheckAndBinding);
    }
    const token: token = {
      id: rToken.id,
      value: rToken.value,
      expired_date: new Date(rToken.expired_date),
      account_id: rToken.account_id,
      type: rToken.type,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const refreshToken: token = {
      id: rRefreshToken.id,
      value: rRefreshToken.value,
      expired_date: new Date(rRefreshToken.expired_date),
      account_id: rRefreshToken.account_id,
      type: rRefreshToken.type,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return { token, refreshToken };
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
    const otp = await OtpRepository.findFirst({ where: { id: otpId } });
    if (!otp) {
      throw new CustomError(OBError.IAM_IDT_004);
    }
    const findingIdentifier = await IdentityRepository.findMany({
      where: {
        account_id: accountId,
        provider: provider,
      },
    });
    if (findingIdentifier.length >= CONST.IDENTITY_LIMIT) {
      throw new CustomError(OBError.IAM_IDT_009);
    }
    const isFirstIdentifier = isEmpty(findingIdentifier);
    const identityMeta = this.generateMeta(identity);
    const formmatedIdentifier = getIdentifier(provider, identifier, country_code);
    await IdentityRepository.create({
      data: {
        identifier: formmatedIdentifier,
        provider,
        account_id: accountId,
        default: isFirstIdentifier,
        meta: identityMeta,
      },
    });

    const eventName =
      provider === IdentityProvider.email ? 'ob-iam.identity.email_added' : 'ob-iam.identity.phone_added';
    EventProducer.send({
      name: eventName,
      payload: {
        account_id: accountId,
        identity: {
          identifier: formmatedIdentifier,
          provider,
          default: isFirstIdentifier,
        },
      },
    });
    logging.info('created Identity - createNewIdentity');

    if (findingIdentifier.length > 1) {
      ExternalIdentityRepository.findFirst({ where: { type: 'tcc', account_id: accountId } }).then((extIdentity) => {
        if (extIdentity) {
          TCCClient.createAuthAlias({ username: extIdentity.uid, newAttribute: formmatedIdentifier });
        }
      });
    }

    return true;
  }

  public async getProfile(accountId: string): Promise<typeof profile> {
    logging.info('start call account service - get user profile');

    const profile = await ProfileRepository.findFirst({
      where: {
        account_id: accountId,
      },
    });

    return profile;
  }

  public async updateProfile(accountId: string, profileData: UpdateProfile): Promise<typeof profile> {
    logging.info('start call account service - get user profile');

    await ProfileRepository.update({
      where: {
        account_id: accountId,
      },
      data: {
        ...profileData,
      },
    });

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

    await AccountRepository.update({ data: { ...accountUpdateData }, where: { ...accountWhereUniqueData } });

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

  public async bulkDelete(accountWhereData: AccountWhereData): Promise<boolean> {
    logging.info('start call account service - bulk delete user account');

    await AccountRepository.deleteMany({ where: { ...accountWhereData } });

    logging.info('finish call account service - bulk delete user account');

    return true;
  }

  public async verifyPassword(accountId: string, password: string): Promise<boolean> {
    logging.info('start call account service - verify password');

    const account = await AccountRepository.findFirst({
      where: {
        id: accountId,
        password: {
          not: null,
        },
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

  public async updatePassword(accountId: string, password: string): Promise<boolean> {
    logging.info('start call account service - update password');

    const account = await AccountRepository.findFirst({ where: { id: accountId } });
    if (!account) {
      throw new CustomError(OBError.IAM_IDT_003);
    }

    const encryptPassword = await hashPassword(password);

    const eventName = isNull(account.password) ? 'ob-iam.account.password_set' : 'ob-iam.account.password_reset';

    await AccountRepository.update({
      data: {
        password: encryptPassword,
      },
      where: {
        id: accountId,
      },
    });

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
    return await AccountRepository.findFirst({
      where: {
        id,
      },
    });
  }

  public async resetPassword(req: Request): Promise<resetPasswordResult> {
    logging.info('Start reset PASSWORD...');

    const identity = get(req, ['body', 'identity']);
    const { identifier, provider, country_code } = identity;

    const isDeleted = await IdentityRepository.findFirst({
      where: {
        identifier: getIdentifier(provider, identifier, country_code),
        provider: identity.provider,
        account: { deleted_at: { not: null } },
      },
    });

    if (isDeleted) {
      throw new CustomError(OBError.IAM_AUTH_003);
    }

    const id = get(req, 'body.identity.otp', null);
    const reference = get(req, 'body.identity.reference', null);

    const account = await otpStrategy(req, id, reference);

    if (account) {
      const result = await this.authService.check2FA(account, 'passwordStrategy', req);

      if (result) {
        return result;
      }
      logging.info('starting reset password process');

      const {
        body: { hashedPassword },
      } = req;
      const encryptPassword = await hashPassword(hashedPassword);

      await AccountRepository.update({
        data: {
          password: encryptPassword,
        },
        where: {
          id: account.id,
        },
      });

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

  public async getIdentity(accountId: string): Promise<Identity[]> {
    const identities = await IdentityRepository.findMany({
      where: { account_id: accountId },
    });

    const identityObjects: Identity[] = identities.map((identity) => ({
      id: identity.id,
      identifier: identity.identifier,
      meta: identity.meta !== null ? identity.meta : { identifier: '' }, // Modify to match the structure of IdentitiesData
      provider: identity.provider as IdentityProvider, // Modify to match the type of 'provider'
      account_id: identity.account_id, // Add the 'account_id' property
      verified_at: identity.verified_at,
      linked_at: identity.linked_at,
      unlinked_at: identity.unlinked_at,
      created_at: identity.created_at,
      updated_at: identity.updated_at,
      default: identity.default,
    }));

    return identityObjects;
  }

  public async getAccountDetail(accountId: string): Promise<AccountDataResponse> {
    const device = await this.deviceService.find(accountId);
    const profile = await this.getProfile(accountId);
    const identity = await this.getIdentity(accountId);
    const account = await AccountRepository.findFirst({
      where: {
        id: accountId,
      },
    });

    if (device) {
      return {
        account: {
          isDeleted: account?.deleted_at,
          device: {
            id: device.device_id,
          },
          profile: profile,
          identity: identity,
        },
      };
    }
    throw new CustomError(OBError.IAM_ACC_007);
  }

  public createTCCAccount(
    identifier: string,
    password: string,
    firstName: string,
    lastName: string,
    accountId: string,
  ): void {
    logging.info(`Starting createTCCAccount with identifier: ${identifier}, accountId: ${accountId}`);

    try {
      TCCClient.createUser({ emailOrPhone: identifier, password, firstName, lastName })
        .then((response) => {
          logging.info(
            `Received response from TCCClient.createUser for identifier: ${identifier}, status: ${response.status}`,
          );

          if (response.status === 200) {
            const username = response.data.username;
            logging.info(`TCC account creation successful for identifier: ${identifier}, username: ${username}`);

            ExternalIdentityRepository.create({
              data: {
                account: { connect: { id: accountId } },
                identifier: identifier,
                type: 'tcc',
                uid: username,
                meta: JsonConvert.objectToJson(response.data),
              },
            })
              .then((result) => {
                logging.info(`External identity created for identifier: ${identifier}, uid: ${username}`);
                EventProducer.send({
                  name: 'ob-iam.external_identity.created',
                  payload: {
                    external_identity: result,
                  },
                });
              })
              .catch((error) => {
                logging.error(`Error creating external identity for identifier: ${identifier}`, error.message);
              });
          } else {
            logging.info(`TCC account creation failed for identifier: ${identifier}, status: ${response.status}`);
          }
        })
        .catch((error) => {
          logging.error(`Error in TCCClient.createUser for identifier: ${identifier}`, error.message);
        });
    } catch (error) {
      logging.error(`Unexpected error in createTCCAccount for identifier: ${identifier}`, error);
    }

    logging.info(`Completed createTCCAccount for identifier: ${identifier}`);
  }

  public async getAccountIdFromEmail(email: string): Promise<string> {
    logging.info(`Start getAccountIdFromEmail with email: ${email}`);
    if (!email) {
      logging.error('Email is required and cannot be empty!');
      throw new CustomError(OBError.IAM_IDT_006);
    }

    const isValidIdentity = this.identityService.validate(email, IdentityProvider.email);
    if (!isValidIdentity) {
      logging.error(`Identity invalid for email: ${email}`);
      throw new CustomError(OBError.IAM_IDT_0011);
    }
    const identity = await IdentityRepository.findFirst({
      where: {
        identifier: email,
      },
    });

    if (!identity) {
      logging.error(`Identity not found for email: ${email}`);
      throw new CustomError(OBError.IAM_IDT_003);
    }

    logging.info(`Found account_id for email: ${email}`);
    return identity.account_id;
  }

  public async suspendAccount(accountId: string): Promise<boolean> {
    logging.info(`start suspending account: ${accountId}`);
    const account = await AccountRepository.findFirst({ where: { id: accountId } });
    if (!account) {
      throw new CustomError(OBError.IAM_IDT_003);
    }
    logging.info('start call account service - get user profile');

    const result = await AccountRepository.update({
      where: {
        id: accountId,
      },
      data: {
        suspend_at: new Date(),
      },
    });
    return result != null;
  }
  public async unsuspendAccount(accountId: string): Promise<boolean> {
    logging.info(`start unsuspending account: ${accountId}`);
    const account = await AccountRepository.findFirst({ where: { id: accountId } });
    if (!account) {
      throw new CustomError(OBError.IAM_IDT_003);
    }
    logging.info('start call account service - remove suspend date');

    const result = await AccountRepository.update({
      where: {
        id: accountId,
      },
      data: {
        suspend_at: null,
      },
    });
    return result != null;
  }
}
