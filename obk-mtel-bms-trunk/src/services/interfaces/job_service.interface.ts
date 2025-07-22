export interface TowerData {
  name: string;
  uid: string;
  display_name: Record<string, string | null>;
  project_id: string;
}

export interface ZoneData {
  uid: string;
  name: string;
  display_name: Record<string, string>;
  tower_id: string;
}

export interface FloorData {
  uid: string;
  name: string;
  display_name: Record<string, string>;
  tower_id: string;
}

export interface LocationData {
  uid: string;
  name: string;
  tower_id: string;
  floor_id: string;
  zone_id: string;
}

export interface LocationMapping {
  beaconID: number;
  beaconName: string;
  beaconMajorCode: string;
  beaconMinorCode: string;
  locationID: number;
  locationName: string;
  locationNameThai: string;
  projectID: number;
  projectName: string;
  towerID: number;
  towerName: string;
  nameThai_1: string;
  zoneID: number;
  zoneName: string;
  zoneNameThai: string;
  floorID: number;
  floorName: string;
  createTime: string;
  updateTime: string;
  active: 'True' | 'False';
}

export interface LocationFileData {
  count: number;
  locationMapping: LocationMapping[];
}

export interface TenantAuthFloor {
  locationID: number;
  isDefaultFloor: boolean;
}

export interface Tenant {
  tenantID: number;
  tenantName: string;
  nameEng: string | null;
  nameThai: string | null;
  phone: string | null;
  email: string;
  address: string | null;
  showKiosk: boolean;
  showReception: boolean;
  remark: string | null;
  createTime: string;
  createBy: number;
  updateTime: string;
  updateBy: number;
  active: boolean;
  tenantAuthFloors: TenantAuthFloor[];
}

export interface TenantData {
  count: number;
  data: Tenant[];
}

export interface TowerLocation {
  locationID: number;
  locationName: string;
  projectID: number;
  projectName: string;
  towerID: number;
  towerName: string;
  zoneID: number;
  zoneName: string;
  floorName: string;
}

export interface Tower {
  towerID: number;
  towerName: string;
  nameEng: string | null;
  nameThai: string | null;
  createTime: string;
  createBy: number;
  updateTime: string;
  updateBy: number;
  active: 'True' | 'False';
  locations: TowerLocation[];
}

export interface TowerFileData {
  count: number;
  data: Tower[];
}

export interface ErrorSync {
  type: string;
  uid_name: string;
}
