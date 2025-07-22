import { EventProducer } from 'ob-common-lib/dist';
import { Prisma } from '../../../db/client';
import { CustomError } from '../../middlewares/error_middleware';
import { SettingRepository, IdentityRepository } from '../../repositories';

export default class SettingService {
  private readonly settingRepository: SettingRepository;
  private readonly identityRepository: IdentityRepository;

  constructor(
    settingRepository?: SettingRepository,
    identityRepository?: IdentityRepository,
  ) {
    this.settingRepository = settingRepository || new SettingRepository();
    this.identityRepository = identityRepository || new IdentityRepository();
  }

  public async find(where: { id?: string; account_id?: string }) {
    return await this.settingRepository.find(where);
  }

  public async update(
    where: {
      id?: string;
      account_id?: string;
    },
    data: Prisma.settingUpdateInput,
  ) {
    let setting = await this.settingRepository.find(where);

    await this.validate2FA(
      setting.account_id as string,
      data.two_factor_authentication_enabled as boolean,
    );

    setting = await this.settingRepository.update(where, data);

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

    return setting;
  }

  private async validate2FA(
    accountId: string,
    twoFactorAuthenticationEnabled: boolean,
  ) {
    if (twoFactorAuthenticationEnabled) {
      const identities = await this.identityRepository.findAll({
        account_id: accountId,
      });

      const hasPhone = identities.some(
        (identity) => identity.provider === 'phone',
      );

      if (!hasPhone) {
        throw new CustomError(402, "Phone Identity doesn't exist");
      }

      const hasEmail = identities.some(
        (identity) =>
          identity.provider === 'email' || identity.provider === 'sso',
      );

      if (!hasEmail) {
        throw new CustomError(402, "Email Identity doesn't exist");
      }
    }

    return true;
  }
}
