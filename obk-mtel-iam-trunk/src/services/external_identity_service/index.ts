import { get, isEmpty } from 'lodash';
import { ExternalIdentityLinkData, MemberData, MemberResidentData, EvResponseSyncData } from './index.interface';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import IdentityService from '../identity_service';
import { CustomError } from '../../midlewares/error';
import { OBError } from '../../utils/error_spec';
import ExternalIdentityRepository from '../../repositories/external_identity_repository';
import logging from '../../utils/logging';
import { JsonConvert } from '../../utils/json_convert';
import { EventProducer } from '../../utils/kafka';
import { Provider } from '../../controllers/index.interface';
import { ExternalIdentityType } from '../../controllers/sign_in_identity_log_controller.interfaces';
import cache from '../../libs/cache';
import { external_identity } from '../../../db/client';
import { ExternalIdentityEvBody, ExternalIdentityIndexQuery } from '../../controllers/external_identity_controller.interfaces';
import TCCClient, { CreateAccountRegisterEVResident } from '../../libs/tcc_client';
import { AxiosResponse } from 'axios';
import { getIdentifier } from '../../utils/identifier';

export default class ExternalIdentityService {
  public identityService: IdentityService;
  constructor(identityService?: IdentityService) {
    this.identityService = identityService || new IdentityService();
  }

  public async link(data: ExternalIdentityLinkData, provider: Provider): Promise<boolean> {
    try {
      const isExternalIdentityExist = await this.validate(data);
      if (isExternalIdentityExist) {
        // Already link sso has sso in external identity table
        return isExternalIdentityExist;
      }

      const isIdentityExist = await this.identityService.validate(data.identifier, provider);

      if (isIdentityExist) {
        // identity exist but does not link with sso
        // find account id
        const account = await this.identityService.find({
          identifier: data.identifier,
          provider: provider,
        });

        if (!account || account.length === 0) {
          throw new CustomError(OBError.IAM_IDT_003);
        }

        const accountId = get(account[0], 'account_id');

        if (!accountId) {
          throw new CustomError(OBError.IAM_IDT_003);
        }

        // link sso
        await ExternalIdentityRepository.create({
          data: {
            ...data,
            account: {
              connect: { id: accountId },
            },
          },
        });
        // link sso success go to sign in

        return true;
      }
    } catch (error) {
      throw new CustomError(OBError.IAM_IDT_007);
    }

    // identity does not register go to signup
    return false;
  }

  public async validate(data: ExternalIdentityLinkData): Promise<boolean> {
    const isExternalIdentityExist = await ExternalIdentityRepository.findFirst({
      where: {
        identifier: data.identifier,
        type: data.type,
      },
    });
    return isExternalIdentityExist !== null;
  }

  public async sync(data: MemberData): Promise<void> {
    const phones = data.phones;
    const emails = data.emails;

    const externalIdentityExist = await this.checkExistExternalIdentity(phones, emails, data);
    if (!externalIdentityExist) {
      await this.checkDefaultIdentity(phones, emails, data.personID, data);
    }
  }

  public async checkExistExternalIdentity(phones: string[], emails: string[], meta?: object): Promise<boolean> {
    for (const identifier of [...phones, ...emails]) {
      const result = await ExternalIdentityRepository.findFirst({
        where: {
          identifier,
          type: 'fs',
        },
      });
      if (result) {
        if (meta) {
          await ExternalIdentityRepository.update({
            where: {
              id: result.id,
            },
            data: {
              meta: meta,
            },
          });
        }
        logging.info('Found exist external identity');
        return true;
      }
    }
    logging.info('Not found exist external identity');

    return false;
  }

  public async checkDefaultIdentity(phones: string[], emails: string[], uid: string, meta: object): Promise<void> {
    for (const identifier of [...phones, ...emails]) {
      const result = await this.identityService.find({
        identifier: identifier,
        default: true,
      });

      if (result.length > 0) {
        logging.info('Create fs external identity');

        const identity = result[0];
        const externalIdentity = await ExternalIdentityRepository.create({
          data: {
            account: { connect: { id: identity.account_id } },
            identifier: identifier,
            type: 'fs',
            uid: uid,
            meta: JsonConvert.objectToJson(meta),
          },
        });

        EventProducer.send({
          name: 'ob-iam.external_identity.created',
          payload: {
            external_identity: externalIdentity,
          },
        });

        break;
      }
    }
  }

  public async checkMember(identifier: string, accountId: string): Promise<void> {
    try {
      const requestResult = await OB_BMS_SDK.client.membersIndex(identifier);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const member: any = get(requestResult, 'data.data[0]');

      if (member) {
        logging.info('start create external identity for fs (external identity service)');
        const externalIdentity = await ExternalIdentityRepository.create({
          data: {
            account: { connect: { id: accountId } },
            identifier: identifier,
            type: 'fs',
            uid: member.uid,
            meta: member.metadata != null? JsonConvert.objectToJson(member.metadata): {},
          },
        });

        EventProducer.send({
          name: 'ob-iam.external_identity.created',
          payload: {
            external_identity: externalIdentity,
          },
        });
      } else {
        logging.info('cannot find member from bms');
      }
    } catch (error) {
      logging.error({ error });
      logging.info('cannot call to BMS');
    }
  }

