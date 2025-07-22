import {
  ExternalIdentityRepository,
  IdentityRepository,
  OtpRepository,
} from 'ob-iam/src/repositories';
import { IdentityProvider } from '../../../db/client';
import { EventProducer, JsonConvert, logging } from 'ob-common-lib/dist';
import { IdentityResponse, SsoType } from './index.interface';
import BaseRepository from '../../repositories/base_repository';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../openapi/error_spec';
import { Prisma } from 'ob-iam/db/client';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import { get, map, sortBy } from 'lodash';

export default class IdentityService {
  public identityRepository: IdentityRepository;
  public otpRepository: OtpRepository;
  public baseRepository: BaseRepository;
  public externalIdentityRepository: ExternalIdentityRepository;

  constructor(
    identityRepository?: IdentityRepository,
    otpRepository?: OtpRepository,
    baseRepository?: BaseRepository,
    externalIdentityRepository?: ExternalIdentityRepository,
  ) {
    this.identityRepository = identityRepository || new IdentityRepository();
    this.otpRepository = otpRepository || new OtpRepository();
    this.baseRepository = baseRepository || new BaseRepository();
    this.externalIdentityRepository =
      externalIdentityRepository || new ExternalIdentityRepository();
  }

  private validateFormat(
    identifier: string,
    provider: 'email' | 'phone' | 'sso',
  ): boolean {
    const STRING_FORMAT = {
      email: /^\w+([.-]?\w+)+(\+?\d?)*@\w+([.-]?\w+)*(\.\w\w+)+$/,
      phone: /^[+]{1}[0-9]*$/g,
      sso: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w\w+)+$/,
    };

    return STRING_FORMAT[provider].test(identifier);
  }

  public async validate(
    identifier: string,
    provider: 'email' | 'phone' | 'sso',
  ): Promise<boolean> {
    const isValidFormat = this.validateFormat(identifier, provider);

    if (!isValidFormat) {
      return false;
    }

    const isUnique =
      (await this.identityRepository.findBy({
        identifier,
        provider,
      })) == null;

    if (!isUnique) {
      return false;
    }

    return true;
  }

  public async findAll(
    accountId: string,
    provider?: IdentityProvider,
  ): Promise<IdentityResponse[]> {
    const where = provider
      ? { provider, account_id: accountId }
      : { account_id: accountId };
    const select = {
      id: true,
      identifier: true,
      provider: true,
      default: true,
    };
    const result = await this.identityRepository.findAll(where, select);
    const identities = Promise.all(
      result.map(async (identity) => {
        const externalIdentity = await this.externalIdentityRepository.findAll({
          account_id: identity.account_id,
          identifier: identity.identifier,
          type: {
            not: 'fs',
          },
        });

        const ssoTypes = map(sortBy(externalIdentity, ['type']), (item) => {
          const type = get(item, 'type') as unknown as SsoType;

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

  public async find(
    data: Prisma.identityWhereInput,
  ): Promise<typeof identities> {
    const identities = await this.identityRepository.findAll(data);
    return identities;
  }

  public async updateDefault(id: string, accountId: string): Promise<boolean> {
    const newDefult = await this.identityRepository.findBy({ id });

    await this.baseRepository.transaction(async () => {
      if (!newDefult) {
        throw new CustomError(OBError.IAM_IDT_005);
      }
      const oldDefult = await this.identityRepository.findBy({
        provider: newDefult.provider,
        account_id: newDefult.account_id,
        default: true,
      });
      if (oldDefult) {
        await this.identityRepository.update({
          where: { id: oldDefult?.id },
          data: { default: false },
        });
      }

      await this.identityRepository.update({
        where: { id },
        data: { default: true },
      });

      logging.info(
        `updated new identity for ${newDefult.provider} -  updateDefault service`,
      );
    }, [this.identityRepository, this.otpRepository]);

    if (newDefult) {
      logging.info('start find fsExternalIdentityAccountExist');
      const fsExternalIdentityAccountExist =
        await this.externalIdentityRepository.find({
          identifier: newDefult.identifier,
          type: 'fs',
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
      const identity = await this.identityRepository.findBy({
        account_id: accountId,
        id,
      });
      if (!identity) {
        throw new CustomError(OBError.IAM_IDT_005);
      }
      if (identity.default) {
        throw new CustomError(OBError.IAM_IDT_008);
      }
      const identityDelete = await this.identityRepository.delete({
        id,
      });
      if (identityDelete && identityDelete.provider === 'email') {
        await this.externalIdentityRepository.deleteMany({
          identifier: identityDelete.identifier,
        });
      }
    }, [this.identityRepository, this.externalIdentityRepository]);

    return true;
  }

  // TO DO Remove duplicate code
  public async checkMember(
    identifier: string,
    accountId: string,
  ): Promise<void> {
    try {
      const requestResult = await OB_BMS_SDK.client.membersIndex(identifier);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const member: any = get(requestResult, 'data.data[0]');

      if (member) {
        logging.info(
          'start create external identity for fs (identity service)',
        );
        const externalIdentity = await this.externalIdentityRepository.create({
          account: { connect: { id: accountId } },
          identifier: identifier,
          type: 'fs',
          uid: member.uid,
          meta: JsonConvert.objectToJson(member.metadata),
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
      logging.info('Cannot call to BMS');
    }
  }
}
