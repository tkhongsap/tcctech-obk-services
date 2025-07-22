import { Prisma } from '../../../db/client';
import { loginResult } from '../auth_service/index.interface';

export type Identity = Omit<Prisma.identityCreateInput, 'account'>;

export type Profile = Omit<Prisma.profileCreateInput, 'account'>;
export type UpdateProfile = Omit<Prisma.profileUpdateInput, 'account'>;
export type AccountUpdateData = Prisma.accountUpdateInput;
export type AccountWhereUniqueData = Prisma.accountWhereUniqueInput;
export type AccountWhereData = Prisma.accountWhereInput;

export interface AuthServiceRegisterInput {
  profile: Profile;
  identities: {
    meta?: object;
    identifier: string;
    provider: Identity['provider'];
    country_code?: string;
  };
  password: string | null;
  device?: {
    device_id: string;
    os: string;
  };
  push_token: {
    value: string;
    type: string;
  };
}

export type resetPasswordResult = loginResult;

export interface CreateAccountServiceInput {
  permissions?: Prisma.attached_permissionCreateInput[];
}
