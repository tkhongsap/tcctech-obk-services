interface ProfileData {
  id: string;
  account_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  dob: Date;
  created_at: Date;
  updated_at: Date;
  gender?: 'male' | 'female' | 'nonbinary' | 'prefernottosay' | null;
  title?: 'mr' | 'mrs' | 'ms' | 'dr' | null;
}

export interface AccountDataResponse {
  account?: {
    device?: {
      id: string;
    };
    profile?: ProfileData | null;
  };
}
