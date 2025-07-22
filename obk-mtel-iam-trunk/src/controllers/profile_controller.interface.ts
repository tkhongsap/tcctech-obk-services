export interface ProfileResult {
  profile: {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    dob: string;
    title?: string | null;
    gender?: string | null;
    created_at: string;
  };
}
export interface ProfileUpdateBody {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  dob?: string;
  title?: 'mr' | 'mrs' | 'ms' | 'dr' | null;
  gender?: 'male' | 'female' | 'nonbinary' | 'prefernottosay' | null;
}
