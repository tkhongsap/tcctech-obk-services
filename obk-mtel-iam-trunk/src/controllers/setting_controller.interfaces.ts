export interface SettingResult {
  setting: {
    two_factor_authentication_enabled: boolean;
    password_enabled: boolean;
  };
}
export interface SettingBody {
  two_factor_authentication_enabled?: boolean;
  password_enabled?: boolean;
  current_language?: SupportLanguage;
}

export type SupportLanguage = 'en' | 'th' | 'cs';
