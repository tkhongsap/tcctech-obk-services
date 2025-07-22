import { Prisma } from '../../db/client';
import { SettingResult } from './setting_controller.interfaces';

export function SettingSerializer(
  setting?: Prisma.settingGetPayload<true> | null,
  account?: Prisma.accountGetPayload<true> | null,
): SettingResult {
  return {
    setting: {
      two_factor_authentication_enabled: setting?.two_factor_authentication_enabled
        ? setting?.two_factor_authentication_enabled
        : false,
      password_enabled: account?.password ? true : false,
    },
  };
}
