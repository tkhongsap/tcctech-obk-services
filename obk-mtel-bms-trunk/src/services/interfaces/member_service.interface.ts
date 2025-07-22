import { Member, Tenant } from '../../../db/client/';

export interface PersonErrorSync {
  type: string;
  uid_name: string;
}

export interface tenant extends Partial<Tenant> {}

export interface memberIndexInterface extends Partial<Member> {
  redemption_authorized: boolean;
  tenant: tenant | null;
  can_preregister?: boolean;
}
