import { DateTimeUtils, EventProducer, logging } from 'ob-common-lib/dist';
import {
  AccountRepository,
  ExternalIdentityRepository,
  IdentityRepository,
  SettingRepository,
  TokenRepository,
} from 'ob-iam/src/repositories';
import { CustomError } from 'ob-iam/src/middlewares/error';
import { IdentityProvider, account } from 'ob-iam/db/client';
import { Request } from 'express';
import {
  tokenStrategy,
  passwordStrategy,
  otpStrategy,
  compositeStrategy,
  apiKeyStrategy,
} from './login_strategies';
import { loginResult, reactivateResult } from './index.interface';
import * as jwt from 'jsonwebtoken';
import { OBError } from '../../openapi/error_spec';
import { get, set } from 'lodash';
import AttachedPermissionRepository from '../../repositories/attached_permission_repository';
import { JWTAccessTokenPayload } from '../../utils/authorization';
import DeviceService from '../device_service';
import { TypedRequest } from '../../libs/custom_express';
import { schemas } from '../../openapi/interfaces/schemas';
import { Dayjs } from 'dayjs';
import {
  arrayBufferToOutput,
  encryptWithPublicKey,
  importKeyFromPem,
} from '../../utils/encrypt';
import { KEY_PAIRS } from '../../constants/key_pairs';
import BaseRepository from '../../repositories/base_repository';
import { token } from 'ob-iam/db/client';
import { getIdentifier } from '../../utils/identifier';

export default class AuthService {
  private readonly accountRepository: AccountRepository;
  private readonly identityRepository: IdentityRepository;
  private readonly tokenRepository: TokenRepository;
  private readonly settingRepository: SettingRepository;
  private readonly attachedPermissionRepository: AttachedPermissionRepository;
  private readonly deviceService: DeviceService;
  private readonly externalIdentityRepository: ExternalIdentityRepository;
  private readonly baseRepository: BaseRepository;

  constructor(
    accountRepository?: AccountRepository,
    identityRepository?: IdentityRepository,
    tokenRepository?: TokenRepository,
    settingRepository?: SettingRepository,
    attachedPermissionRepository?: AttachedPermissionRepository,
    deviceService?: DeviceService,
    externalIdentityRepository?: ExternalIdentityRepository,
    baseRepository?: BaseRepository,
  ) {
    this.accountRepository = accountRepository || new AccountRepository();
    this.identityRepository = identityRepository || new IdentityRepository();
    this.tokenRepository = tokenRepository || new TokenRepository();
    this.settingRepository = settingRepository || new SettingRepository();
    this.attachedPermissionRepository =
      attachedPermissionRepository || new AttachedPermissionRepository();
    this.deviceService = deviceService || new DeviceService();
    this.externalIdentityRepository =
      externalIdentityRepository || new ExternalIdentityRepository();
    this.baseRepository = baseRepository || new BaseRepository();
  }

  public async validateIdentity(
    identity: string,
    identityType: IdentityProvider,
  ): Promise<boolean> {
    const identityResult = await this.identityRepository.findIdentity(
      identity,
      identityType,
    );
    return identityResult == null;
  }

  public async generateToken(accountId: string): Promise<typeof token> {
    const attachedPermissions =
      await this.attachedPermissionRepository.findMany({
        account_id: accountId,
      });

    if (!attachedPermissions) {
      throw new CustomError(OBError.IAM_AUTH_004);
    }
    const currentDate = DateTimeUtils.getCurrentDateTime();
    const secret = process.env.JWT_SECRET_KEY || '';
    if (!secret) {
      logging.error('cannot load JWT secret');
    }
    const expiredDate = DateTimeUtils.addTime(
      currentDate.toString(),
      1,
      'months',
    );
    const payload: JWTAccessTokenPayload = {
      sub: accountId,
      iat: DateTimeUtils.getCurrentDateTime().unix(),
      exp: expiredDate.unix(),
      permission: attachedPermissions,
    };
    const jwtToken = jwt.sign(payload, secret, {
      algorithm: 'HS256',
    });

    const expiredDateFormat = DateTimeUtils.formatDate(
      expiredDate.toString(),
      'YYYY-MM-DDTHH:mm:ss+07:00',
    );

    const token = (await this.baseRepository.transaction(async () => {
      await this.tokenRepository.updateMany(
        {
          account_id: accountId,
          type: 'long live',
        },
        {
          active: false,
        },
      );

      return await this.tokenRepository.createToken({
        account: {
          connect: {
            id: accountId,
          },
        },
        value: jwtToken,
        expired_date: expiredDateFormat,
        type: 'long live',
      });
    }, [this.tokenRepository])) as token;

    return token;
  }

  public async logout(token: string): Promise<typeof tokenUpdate> {
    logging.info('auth service logout');

    const tokenUpdate = await this.tokenRepository.update(
      { value: token },
      { active: false },
    );

    if (!tokenUpdate) {
      logging.error('auth service logout err token not found');
      throw new CustomError(OBError.IAM_STT_001);
    }
    return tokenUpdate;
  }

