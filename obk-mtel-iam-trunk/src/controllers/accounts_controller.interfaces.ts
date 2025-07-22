import { Identity } from '../services/account_service/index.interface';
import { ProfileData } from './account_controller.interfaces';

export interface AccountDataResponse {
  account?: {
    isDeleted?: Date | null;
    device?: {
      id: string;
    };
    profile?: ProfileData | null;
    identity?: Identity[] | null;
  };
}

export interface RemoveIdentity {
  identityId: string;
}

export interface DefaultIdentity {
  identityId: string;
}
