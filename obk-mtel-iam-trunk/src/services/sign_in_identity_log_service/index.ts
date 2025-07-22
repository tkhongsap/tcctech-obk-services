import { CustomError } from '../../midlewares/error';
import ExternalIdentityRepository from '../../repositories/external_identity_repository';
import IdentityRepository from '../../repositories/identity_repository';
import SignInIdentityLogRepository from '../../repositories/sign_in_identity_log_repository';
import { OBError } from '../../utils/error_spec';
import logging from '../../utils/logging';
import ActivityLogService from '../activity_log_service';
import ExternalIdentityService from '../external_identity_service';
import IdentityService from '../identity_service';

export default class SignInIdentityLogService {
  private readonly externalIdentityService: ExternalIdentityService;
  private readonly identityService: IdentityService;

  constructor(externalIdentityService?: ExternalIdentityService, identityService?: IdentityService) {
    this.externalIdentityService = externalIdentityService || new ExternalIdentityService();
    this.identityService = identityService || new IdentityService();
  }

  public async create(accountId: string, identity: string) {
    let identityUser;
    try {
      identityUser = await IdentityRepository.findFirst({
        where: { identifier: identity, account_id: accountId },
      });
    } catch (error) {
      logging.error('Error finding identity user:', error);
      return;
    }

    if (!identityUser) {
      logging.info(`Identity not found for account: ${accountId} – identifier: ${identity}`);
      return;
    }

    try {
      await SignInIdentityLogRepository.create({
        data: {
          account_id: accountId,
          identity_id: identityUser.id,
        },
      });
    } catch (error) {
      logging.error('Error creating SignInIdentityLog:', error);
    }
  }

  public async show(accountId: string) {
    let signInIdentityLog;
    let identity;
    let externalIdentities;
    try {
      signInIdentityLog = await SignInIdentityLogRepository.findFirst({
        where: { account_id: accountId },
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      logging.info('Error finding signInIdentityLog: ', error);
    }

    if (!signInIdentityLog) {
      logging.info('not found SignInIdentityLog for account:', accountId);
      throw new CustomError(OBError.IAM_SIIL_001);
    }

    try {
      identity = await this.identityService.findFirstById(signInIdentityLog.identity_id);
    } catch (error) {
      logging.error('Error finding identity user:', error);
    }
    if (!identity) {
      logging.info(`Identity not found for account: ${accountId}`);
    }

    const activityLogService = new ActivityLogService();
    const activityLog = await activityLogService.showActivityLog(signInIdentityLog.account_id);
    try {
      if (identity?.account_id) {
        externalIdentities = await this.externalIdentityService.checkExternalIdentityByAccountId(identity?.account_id);
      }
    } catch (error) {
      logging.error('Error finding ExternalIdentity:', error);
    }

    return {
      ...signInIdentityLog,
      identity,
      activityLog,
      externalIdentities,
    };
  }
}