  public async login(
    req: TypedRequest<schemas['LoginAuthRequestBody']>,
  ): Promise<loginResult> {
    logging.info('auth service login');

    // TODO
    // Enhance strategy remove token and send account instead of req
    const { account, strategy } = await compositeStrategy(req, [
      apiKeyStrategy,
      tokenStrategy,
      passwordStrategy,
    ]);

    const identity = get(req, 'body.identity');
    const identifier = get(identity, 'identifier');
    const provider = get(identity, 'provider');
    const country_code = get(identity, 'country_code');
    const device = get(req, 'body.device');

    // TODO Find a better way to handle this for API KEY

    if (account && strategy === 'apiKeyStrategy') {
      const existingToken = await this.tokenRepository.findActiveBy({
        account,
      });
      const token = existingToken ?? (await this.generateToken(account.id));
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
      const transformIdentity = getIdentifier(
        provider,
        identifier,
        country_code,
      );
      const isDeleted = await this.identityRepository.findBy({
        identifier: transformIdentity,
        provider: transformProvider,
        account: { deleted_at: { not: null } },
      });

      if (isDeleted) {
        throw new CustomError(OBError.IAM_AUTH_003);
      }

      const result = await this.check2FA(account, strategy, req);

      if (result) {
        return result;
      }

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

      return {
        token: {
          value: token.value,
        },
      };
    }

    logging.error('auth service login err password not match');
    throw new CustomError(OBError.IAM_AUTH_002);
  }

  public async reactivate(
    req: TypedRequest<schemas['ReactivateAuthRequestBody']>,
  ): Promise<reactivateResult> {
    const { account, strategy } = await compositeStrategy(req, [
      passwordStrategy,
    ]);
    if (account) {
      const result = await this.check2FA(account, strategy, req, true);
      const device = get(req, 'body.device');

      if (result) {
        return result;
      }

      await this.accountRepository.update(
        {
          deleted_at: null,
        },
        {
          id: account.id,
        },
      );

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

  public async check2FA(
    account: account,
    strategy: string,
    req: Request,
    includeDeletedAccount?: boolean,
  ): Promise<loginResult | null> {
    if (await this.is2FARquired(account, strategy)) {
      const id = get(req, 'body.otp.id', null);
      const reference = get(req, 'body.otp.reference', null);

      const _account = await otpStrategy(
        req,
        id,
        reference,
        includeDeletedAccount,
      );

      if (!_account) {
        const { provider: requestingProvider } = req.body.identity;
        const twoFAProvider =
          requestingProvider === 'phone' ? 'email' : 'phone';
        const identity = await this.identityRepository.findBy({
          account_id: account.id,
          provider: twoFAProvider,
          default: true,
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

  public async generateQRToken(accountId: string): Promise<typeof token> {
    const currentDate = DateTimeUtils.getCurrentDateTime();
    const expiredDate = DateTimeUtils.addTime(
      currentDate.toString(),
      10,
      'minutes',
    );

    const data = {
      external_identities: {},
    };

    // TODO: find a better way to fetch data required for QR Token dynamically instead of hardcode
    // TODO: keep key pair properly, this is only for FS integration testing, must refacrtor for PRODUCTION

    const identity = await this.externalIdentityRepository.find({
      account_id: accountId,
      type: 'fs',
    });
    if (identity) {
      const publicKey = await importKeyFromPem(KEY_PAIRS.fs.publicKey);
      const encryptedIdentityData = await encryptWithPublicKey(publicKey, {
        uid: identity.uid,
      });
      set(
        data,
        'external_identities.fs',
        arrayBufferToOutput(encryptedIdentityData),
      );
    }
    const jwtToken = this.generateJWTToken(
      accountId,
      data,
      currentDate,
      expiredDate,
    );

    const token = (await this.baseRepository.transaction(async () => {
      await this.tokenRepository.updateMany(
        {
          account_id: accountId,
          type: 'qr',
        },
        {
          active: false,
        },
      );
      return await this.tokenRepository.createToken({
        account: {
          connect: {
            id: accountId,
          },
        },
        value: jwtToken,
        expired_date: expiredDate.toISOString(),
        type: 'qr',
      });
    }, [this.tokenRepository])) as token;

    return token;
  }

  public async getEncryptedData(
    tokenId: string,
    resource: string,
  ): Promise<string> {
    const token = await this.tokenRepository.findBy({
      id: tokenId,
      active: true,
      expired_date: {
        gt: DateTimeUtils.getCurrentDateTime().toISOString(),
      },
    });

    if (token) {
      const data = token.value;
      const decodeData = jwt.decode(data);
      if (decodeData) {
        const resourceData = get(decodeData, ['external_identities', resource]);
        return resourceData;
      }
    }
    throw new CustomError(OBError.IAM_AUTH_001);
  }

  private generateJWTToken(
    accountId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>,
    issuedAt: Dayjs,
    expiredAt: Dayjs,
  ): typeof jwtToken {
    const payload = {
      sub: accountId,
      iat: issuedAt.unix(),
      exp: expiredAt.unix(),
      ...data,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      algorithm: 'HS256',
    });

    return jwtToken;
  }

  private async is2FARquired(
    account: account,
    strategy: string,
  ): Promise<boolean> {
    const setting = await this.settingRepository.find({
      account_id: account.id,
    });

    return (
      setting.two_factor_authentication_enabled &&
      strategy === 'passwordStrategy'
    );
  }
}
