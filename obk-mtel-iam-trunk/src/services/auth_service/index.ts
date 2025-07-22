import { apiKeyStrategy, compositeStrategy, otpStrategy, passwordStrategy, tokenStrategy } from './login_strategies';
import { GenerateEncryptedTokenInput, IdentityProvider, loginResult, reactivateResult } from './index.interface';
import * as jwt from 'jsonwebtoken';
import { find, get, includes, last, map, set } from 'lodash';
import AttachedPermissionRepository from '../../repositories/attached_permission_repository';
import IdentityRepository from '../../repositories/identity_repository';
import { getIdentifier } from '../../utils/identifier';
import { DateTimeUtils } from '../../utils/datetime';
import {
  LoginBody,
  ReactivateAuthRequestBody,
  RenewAuthRequestBody,
} from '../../controllers/auth_controller.interfaces';
import { account, token } from '../../../db/client';
import SettingRepository from '../../repositories/setting_repository';
import logging from '../../utils/logging';
import { CustomError } from '../../midlewares/error';
import { OBError } from '../../utils/error_spec';
import { Request } from 'express';
import { TypedRequest } from '../../libs/custom_express';
import TokenRepository from '../../repositories/token_repository';
import DeviceService from '../device_service';
import AccountRepository from '../../repositories/account_repository';
import { EventProducer } from '../../utils/kafka';
import ExternalIdentityRepository from '../../repositories/external_identity_repository';
import { arrayBufferToOutput, encryptWithPublicKey, importKeyFromPem, sanitizeKey } from '../../utils/encrypt';
import dayjs, { Dayjs } from 'dayjs';
import BaseRepository from '../../repositories/base_repository';
import KeyPairRepository from '../../repositories/key_pair_repository';
import TCCClient from '../../libs/tcc_client';
import WhitelistRepository from '../../repositories/whitelist_repository';
import BlacklistService from '../blacklist_service';
import SignInIdentityLogService from '../sign_in_identity_log_service';
import cache from '../../libs/cache';
import { attachedPermission } from '../../utils/authorization';
import { v4 as uuidv4 } from 'uuid';
import { CacheQrToken } from '../qr_service/index.interface';

export default class AuthService {
  private readonly deviceService: DeviceService;
  private readonly baseRepository: BaseRepository;

  constructor(deviceService?: DeviceService, baseRepository?: BaseRepository) {
    this.deviceService = deviceService || new DeviceService();
    this.baseRepository = baseRepository || new BaseRepository();
  }

  public async login(req: TypedRequest<LoginBody>): Promise<loginResult> {
    logging.info('auth service login');

    // TODO
    // Enhance strategy remove token and send account instead of req
    const { account, strategy } = await compositeStrategy(req, [apiKeyStrategy, tokenStrategy, passwordStrategy]);

    const identity = get(req, 'body.identity');
    const identifier = get(identity, 'identifier');
    const provider = get(identity, 'provider');
    const country_code = get(identity, 'country_code');
    const device = get(req, 'body.device');
    const pushToken = get(req, 'body.push_token');

    if (account) {
      const blacklistService = new BlacklistService();
      const blacklist = await blacklistService.find(account.id);
      if (blacklist) {
        throw new CustomError(OBError.IAM_IDT_010);
      }
    }

    // TODO Find a better way to handle this for API KEY

    if (account && strategy === 'apiKeyStrategy') {
      const existingToken = await TokenRepository.findFirst({
        where: {
          account,
          expired_date: {
            gt: DateTimeUtils.getCurrentDateTime().toISOString(),
          },
          active: true,
        },
        include: { account: true },
      });

      let tokenValid: boolean = true;
      if (existingToken) {
        const tokenData: any = jwt.decode(existingToken.value);
        if (tokenData) {
          const currentDay = dayjs();
          const expiredDate = dayjs.unix(tokenData.exp ?? 0);
          if (currentDay.isAfter(expiredDate)) {
            tokenValid = false;
          }
        }
      }

      const AccountAllowForceRefreshToken = JSON.parse(process.env.ACCOUNT_ID_FORCE_REFRESH_TOKEN || '[]');
      const token =
        existingToken && tokenValid && !AccountAllowForceRefreshToken.includes(account.id)
          ? existingToken
          : await this.generateToken(account.id);
      return {
        token: {
          value: token.value,
        },
        metadata: {
          key: 'fs_building_access', // TODO: pull name from api key
          endpoint: 'https://dev.glorymtel.xyz/ob-bms', // TODO: make this dynamic
        },
      };
    }

    if (!identifier || !provider) {
      throw new CustomError(OBError.IAM_IDT_003);
    }

    if (account) {
      const transformProvider = provider === 'sso' ? 'email' : provider;
      const transformIdentity = getIdentifier(provider, identifier, country_code);
      const isDeleted = await IdentityRepository.findFirst({
        where: {
          identifier: transformIdentity,
          provider: transformProvider,
          account: { deleted_at: { not: null } },
        },
        include: { account: true },
      });

      if (isDeleted) {
        throw new CustomError(OBError.IAM_AUTH_003);
      }

      const result = await this.check2FA(account, strategy, req);

      if (result) {
        return result;
      }

      const token = await this.generateToken(account.id);
      const refreshToken = await this.generateRefreshToken(account.id);
      if (process.env.ENABLE_DEVICE_STORING === 'true') {
        if (device) {
          await this.deviceService.create({
            deviceId: device.device_id,
            os: device.os,
            accountId: account.id,
            pushToken: pushToken,
          });
        } else {
          throw new CustomError(OBError.OB_001);
        }
      } else {
        const payload = {
          account_id: account.id,
          push_token: pushToken,
        };
        EventProducer.send({
          name: 'ob-iam.fcm_token.updated',
          payload,
        });
      }

      ExternalIdentityRepository.findFirst({
        where: {
          account_id: account.id,
          type: 'tcc',
        },
      }).then((extIdentity) => {
        if (extIdentity) {
          TCCClient.login({ username: extIdentity.uid, password: account.password! });
        }
      });
      const SigninIdentityLog = new SignInIdentityLogService();
      await SigninIdentityLog.create(account.id, transformIdentity);

      return {
        token: {
          value: token.value,
        },
        refreshToken: {
          value: refreshToken.value,
        },
      };
    }

    logging.error('auth service login err password not match');
    throw new CustomError(OBError.IAM_AUTH_002);
  }

