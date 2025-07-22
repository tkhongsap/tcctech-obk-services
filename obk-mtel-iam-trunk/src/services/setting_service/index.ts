import { EventProducer } from '../../utils/kafka';
import { Prisma } from '../../../db/client';
import { CustomError } from '../../midlewares/error_middleware';
import SettingRepository from '../../repositories/setting_repository';
import IdentityRepository from '../../repositories/identity_repository';
export default class SettingService {
  private readonly settingRepository: SettingRepository;
  private readonly identityRepository: IdentityRepository;

  constructor(settingRepository?: SettingRepository, identityRepository?: IdentityRepository) {
    this.settingRepository = settingRepository || new SettingRepository();
    this.identityRepository = identityRepository || new IdentityRepository();
  }

  public async update(
    where: {
      id?: string;
      account_id: string;
    },
    data: Prisma.settingUpdateInput,
  ) {
    let setting = await SettingRepository.findFirst({ where });
    if (!setting) throw new CustomError(400, 'cannot found setting');
    await this.validate2FA(setting.account_id as string, data.two_factor_authentication_enabled as boolean);

    setting = await SettingRepository.update({ where, data });

    if (data?.current_language) {
      EventProducer.send({
        name: 'ob-iam.setting.updated',
        payload: {
          account_id: setting.account_id,
          current_language: data?.current_language,
        },
      });
    } else {
      const eventName = data.two_factor_authentication_enabled
        ? 'ob-iam.setting.2fa_activated'
        : 'ob-iam.setting.2fa_deactivated';

      EventProducer.send({
        name: eventName,
        payload: {
          account_id: setting.account_id,
          setting: {
            two_factor_enable: data.two_factor_authentication_enabled,
          },
        },
      });
    }

    return setting;
  }

  private async validate2FA(accountId: string, twoFactorAuthenticationEnabled: boolean) {
    if (twoFactorAuthenticationEnabled) {
      const identities = await IdentityRepository.findMany({
        where: {
          account_id: accountId,
        },
      });

      const hasPhone = identities.some((identity) => identity.provider === 'phone');

      if (!hasPhone) {
        throw new CustomError(402, "Phone Identity doesn't exist");
      }

      const hasEmail = identities.some((identity) => identity.provider === 'email' || identity.provider === 'sso');

      if (!hasEmail) {
        throw new CustomError(402, "Email Identity doesn't exist");
      }
    }

    return true;
  }
}