  public async checkExternalIdentityByAccountType(
    accountId: string,
    type: ExternalIdentityType,
  ): Promise<external_identity> {
    const ExternalIdentityRes = await cache.getSet(
      `ExternalIdentity_${accountId}_${type}`,
      async () => {
        const ExternalIdentity = await ExternalIdentityRepository.findFirst({
          where: {
            account_id: accountId,
            type: type,
          },
        });
        if (ExternalIdentity) {
          return JSON.stringify(ExternalIdentity);
        } else {
          return '';
        }
      },
      3600,
    );
    let res;
    if (!isEmpty(ExternalIdentityRes)) {
      res = JSON.parse(ExternalIdentityRes);
    }
    return res;
  }

  public async checkExternalIdentityByAccountId(accountId: string): Promise<external_identity[]> {
    const ExternalIdentityRes = await cache.getSet(
      `ExternalIdentity_${accountId}`,
      async () => {
        const ExternalIdentity = await ExternalIdentityRepository.findMany({
          where: {
            account_id: accountId,
          },
        });
        if (ExternalIdentity) {
          return JSON.stringify(ExternalIdentity);
        } else {
          return '[]';
        }
      },
      3600,
    );
    const res = JSON.parse(ExternalIdentityRes);
    return res;
  }

  public async GetExternalIdentity(req?: ExternalIdentityIndexQuery): Promise<typeof ExternalIdentity> {
    const query: Record<string, any> = {};
    if (req?.account_id) {
      query['account_id'] = req?.account_id;
    }

    if (req?.uid) {
      query['uid'] = req?.uid;
    }

    if (req?.type) {
      query['type'] = req?.type;
    }

    if (req?.identifier) {
      query['identifier'] = req?.identifier;
    }

    if (isEmpty(query)) {
      throw new CustomError(OBError.OB_007, 'Either identifier, account_id, uid is required');
    }

    const ExternalIdentity = await ExternalIdentityRepository.findMany({
      where: query,
    });

    return ExternalIdentity;
  }

  public async syncResident(data: MemberResidentData): Promise<void> {
    const phones = data.phones;
    const emails = data.emails;

    const externalIdentityExist = await this.checkExistExternalIdentity(phones, emails);
    if (!externalIdentityExist) {
      await this.checkDefaultIdentity(phones, emails, data.personID, {});
    }
  }

  public async SyncEv(req?: ExternalIdentityEvBody): Promise<EvResponseSyncData | null> {
    logging.info('start sync ev external identity');
    const formatIdentifier = getIdentifier(req?.provider || '', req?.identifier || '', req?.country_code || '');
    let response = await this.GetExternalIdentity({ type: req?.type || 'ev_resident', account_id: req?.account_id });
    const tokenEv = process.env.TOKEN_EV_RESIDENT || '';
    let metaAccount = response[0]?.meta != undefined? JsonConvert.objectToJson(response[0]?.meta): {};
    let registerEv: AxiosResponse<CreateAccountRegisterEVResident['ResponseData']> | null = null;
    if (isEmpty(response)) {
       logging.info('create new ev external identity', req);
       registerEv = await TCCClient.createAccountRegisterEVResident({ accid: req?.account_id || '', token: tokenEv });
      if (registerEv.status !== 200) {
        throw new CustomError(OBError.OB_007, 'Cannot create ev external identity');
      }
      logging.info('create ev external identity success', registerEv);

       let jsonMeta = JsonConvert.objectToJson({
          ev_token: registerEv.data.token,
          ev_auth_token: '',
          ev_auth_expired_date: '',
        });
      const linkEvAccount = await this.link({
        identifier: formatIdentifier,
        uid: registerEv.data.token,
        type: req?.type || 'ev_resident',
        meta: jsonMeta,
      }, req?.provider || 'email');
      if (!linkEvAccount) {
        throw new CustomError(OBError.OB_007, 'Cannot link ev external identity');
      }
      metaAccount = jsonMeta;
      response = await this.GetExternalIdentity({ type: req?.type || 'ev_resident', account_id: req?.account_id });
    }

    let tokenAuth = '';
    let expireToken = '';
    const tokenEvAccount = await cache.getSet(`token_ev_account_${req?.account_id}`, async () => {
      logging.info('get token ev account', metaAccount.ev_auth_token);
      const dataAccount = await TCCClient.getAccountEVResident(metaAccount.ev_auth_token);
      if (dataAccount.status !== 200) {
        const loginEv = await TCCClient.authorizeEVResident({
          accid: req?.account_id || '',
          authPassword: tokenEv,
          authToken: metaAccount.ev_token
        });
        if (loginEv.status !== 200) {
          throw new CustomError(OBError.OB_007, 'Cannot login set 2 ev external identity');
        }
        tokenAuth = loginEv.data.token;
        expireToken = loginEv.data.expired;
      } else {
        tokenAuth = dataAccount.data.token;
        expireToken = dataAccount.data.expired;
      }
      
      const ExternalIdentity = await ExternalIdentityRepository.update({
          where: {
            id: response[0].id,
          },
          data: {
            meta: JsonConvert.objectToJson({
              ev_token: metaAccount.ev_token,
              ev_auth_token: tokenAuth,
              ev_auth_expired_date: expireToken,
            }),
          },
      });

      if (!ExternalIdentity) {
        throw new CustomError(OBError.OB_007, 'Cannot update ev external identity');
      }

      return JSON.stringify({
        token: tokenAuth,
        expired: expireToken,
      });
    }, 21600);
    
    return JSON.parse(tokenEvAccount);
  }
}