  public async loginIpadResident(req: TypedRequest<LoginBody>): Promise<loginResult> {
    const keyCache = 'RESIDENT_ACCESS_TOKEN:';
    const { account, strategy } = await compositeStrategy(req, [apiKeyStrategy, tokenStrategy, passwordStrategy]);
    const identity = get(req, 'body.identity');
    const identifier = get(identity, 'identifier');
    const provider = get(identity, 'provider');
    const country_code = get(identity, 'country_code');

    if (account) {
      const transformProvider = provider === 'sso' ? 'email' : provider;
      const transformIdentity = getIdentifier(provider, identifier, country_code);
      const isDeleted = await IdentityRepository.findFirst({
        where: {
          identifier: transformIdentity,
          provider: transformProvider,
          account: { deleted_at: { not: null } },
        },
        include: { account: true },
      });

      if (isDeleted) {
        throw new CustomError(OBError.IAM_AUTH_003);
      }

      const result = await this.check2FA(account, strategy, req);

      if (result) {
        return result;
      }
      const ResidentIdentity = await ExternalIdentityRepository.findFirst({
        where: {
          account_id: account.id,
          type: 'resident',
        },
      });

      if (!ResidentIdentity) {
        throw new CustomError(OBError.IAM_AUTH_003);
      }
      let res = {};
      const cacheRes = await cache.get(keyCache + account.id);
      if (cacheRes) {
        return JSON.parse(cacheRes);
      }

      const token = await this.generateToken(account.id, true);
      const refreshToken = await this.generateRefreshToken(account.id, true);
      const SigninIdentityLog = new SignInIdentityLogService();
      await SigninIdentityLog.create(account.id, transformIdentity);
      res = {
        token: {
          value: token.value,
        },
        refreshToken: {
          value: refreshToken.value,
        },
      };

      await cache.set(keyCache + account.id, JSON.stringify(res), 2590000);
      return res;
    }
    logging.error('auth service login resident ipad err password not match');
    throw new CustomError(OBError.IAM_AUTH_002);
  }

