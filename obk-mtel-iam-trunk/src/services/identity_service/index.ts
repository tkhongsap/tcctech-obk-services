import { Prisma } from '../../../db';
import { CustomError } from '../../midlewares/error';
import BaseRepository from '../../repositories/base_repository';
import ExternalIdentityRepository from '../../repositories/external_identity_repository';
import IdentityRepository from '../../repositories/identity_repository';
import { OBError } from '../../utils/error_spec';
import logging from '../../utils/logging';
import { IdentityResponse, SSOType } from './index.interface';
import { get, isEmpty, map, sortBy } from 'lodash';
import { identity, IdentityProvider } from '../../../db/client';
import { EventProducer } from '../../utils/kafka';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import { JsonConvert } from '../../utils/json_convert';
import TCCClient from '../../libs/tcc_client';
import cache from '../../libs/cache';

export default class IdentityService {
  public baseRepository: BaseRepository;

  constructor(baseRepository?: BaseRepository) {
    this.baseRepository = baseRepository || new BaseRepository();
  }

  private validateFormat(identifier: string, provider: 'email' | 'phone' | 'sso' | 'keycloak'): boolean {
    const STRING_FORMAT = {
      email: /^\w+([.-]?\w+)+(\+?\d?)*@\w+([.-]?\w+)*(\.\w\w+)+$/,
      phone: /^[+]{1}[0-9]*$/g,
      sso: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/,
      keycloak: /^\w+([.-]?\w+)+(\+?\d?)*@\w+([.-]?\w+)*(\.\w\w+)+$/,
    };

    return STRING_FORMAT[provider].test(identifier);
  }

  public async validate(identifier: string, provider: 'email' | 'phone' | 'sso' | 'keycloak'): Promise<boolean> {
    const isValidFormat = this.validateFormat(identifier, provider);

    if (!isValidFormat) {
      return false;
    }

    const isUnique = await cache.getSet(
      `Indetity_${identifier}_${provider}`,
      async () => {
        const identityData = await IdentityRepository.findFirst({ where: { identifier, provider } });
        if (identityData) {
          return JSON.stringify(identityData);
        } else {
          return '';
        }
      },
      3600,
    );

    return !isEmpty(isUnique);
  }

  public async findAll(accountId: string, provider?: IdentityProvider): Promise<IdentityResponse[]> {
    const where = provider ? { provider, account_id: accountId } : { account_id: accountId };
    const select = {
      id: true,
      identifier: true,
      provider: true,
      default: true,
    };
    const condition: Prisma.identityFindManyArgs = { where, select };
    const result = await IdentityRepository.findMany(condition);
    const identities = Promise.all(
      result.map(async (identity) => {
        const externalIdentity = await ExternalIdentityRepository.findMany({
          where: {
            account_id: identity.account_id,
            identifier: identity.identifier,
            type: {
              notIn: ['fs', 'tcc'],
            },
          },
        });

        const ssoTypes = map(sortBy(externalIdentity, ['type']), (item) => {
          const type = get(item, 'type') as unknown as SSOType;

          return type;
        });

        if (ssoTypes) {
          return {
            ...identity,
            type: ssoTypes,
          };
        }
        return identity;
      }),
    );
    return identities;
  }

  public async find(data: Prisma.identityWhereInput): Promise<typeof identities> {
    const identities = await IdentityRepository.findMany({ where: data });
    return identities;
  }

  public async findFirstByProvider(identifier: string, provider: IdentityProvider): Promise<identity | null> {
    const identities = await cache.getSet(
      `Indetity_${identifier}_${provider}`,
      async () => {
        const identityData = await IdentityRepository.findFirst({ where: { identifier, provider } });
        if (identityData) {
          return JSON.stringify(identityData);
        } else {
          return '';
        }
      },
      3600,
    );
    let res;
    if (!isEmpty(identities)) {
      res = JSON.parse(identities);
    }
    return res;
  }
  public async findFirstById(identityId: string): Promise<identity | null> {
    const identities = await cache.getSet(
      `Indetity_Id:${identityId}`,
      async () => {
        const identityData = await IdentityRepository.findFirst({ where: { id: identityId } });
        if (identityData) {
          return JSON.stringify(identityData);
        } else {
          return '';
        }
      },
      3600,
    );
    let res;
    if (!isEmpty(identities)) {
      res = JSON.parse(identities);
    }
    return res;
  }

