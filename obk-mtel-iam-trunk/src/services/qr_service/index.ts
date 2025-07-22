import cache from '../../libs/cache';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../../midlewares/error';
import { OBError } from '../../utils/error_spec';
import { CacheQrToken, EncryptedDataResult, QrTokenResult } from './index.interface';
import { DateTimeUtils } from '../../utils/datetime';
import ExternalIdentityService from '../external_identity_service';
import { ExternalIdentityType } from '../../controllers/sign_in_identity_log_controller.interfaces';
import { arrayBufferToOutput, encryptWithPublicKey, importKeyFromPem, sanitizeKey } from '../../utils/encrypt';
import { get, set } from 'lodash';
import AuthService from '../auth_service';
import KeyPairService from '../key_pair_service';
import ApiKeyService from '../api-key_service';
import * as jwt from 'jsonwebtoken';
import logging from '../../utils/logging';
import IdentityService from '../identity_service';

export default class QrService {
  public authService: AuthService;
  public apiKeyService: ApiKeyService;
  public keyPairService: KeyPairService;
  public identityService: IdentityService;
  public externalIdentityService: ExternalIdentityService;
  public keyCacheAccount = 'QR_TOKEN_ACCOUNT:';
  public keyCacheToken = 'QR_TOKEN_ID:';
  public keyCacheTokenValue = 'QR_TOKEN_VALUE:';
  private type = 'qr';

  constructor(
    authService?: AuthService,
    apiKeyService?: ApiKeyService,
    keyPairService?: KeyPairService,
    identityService?: IdentityService,
    externalIdentityService?: ExternalIdentityService,
  ) {
    this.authService = authService || new AuthService();
    this.apiKeyService = apiKeyService || new ApiKeyService();
    this.keyPairService = keyPairService || new KeyPairService();
    this.externalIdentityService = externalIdentityService || new ExternalIdentityService();
    this.identityService = identityService || new IdentityService();
  }
  public async find(accountId: string, type: string = this.type): Promise<QrTokenResult> {
    const cacheData = await cache.get(`${this.keyCacheAccount}${accountId}:${type}`);
    let token: CacheQrToken;
    if (cacheData) {
      token = JSON.parse(cacheData);
      if (!token) {
        throw new CustomError(OBError.OB_006);
      }
    } else {
      throw new CustomError(OBError.OB_006);
    }
    const res: QrTokenResult = {
      token: {
        id: token.id,
        expired_date: token.expired_date,
      },
    };
    return res;
  }

  public async getByTokenId(tokenId: string): Promise<CacheQrToken | null> {
    const cacheData = await cache.get(this.keyCacheToken + tokenId);
    let token: CacheQrToken;
    if (cacheData) {
      token = JSON.parse(cacheData);
      if (!token) {
        return null;
      }
    } else {
      return null;
    }
    return token;
  }

  public async getByTokenValue(tokenValue: string): Promise<CacheQrToken | null> {
    const cacheData = await cache.get(this.keyCacheTokenValue + tokenValue);
    let token: CacheQrToken;
    if (cacheData) {
      token = JSON.parse(cacheData);
      if (!token) {
        return null;
      }
    } else {
      return null;
    }
    return token;
  }

  public async generateQRToken(accountId: string): Promise<QrTokenResult> {
    const identity = await this.externalIdentityService.checkExternalIdentityByAccountType(
      accountId,
      ExternalIdentityType.fs,
    );

    const identityList = await this.identityService.findByAccountId(accountId);
    const emailList = identityList
      ? identityList
          .filter((identity) => identity.provider == 'email')
          .map((identity) => ({
            email: identity.identifier,
            isDefaultEmail: identity.default,
          }))
      : [];

    const data = {
      external_identities: {},
    };

    const isResident = await this.externalIdentityService.checkExternalIdentityByAccountType(
      accountId,
      ExternalIdentityType.resident,
    );

    const keys = ['fs', 'fs_parking', 'kgi'];

    if (isResident) {
      keys.push('fs_resident_booking');
      keys.push('sm');
      keys.push('innoflex');
    }

    const keyPairs = await this.keyPairService.getKeypairsByNames(keys);

    for await (const keyPair of keyPairs) {
      const externalIdentitiesData = { uid: identity?.uid && keyPair.name !== 'innoflex' ? identity.uid : accountId };
      const sanitizedKey = sanitizeKey(keyPair.public);
      const publicKey = await importKeyFromPem(sanitizedKey);
      if (keyPair.name === 'fs_resident_booking') {
        set(externalIdentitiesData, 'emailList', emailList);
      } else if (keyPair.name === 'fs_parking') {
        if (process.env.ENABLE_SHOPPER === 'true') {
          set(externalIdentitiesData, 'accountId', accountId);
        }
      }
      const encryptedData = await encryptWithPublicKey(publicKey, externalIdentitiesData);
      set(data, ['external_identities', keyPair.name], arrayBufferToOutput(encryptedData));
    }

    const currentDate = DateTimeUtils.getCurrentDateTime();
    const expiredDate = DateTimeUtils.addTime(currentDate.toString(), 10, 'minutes');
    const jwtToken = this.authService.generateJWTToken(accountId, data, currentDate, expiredDate);
    const tokenId = uuidv4();
    const res: QrTokenResult = {
      token: {
        id: tokenId.toString(),
        expired_date: expiredDate.toISOString(),
      },
    };
    const tokenData: CacheQrToken = {
      ...res.token,
      value: jwtToken,
      type: this.type,
      account_id: accountId,
    };

    await cache.set(`${this.keyCacheAccount}${accountId}:${this.type}`, JSON.stringify(tokenData), 600);
    await cache.set(`${this.keyCacheToken}${tokenId.toString()}`, JSON.stringify(tokenData), 600);
    await cache.set(`${this.keyCacheTokenValue}${jwtToken}`, JSON.stringify(tokenData), 600);
    return res;
  }

  public async getEncryptedData(id: string, XAccountId?: string): Promise<EncryptedDataResult> {
    const apiKey = await this.apiKeyService.getApiKeyByAccountId(XAccountId as string);
    const resourceName = await this.keyPairService.getKeypairNameById(apiKey!.id);
    const encrypted_data: string = await this.decryptedData(id, resourceName);
    const res: EncryptedDataResult = {
      encrypted_data: encrypted_data,
    };
    return res;
  }

  public async decryptedData(tokenId: string, resource: string): Promise<string> {
    const token = await this.getByTokenId(tokenId);
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

  public async getTokenData(tokenId: string): Promise<string> {
    const token = await this.getByTokenId(tokenId);
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