  public async generateToken(accountId: string, isResidentIpad: boolean = false): Promise<typeof token> {
    const attachedPermissions = await this.getAttachedPermissionByAccountId(accountId);
    if (!attachedPermissions || attachedPermissions?.length === 0) {
      // throw new CustomError(OBError.IAM_AUTH_004);
      throw new Error('Failed to generate token');
    }
    const currentDate = DateTimeUtils.getCurrentDateTime();
    const secret = process.env.JWT_SECRET_KEY || '';
    if (!secret) {
    }
    const expiredDate = DateTimeUtils.addTime(
      currentDate.toString(),
      parseInt(process.env.TOKEN_EXPIRED_MONTH ?? '1'),
      'months',
    );
    const payload = {
      sub: accountId,
      iss: process.env.JWT_ISSUER,
      iat: DateTimeUtils.getCurrentDateTime().unix(),
      exp: expiredDate.unix(),
      permission: attachedPermissions,
    };
    const jwtToken = jwt.sign(payload, secret, {
      algorithm: 'HS256',
    });

    const expiredDateFormat = DateTimeUtils.formatDate(expiredDate.toString(), 'YYYY-MM-DDTHH:mm:ss+07:00');
    const existToken = await TokenRepository.findFirst({
      where: {
        account_id: accountId,
        type: !isResidentIpad ? 'long live' : 'resident_ipad',
      },
    });
    let token: token;
    if (existToken) {
      token = (await this.baseRepository.transaction(async () => {
        return await TokenRepository.update({
          where: {
            id: existToken.id,
          },
          data: {
            value: jwtToken,
            expired_date: expiredDateFormat,
            active: true,
          },
        });
      }, [])) as token;
    } else {
      token = (await this.baseRepository.transaction(async () => {
        return await TokenRepository.create({
          data: {
            account: {
              connect: { id: accountId },
            },
            value: jwtToken,
            expired_date: expiredDateFormat,
            type: !isResidentIpad ? 'long live' : 'resident_ipad',
          },
        });
      }, [])) as token;
    }

    return token;
  }

  public async generateRegisterToken(accountId: string, isResidentIpad: boolean = false): Promise<(typeof token)[]> {
    const attachedPermissions = await AttachedPermissionRepository.findMany({
      select: {
        id: true,
        permittee_type: true,
        value: true,
        account_group_id: true,
        role_id: true,
      },
      where: {
        account_id: accountId,
      },
    });

    const currentDate = DateTimeUtils.getCurrentDateTime();
    const secret = process.env.JWT_SECRET_KEY || '';
    if (!secret) {
    }
    const expiredDate = DateTimeUtils.addTime(
      currentDate.toString(),
      parseInt(process.env.TOKEN_EXPIRED_MONTH ?? '1'),
      'months',
    );

    let refreshExpiredDate = DateTimeUtils.addTime(
      currentDate.toString(),
      parseInt(process.env.REFRESH_TOKEN_EXPIRED_MONTH ?? '120'),
      'months',
    );
    const refreshExpiredIpadDate = DateTimeUtils.addTime(
      currentDate.toString(),
      parseInt(process.env.IPAD_REFRESH_TOKEN_EXPIRED_MONTH ?? '360'),
      'months',
    );
    refreshExpiredDate = !isResidentIpad ? refreshExpiredDate : refreshExpiredIpadDate;

    const payload = {
      sub: accountId,
      iss: process.env.JWT_ISSUER,
      iat: DateTimeUtils.getCurrentDateTime().unix(),
      exp: expiredDate.unix(),
      permission: attachedPermissions,
    };

    const jwtToken = jwt.sign(payload, secret, {
      algorithm: 'HS256',
    });

    const refreshPayload = {
      sub: accountId,
      iss: process.env.JWT_ISSUER,
      iat: DateTimeUtils.getCurrentDateTime().unix(),
      exp: refreshExpiredDate.unix(),
      permission: attachedPermissions,
    };

    const refreshJwtToken = jwt.sign(refreshPayload, secret, {
      algorithm: 'HS256',
    });

    const expiredDateFormat = DateTimeUtils.formatDate(expiredDate.toString(), 'YYYY-MM-DDTHH:mm:ss+07:00');
    const refreshExpiredDateFormat = DateTimeUtils.formatDate(
      refreshExpiredDate.toString(),
      'YYYY-MM-DDTHH:mm:ss+07:00',
    );
    const refreshToken = {
      id: uuidv4(),
      account_id: accountId,
      value: refreshJwtToken,
      expired_date: refreshExpiredDateFormat,
      type: !isResidentIpad ? 'refresh' : 'refresh_resident_ipad',
    };

    const token = {
      id: uuidv4(),
      account_id: accountId,
      value: jwtToken,
      expired_date: expiredDateFormat,
      type: !isResidentIpad ? 'long live' : 'resident_ipad',
    };
    await TokenRepository.createMany({
      data: [token, refreshToken],
    });

    return [token, refreshToken];
  }

