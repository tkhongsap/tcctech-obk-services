export interface IRejectModel {
  acId: string
  reason: string
  status: string
}

export interface JsonValue {}

export interface IAcRequest {
  id: string
  tenant_name: string
  unit: string
  location: string
  date_time: string
  status: string
  from: string
  to: string
}

export interface ACZoneData {
  id: string
  name: string
  area_size: number
  floor_id: string
  created_at: string
  updated_at: string
}

export interface FloorData {
  updated_at: string
  created_at: string
  tower_id: string
  display_name: JsonValue | null
  name: string
  uid: string
  id: string
}

export interface RequesterData {
  updated_at: string
  created_at: string
  metadata?: JsonValue | null
  account_id?: string | null
  uid: string
  id: string
}
export interface TowerData {
  updated_at: string
  created_at: string
  project_id: string
  display_name: JsonValue | null
  name: string
  uid: string
  id: string
}

export interface IAcRequestDetail {
  data: {
    ac_zone: ACZoneData
    ac_zone_id: string
    area_size: number
    created_at: string
    duration_hour: number
    estimated_cost: string
    floor: FloorData
    floor_id: string
    from: string
    id: string
    internal_remark: string
    rate: string
    reason: string
    references: string
    requester: RequesterData
    requester_id: string
    status: string
    to: string
    tower: TowerData
    tower_id: string
    updated_at: string
  }
}
