import { Omit } from 'lodash';
import { Prisma } from '../../../db/client';

export type ExternalIdentityLinkData = Omit<Prisma.external_identityCreateInput, 'account'>;

export interface MemberData {
  personID: string;
  tenantIDs: number[];
  phones: string[];
  emails: string[];
  locations: {
    locationID: number;
    locationName: string;
    isDefault: boolean;
  }[];
  updateTime: string;
  active: boolean;
  status: string;
}

export interface MemberResidentData {
  personID: string;
  residenceIDs: number[];
  phones: string[];
  emails: string[];
  updateTime: string;
  active: boolean;
  status: string;
}

export interface EvResponseSyncData {
  token: string;
  expired: string;
}