  public async getAttachedPermissionByAccountId(accountId: string): Promise<attachedPermission[] | []> {
    const permissions = await cache.getSet(
      `ATTACHED_PERMISSION:${accountId}`,
      async () => {
        const attachedPermissions = await AttachedPermissionRepository.findMany({
          select: {
            id: true,
            permittee_type: true,
            value: true,
            account_group_id: true,
            role_id: true,
          },
          where: {
            account_id: accountId,
          },
        });
        if (attachedPermissions) {
          return JSON.stringify(attachedPermissions);
        } else {
          return '[]';
        }
      },
      3600,
    );
    const res = JSON.parse(permissions);
    return res;
  }

  public async generateRefreshToken(accountId: string, isResidentIpad: boolean = false): Promise<typeof token> {
    const attachedPermissions = await this.getAttachedPermissionByAccountId(accountId);
    if (!attachedPermissions || attachedPermissions?.length === 0) {
      // throw new CustomError(OBError.IAM_AUTH_004);
      throw new Error('Failed to generate token');
    }
    const currentDate = DateTimeUtils.getCurrentDateTime();
    const secret = process.env.JWT_SECRET_KEY || '';
    if (!secret) {
    }
    let expiredDate = DateTimeUtils.addTime(
      currentDate.toString(),
      parseInt(process.env.REFRESH_TOKEN_EXPIRED_MONTH ?? '120'),
      'months',
    );
    const expiredIpadDate = DateTimeUtils.addTime(
      currentDate.toString(),
      parseInt(process.env.IPAD_REFRESH_TOKEN_EXPIRED_MONTH ?? '360'),
      'months',
    );
    expiredDate = !isResidentIpad ? expiredDate : expiredIpadDate;

    const payload = {
      sub: accountId,
      iss: process.env.JWT_ISSUER,
      iat: DateTimeUtils.getCurrentDateTime().unix(),
      exp: expiredDate.unix(),
      permission: attachedPermissions,
    };
    const jwtToken = jwt.sign(payload, secret, {
      algorithm: 'HS256',
    });

    const expiredDateFormat = DateTimeUtils.formatDate(expiredDate.toString(), 'YYYY-MM-DDTHH:mm:ss+07:00');
    const existToken = await TokenRepository.findFirst({
      where: {
        account_id: accountId,
        type: !isResidentIpad ? 'refresh' : 'refresh_resident_ipad',
      },
    });

    let token: token;
    if (existToken) {
      token = (await this.baseRepository.transaction(async () => {
        return await TokenRepository.update({
          where: {
            id: existToken.id,
          },
          data: {
            value: jwtToken,
            expired_date: expiredDateFormat,
            active: true,
          },
        });
      }, [])) as token;
    } else {
      token = (await this.baseRepository.transaction(async () => {
        return await TokenRepository.create({
          data: {
            account: {
              connect: { id: accountId },
            },
            value: jwtToken,
            expired_date: expiredDateFormat,
            type: !isResidentIpad ? 'refresh' : 'refresh_resident_ipad',
          },
        });
      }, [])) as token;
    }

    return token;
  }

  public async validateIdentity(identity: string, identityType: IdentityProvider): Promise<boolean> {
    if (process.env.ENABLE_REGISTRATION_WHITELIST === 'true' && identityType !== 'keycloak') {
      const isWhitelisted = await this.validateWhitelist(identity, identityType);
      if (!isWhitelisted) {
        throw new CustomError(OBError.IAM_IDT_0010);
      }
    }

    const identityResult = await IdentityRepository.findFirst({
      where: {
        identifier: identity,
        provider: identityType,
      },
    });
    return identityResult == null;
  }

  public async check2FA(
    account: account,
    strategy: string,
    req: Request,
    includeDeletedAccount?: boolean,
  ): Promise<loginResult | null> {
    if (await this.is2FARquired(account, strategy)) {
      const id = get(req, 'body.otp.id', null);
      const reference = get(req, 'body.otp.reference', null);

      const _account = await otpStrategy(req, id, reference, includeDeletedAccount);

      if (!_account) {
        const { provider: requestingProvider } = req.body.identity;
        const twoFAProvider = requestingProvider === 'phone' ? 'email' : 'phone';
        const identity = await IdentityRepository.findFirst({
          where: {
            account_id: account.id,
            provider: twoFAProvider,
            default: true,
          },
        });

        if (!identity) {
          logging.error('2FA is enabled but identity not found');
          throw new CustomError(OBError.IAM_STT_001);
        }

        const { identifier, provider } = identity;

        return {
          identity: { identifier, provider },
        };
      }
    }
    return null;
  }
  private async is2FARquired(account: account, strategy: string): Promise<boolean> {
    const setting = await SettingRepository.findFirstOrThrow({
      where: {
        account_id: account.id,
      },
    });

    return setting.two_factor_authentication_enabled && strategy === 'passwordStrategy';
  }

