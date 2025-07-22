import {hookstate, useHookstate} from '@hookstate/core';
import {TResidenceMember} from '~/features/residential/types/residenceMemberTypes';

export type UnitDirection = {
  directionId: number;
  directionCode: string;
  description: string;
};

export type UnitFloor = {
  floorZoneCode: string;
  floorId: string;
  floorDescription: string;
};

export type ResidenceAuthFloorLocation = {
  active: boolean;
  zoneID: number;
  floorID: number;
  towerID: number;
  beaconID: string;
  zoneName: string;
  floorName: string;
  projectID: number;
  towerName: string;
  beaconName: string;
  createTime: string;
  locationID: number;
  updateTime: string;
  projectName: string;
  elevatorName: string;
  locationName: string;
  zoneNameThai: string;
  beaconMajorCode: string;
  beaconMinorCode: string;
  locationNameThai: string;
};

export type ResidenceAuthFloor = {
  floorID: number;
  floorName: string;
  locations: ResidenceAuthFloorLocation[];
};

export type BIMData = {
  active: true;
  remark: string;
  houseId: string;
  createBy: number;
  updateBy: number;
  createTime: string;
  unitNumber: string;
  updateTime: string;
  residenceID: number;
  residenceAuthFloor: ResidenceAuthFloor[];
};

export type UnitDetail = {
  propertyUnitId: string;
  companyId: string;
  companyName: string;
  projectName: string;
  buildingPhase: string;
  floorZone: string;
  unitNumber: string;
  houseNumber: string;
  customer: string;
  isAllocated: boolean;
  setMapping: boolean;
  isDefault: boolean;
  isPropertyOwner: boolean;
  isPropertyResident: boolean;
  isDefaultPropertyUnit: boolean;
  backgroundUrl: string;
  iconUrl: string;
  homeId: string;
  hideLogoFromFrontEnd: boolean;
  buildingId: string;
  buildingPhaseCode: string;
  projectCode: string;
  projectId: string;
  projectsName: string;
  projectsNameThai: string;
  unitArea: string;
  ownershipRatio: string;
  floors: UnitFloor[];
  directions: UnitDirection[];
  propertyUnitTypeDetails: {
    propertyTypeId: number;
    propertyTypeCode: string;
    description: string;
  };
  warrantyStartDate: string;
  warrantyEndDate: string;
  insuranceStartDate: string;
  insuranceEndDate: string;
  projectGeoLocation: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  bimData: BIMData;
  unansweredQuestionnaires: TUnansweredQuestionnaires[];
};

export type TUnansweredQuestionnaires = {
  id: string;
  orgId: string;
  fromDate: string;
  toDate: string;
  duration: string;
  durationUnit: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  status: number;
  activeUntil: number;
  projectId: string;
  title: string;
  description: string;
  bannerImage: BannerImage;
  alreadySubmitted: string;
  submittedAt: string;
  sections: TUnansweredQuestionnairesSection[];
};

export type TUnansweredQuestionnairesSection = {
  id: number;
  orgId: number;
  seqNo: number;
  questionnaireId: number;
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  updatedBy: number;
  isDeleted: boolean;
  title: string;
  inlineImage: BannerImage;
  questions: Question[];
};

interface Question {
  id: number;
  orgId: number;
  seqNo: number;
  questionnaireId: number;
  type: number;
  allowImageUpload: boolean;
  allowFileUpload: boolean;
  required: boolean;
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  updatedBy: number;
  isDeleted: boolean;
  sectionId: number;
  question: string;
  minLength: number;
  maxLength: number;
  questionTypeName: string;
  options: null;
  images: null;
  files: null;
}

interface BannerImage {
  id: number;
  entityId: number;
  entityType: string;
  s3Url: string;
  title: string;
  name: string;
  createdAt: null;
  updatedAt: null;
  isActive: null;
  orgId: null;
  s3Path: null;
  record_id: null;
  source_rid: null;
  refImageUrl: null;
}

export type UnitSelected = {
  selectedUnit: string;
  activeIndex: number;
  defaultUnit: string;
  selectedProjectId: string;
  projectName: string;
  unitId: string;
};

export type Tenant = {
  tenantId: number | null;
  name: string;
  email: string;
  userName: string;
  mobileNo: string;
  address: string;
  gender: string;
  countryCode: string;
  isResident: boolean;
  isPropertyOwner: boolean;
  userType: string;
  nationalIdTaxId: string;
  fax: string;
  phoneNo: string;
  defaultUnit: string;
  isActive: boolean;
  properties: UnitDetail[];
};

export type LiveChatAccessToken = {
  accessToken: string;
  tokenValidFor: string;
  tokenExpiryTime: number;
};

export type ExternalIdentity = {
  id: string;
  uid: string;
  type: string;
  identifier: string;
  account_id: string;
  meta: {
    personID: string;
    tenantId: string;
  };
  created_at: string;
  updated_at: string;
};

const initialTenantState: Tenant = {
  tenantId: null,
  name: '',
  email: '',
  userName: '',
  mobileNo: '',
  address: '',
  gender: '',
  countryCode: '',
  isResident: false,
  isPropertyOwner: false,
  userType: '',
  nationalIdTaxId: '',
  fax: '',
  phoneNo: '',
  defaultUnit: '',
  isActive: false,
  properties: [],
};

const initialUnitSelectedState: UnitSelected = {
  selectedUnit: '',
  activeIndex: 0,
  defaultUnit: '',
  selectedProjectId: '',
  projectName: '',
  unitId: '',
};

const residentialTenantState = hookstate<Tenant>(initialTenantState);
export const residentialUnitSelectedState = hookstate<UnitSelected>(
  initialUnitSelectedState,
);
const residentialUnits = hookstate<UnitDetail[]>([]);
const residentialDefaultUnit = hookstate<UnitDetail | null>(null);

export const useResidentialTenantState = () =>
  useHookstate(residentialTenantState);
export const useResidentialUnitSelectedState = () =>
  useHookstate(residentialUnitSelectedState);
export const useResidentialUnits = () => useHookstate(residentialUnits);
export const useResidentialDefaultUnit = () =>
  useHookstate(residentialDefaultUnit);
export const residentialHomeAutomationId = hookstate<string | null>(null);
export const residentialTenantId = hookstate<number | null>(null);
export const residentialPersonaActive = hookstate<boolean>(false);
export const liveChatAccessToken = hookstate<LiveChatAccessToken | null>(null);
export const contactConciergePhoneNumber = hookstate<string | null>(null);
export const fsPersonId = hookstate<string | undefined | null>(undefined);
export const liveChatConciergeAvatar = hookstate<string | undefined | null>(
  undefined,
);
export const residenceMember = hookstate<TResidenceMember | null>(null);
export const failedLiveChatMessages = hookstate<string[] | null>(null);
export default residentialTenantState;
