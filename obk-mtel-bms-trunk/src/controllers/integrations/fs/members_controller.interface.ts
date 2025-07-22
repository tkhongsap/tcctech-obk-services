export interface CreateFSMembersBody {
  count: number;
  data: PersonData[];
}

export interface DestroyFSMembers {
  member_ids: string[];
}

export interface PersonData {
  personID: string;
  tenantIDs: number[];
  phones: string[];
  emails: string[];
  locations: LocationData[];
  updateTime: string;
  active: boolean;
  status: string;
  canPreRegister: boolean;
}

interface LocationData {
  locationID: number;
  locationName: string;
  isDefault: boolean;
}
export interface CreateResidenceFSMembersBody {
  count: number;
  data: PersonDataResident[];
}

export interface PersonDataResident {
  personID: string;
  residenceIDs: number[];
  phones: string[];
  emails: string[];
  updateTime: string;
  active: boolean;
  status?: string;
}

export interface CreateMemberResult {
  result: boolean;
  error: {
    type: string;
    uid_name: string;
  }[];
}
export interface IRecordOfAny {
  [key: string]: any;
}
export interface CreateMembersResponse {
  result: boolean;
  data: IRecordOfAny;
  error: IRecordOfAny | null;
}

export interface DestroyMembersResponse {
  result: boolean;
  data: IRecordOfAny;
  error: IRecordOfAny | null;
}