  public async reactivate(req: TypedRequest<ReactivateAuthRequestBody>): Promise<reactivateResult> {
    const { account, strategy } = await compositeStrategy(req, [passwordStrategy]);
    if (account) {
      const result = await this.check2FA(account, strategy, req, true);
      const device = get(req, 'body.device');

      if (result) {
        return result;
      }

      await AccountRepository.update({
        data: {
          deleted_at: null,
        },
        where: {
          id: account.id,
        },
      });

      const token = await this.generateToken(account.id);

      if (process.env.ENABLE_DEVICE_STORING === 'true') {
        if (device) {
          await this.deviceService.create({
            deviceId: device.device_id,
            os: device.os,
            accountId: account.id,
          });
        } else {
          throw new CustomError(OBError.OB_001);
        }
      }

      EventProducer.send({
        name: 'ob-iam.account.reactivated',
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

    logging.error('auth service login err password not match');
    throw new CustomError(OBError.IAM_AUTH_002);
  }

  public async renew(req: TypedRequest<RenewAuthRequestBody>): Promise<reactivateResult> {
    const keyCache = 'RESIDENT_ACCESS_TOKEN:';
    const type = req.body.is_resident ? 'refresh_resident_ipad' : 'refresh';
    const token = await TokenRepository.findFirst({
      where: { value: req.body.refresh_token, active: true, type: type },
    });
    if (token) {
      const newToken = await this.generateToken(token.account_id, req.body.is_resident);

      if (req.body.is_resident) {
        const cacheData = {
          token: {
            value: newToken.value,
          },
          refreshToken: {
            value: req.body.refresh_token,
          },
        };
        await cache.set(keyCache + token.account_id, JSON.stringify(cacheData), 2590000);
      }

      return {
        token: {
          value: newToken.value,
        },
      };
    }

    logging.error('auth service renew err token not match');
    throw new CustomError(OBError.IAM_AUTH_002);
  }

  public async generateQRToken(accountId: string): Promise<typeof token> {
    const currentDate = DateTimeUtils.getCurrentDateTime();
    const expiredDate = DateTimeUtils.addTime(currentDate.toString(), 10, 'minutes');

    const data = {
      external_identities: {},
    };

    // TODO: find a better way to fetch data required for QR Token dynamically instead of hardcode
    // TODO: keep key pair properly, this is only for FS integration testing, must refacrtor for PRODUCTION

    const identity = await ExternalIdentityRepository.findFirst({
      where: {
        account_id: accountId,
        type: 'fs',
      },
    });
    if (identity) {
      const keyPairs = await KeyPairRepository.findMany({
        where: { name: { in: ['fs', 'fs_parking', 'kgi', 'fs_resident_booking', 'sm', 'innoflex'] } },
      });
      for await (const keyPair of keyPairs) {
        const sanitizedKey = sanitizeKey(keyPair.public);
        const publicKey = await importKeyFromPem(sanitizedKey);
        const encryptedData = await encryptWithPublicKey(publicKey, {
          uid: identity.uid,
        });
        set(data, ['external_identities', keyPair.name], arrayBufferToOutput(encryptedData));
      }
    }
    const jwtToken = this.generateJWTToken(accountId, data, currentDate, expiredDate);

    const token = (await this.baseRepository.transaction(async () => {
      await TokenRepository.updateMany({
        where: {
          account_id: accountId,
          type: 'qr',
        },
        data: {
          active: false,
        },
      });
      return await TokenRepository.create({
        data: {
          account: {
            connect: {
              id: accountId,
            },
          },
          value: jwtToken,
          expired_date: expiredDate.toISOString(),
          type: 'qr',
        },
      });
    }, [])) as token;

    return token;
  }
  public async generateEncryptedToken(input: GenerateEncryptedTokenInput): Promise<typeof token> {
    const { accountId, payloadArray, type, expiredAt } = input;

    const currentDate = DateTimeUtils.getCurrentDateTime();
    const keyNames = map(payloadArray, (payload) => payload.name);
    const keyPairs = await KeyPairRepository.findMany({ where: { name: { in: keyNames } } });
    const value = {};

    for await (const payload of payloadArray) {
      const keyPair = find(keyPairs, { name: payload.name });
      if (!keyPair) {
        continue;
      }
      const sanitizedKey = sanitizeKey(keyPair!.public);
      const publicKey = await importKeyFromPem(sanitizedKey);
      const encryptedData = await encryptWithPublicKey(publicKey, payload.data);
      set(value, payload.name, arrayBufferToOutput(encryptedData));
    }
    let token: token;
    const jwtToken = this.generateJWTToken(accountId, value, currentDate, expiredAt);
    if (['qr', 'visitor_pass'].includes(type)) {
      const tokenId = uuidv4();
      const tokenData: CacheQrToken = {
        id: tokenId,
        value: jwtToken,
        type: type,
        account_id: accountId,
        expired_date: expiredAt.toISOString(),
      };
      token = {
        ...tokenData,
        active: true,
        expired_date: expiredAt.toDate(),
        created_at: currentDate.toDate(),
        updated_at: currentDate.toDate(),
      };
      await cache.set(`QR_TOKEN_ACCOUNT:${accountId}:${type}`, JSON.stringify(tokenData), 600);
      await cache.set(`QR_TOKEN_ID:${tokenId.toString()}`, JSON.stringify(tokenData), 600);
    } else {
      token = await TokenRepository.create({
        data: {
          account: {
            connect: {
              id: accountId,
            },
          },
          value: jwtToken,
          expired_date: expiredAt.toISOString(),
          type,
        },
      });
    }
    return token;
  }

  public async getEncryptedData(tokenId: string, resource: string): Promise<string> {
    const token = await TokenRepository.findFirst({
      where: {
        id: tokenId,
        active: true,
        expired_date: {
          gt: DateTimeUtils.getCurrentDateTime().toISOString(),
        },
      },
    });

    if (token) {
      logging.info('check token :', token);
      const data = token.value;
      const decodeData = jwt.decode(data);
      logging.info('check decodeData : ', decodeData);
      if (decodeData) {
        let resourceData = get(decodeData, ['external_identities', resource]);
        logging.info('check resourceData : ', resourceData);
        if (!resourceData) {
          resourceData = get(decodeData, [resource]);
          logging.info('check resourceData 2 : ', resourceData);
        }
        return resourceData;
      }
    }
    throw new CustomError(OBError.IAM_AUTH_001);
  }

  public async validateWhitelist(identity: string, identityType: IdentityProvider): Promise<boolean> {
    if (identityType === 'email' || identityType === 'keycloak') {
      const domain = last(identity.split('@'));

      const whitelistDomainResult = await WhitelistRepository.findMany({ where: { type: 'domain' } });
      const whitelistDomainValues = map(whitelistDomainResult, (row) => row.value);

      const whitelistEmailResult = await WhitelistRepository.findMany({ where: { type: 'email' } });
      const whitelistEmailValues = map(whitelistEmailResult, (row) => row.value);

      const isWhitelistedDomain = includes(whitelistDomainValues, domain);
      const isWhitelistedEmail = includes(whitelistEmailValues, identity);

      return isWhitelistedDomain || isWhitelistedEmail;
    }

    if (identityType === 'phone') {
      // TODO: find a way to either validate with country code or without country code
      const whitelistPhoneResult = await WhitelistRepository.findMany({ where: { type: 'phone' } });
      const whitelistPhoneValues = map(whitelistPhoneResult, (row) => row.value);
      const isWhitelistPhone =
        includes(whitelistPhoneValues, identity) || includes(whitelistPhoneValues, identity.replace('+66', '0'));
      return isWhitelistPhone;
    }

    return false;
  }

  public generateJWTToken(
    accountId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
    issuedAt: Dayjs,
    expiredAt: Dayjs,
  ): typeof jwtToken {
    const payload = {
      sub: accountId,
      iss: process.env.JWT_ISSUER,
      iat: issuedAt.unix(),
      exp: expiredAt.unix(),
      ...data,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      algorithm: 'HS256',
    });

    return jwtToken;
  }

  public async getTokenData(tokenId: string): Promise<string> {
    const token = await TokenRepository.findFirst({
      where: {
        id: tokenId,
        active: true,
        expired_date: {
          gt: DateTimeUtils.getCurrentDateTime().toISOString(),
        },
      },
    });

    if (token) {
      const data = token.value;
      const decodeData = jwt.decode(data);

      if (decodeData) {
        const id = get(decodeData, 'sub', '').toString();
        return id;
      }
    }
    throw new CustomError(OBError.IAM_AUTH_001);
  }
}