  public async findByAccountId(accountId: string): Promise<identity[] | null> {
    const identities = await cache.getSet(
      `Indetity_AccountId:${accountId}`,
      async () => {
        const identityData = await IdentityRepository.findMany({ where: { account_id: accountId } });
        if (identityData) {
          return JSON.stringify(identityData);
        } else {
          return '';
        }
      },
      3600,
    );

    let res;
    if (!isEmpty(identities)) {
      res = JSON.parse(identities);
    }
    return res;
  }

  public async updateDefault(id: string, accountId: string): Promise<boolean> {
    const newDefult = await IdentityRepository.findFirst({ where: { id } });

    await this.baseRepository.transaction(async () => {
      if (!newDefult) {
        throw new CustomError(OBError.IAM_IDT_005);
      }
      const oldDefult = await IdentityRepository.findFirst({
        where: {
          provider: newDefult.provider,
          account_id: newDefult.account_id,
          default: true,
        },
      });
      if (oldDefult) {
        await IdentityRepository.update({
          where: { id: oldDefult?.id },
          data: { default: false },
        });
      }

      await IdentityRepository.update({
        where: { id },
        data: { default: true },
      });

      logging.info(`updated new identity for ${newDefult.provider} -  updateDefault service`);
    }, []);

    if (newDefult) {
      logging.info('start find fsExternalIdentityAccountExist');
      const fsExternalIdentityAccountExist = await ExternalIdentityRepository.findFirst({
        where: {
          identifier: newDefult.identifier,
          type: 'fs',
        },
      });

      if (!fsExternalIdentityAccountExist) {
        logging.info('no fs external identity');

        this.checkMember(newDefult.identifier, accountId);
      }

      const eventName =
        newDefult.provider === IdentityProvider.email
          ? 'ob-iam.identity.email_default_set'
          : 'ob-iam.identity.phone_default_set';
      EventProducer.send({
        name: eventName,
        payload: {
          account_id: accountId,
          identity: {
            identifier: newDefult.identifier,
            provider: newDefult.provider,
            default: true,
          },
        },
      });
    }

    return true;
  }

  public async delete(accountId: string, id: string): Promise<boolean> {
    await this.baseRepository.transaction(async () => {
      const identity = await IdentityRepository.findFirst({
        where: {
          account_id: accountId,
          id,
        },
      });
      if (!identity) {
        throw new CustomError(OBError.IAM_IDT_005);
      }
      if (identity.default) {
        throw new CustomError(OBError.IAM_IDT_008);
      }
      const identityDelete = await IdentityRepository.delete({
        where: {
          id,
        },
      });

      if (identityDelete) {
        const payload = {
          account_id: accountId,
          identity: {
            identifier: identityDelete.identifier,
            provider: identityDelete.provider,
            default: false,
          },
        };

        EventProducer.send({
          name: 'ob-iam.identity.deleted',
          payload: payload,
        });
      }

      if (identityDelete && identityDelete.provider === 'email') {
        await ExternalIdentityRepository.deleteMany({
          where: {
            identifier: identityDelete.identifier,
          },
        });
      }

      ExternalIdentityRepository.findFirst({ where: { type: 'tcc', account_id: accountId } }).then((extIdentity) => {
        if (extIdentity) {
          TCCClient.removeAuthAlias({ username: extIdentity.uid, removeAttribute: identity.identifier });
        }
      });
    }, []);

    return true;
  }

  // TO DO Remove duplicate code
  public async checkMember(identifier: string, accountId: string): Promise<void> {
    try {
      const requestResult = await OB_BMS_SDK.client.membersIndex(identifier);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const member: any = get(requestResult, 'data.data[0]');

      if (member) {
        logging.info('start create external identity for fs (identity service)');
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
      logging.info('Cannot call to BMS');
    }
  }
}
