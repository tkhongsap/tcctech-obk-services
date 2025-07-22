export interface IServiceRequest {
  id: string
  issue: string
  building: string
  floor: string
  title: string
  description: string
  created_at: string
  createby: string
  status: string
  picture: string
}

export interface IssueTypeData {
  updated_at: string
  created_at: string
  display_name: string
  name: string
  id: string
}
export interface FloorData {
  updated_at: string
  created_at: string
  tower_id: string
  display_name: string
  name: string
  uid: string
  id: string
}

export interface TowerData {
  updated_at: string
  created_at: string
  project_id: string
  display_name: string
  name: string
  uid: string
  id: string
}

export interface IServiceRequestDetail {
  data: {
    updated_at: string
    created_at: string
    description: string
    status: string
    title: string
    requester_id: string
    issue_type: IssueTypeData
    floor: FloorData
    tower: TowerData
    image_url?: string
    id: string
  }
}
