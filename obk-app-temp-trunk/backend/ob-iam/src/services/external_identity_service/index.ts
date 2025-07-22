import { get } from 'lodash';
import { ExternalIdentityRepository } from '../../repositories';
import IdentityService from '../identity_service';
import { ExternalIdentityLinkData, MemberData } from './index.interface';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../openapi/error_spec';
import { EventProducer, JsonConvert, logging } from 'ob-common-lib/dist';
import * as OB_BMS_SDK from 'ob-bms-sdk';

export default class ExternalIdentityService {
  public externalIdentityRepository: ExternalIdentityRepository;
  public identityService: IdentityService;

  constructor(
    externalIdentityRepository?: ExternalIdentityRepository,
    identityService?: IdentityService,
  ) {
    this.externalIdentityRepository =
      externalIdentityRepository || new ExternalIdentityRepository();
    this.identityService = identityService || new IdentityService();
  }

  public async link(data: ExternalIdentityLinkData): Promise<boolean> {
    try {
      const isExternalIdentityExist = await this.validate(data);
      if (isExternalIdentityExist) {
        // Already link sso has sso in external identity table
        return isExternalIdentityExist;
      }

      const isIdentityExist = await this.identityService.validate(
        data.identifier,
        'email',
      );

      if (!isIdentityExist) {
        // identity exist but does not link with sso
        // find account id
        const account = await this.identityService.find({
          identifier: data.identifier,
          provider: 'email',
        });

        if (!account || account.length === 0) {
          throw new CustomError(OBError.IAM_IDT_003);
        }

        const accountId = get(account[0], 'account_id');

        if (!accountId) {
          throw new CustomError(OBError.IAM_IDT_003);
        }

        // link sso
        await this.externalIdentityRepository.create({
          ...data,
          account: {
            connect: { id: accountId },
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
    const isExternalIdentityExist = await this.externalIdentityRepository.find({
      identifier: data.identifier,
      type: data.type,
    });
    return isExternalIdentityExist !== null;
  }

  public async sync(data: MemberData): Promise<void> {
    const phones = data.phones;
    const emails = data.emails;

    const externalIdentityExist = await this.checkExistExternalIdentity(
      phones,
      emails,
    );
    if (!externalIdentityExist) {
      await this.checkDefaultIdentity(phones, emails, data.personID, data);
    }
  }

  public async checkExistExternalIdentity(
    phones: string[],
    emails: string[],
  ): Promise<boolean> {
    for (const identifier of [...phones, ...emails]) {
      const result = await this.externalIdentityRepository.find({
        identifier,
        type: 'fs',
      });
      if (result) {
        logging.info('Found exist external identity');
        return true;
      }
    }
    logging.info('Not found exist external identity');

    return false;
  }

  public async checkDefaultIdentity(
    phones: string[],
    emails: string[],
    uid: string,
    meta: object,
  ): Promise<void> {
    for (const identifier of [...phones, ...emails]) {
      const result = await this.identityService.find({
        identifier: identifier,
        default: true,
      });

      if (result.length > 0) {
        logging.info('Create fs external identity');

        const identity = result[0];
        const externalIdentity = await this.externalIdentityRepository.create({
          account: { connect: { id: identity.account_id } },
          identifier: identifier,
          type: 'fs',
          uid: uid,
          meta: JsonConvert.objectToJson(meta),
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
          'start create external identity for fs (external identity service)',
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
      logging.info('cannot call to BMS');
    }
  }
}
