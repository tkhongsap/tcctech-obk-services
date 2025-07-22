export interface IUpsertUsageMonitoeing {
  id: string
  fixedDailyUserTarget: number
  atcualActiveDailyUser: number
  totlaOnGroundStaffMustUseOpsApp: number
  totalDalilyOnGroundStaffMustUseOpsAppWithRegister: number
  totalDalilyOnGroundStaffMustUseOpsAppWithOutRegister: number
  component: string
  statistics: string
  allStaff: string
  sumWeekDay: number
  sumWeekEnd: number
  createdAt: Date
}

export interface IGetUsageMonitoring {
  id: string
  fixedDailyUserTarget: number
  atcualActiveDailyUser: number
  totlaOnGroundStaffMustUseOpsApp: number
  totalDalilyOnGroundStaffMustUseOpsAppWithRegister: number
  totalDalilyOnGroundStaffMustUseOpsAppWithOutRegister: number
  component: string
  statistics: string
  allStaff: string
  sumWeekDay: number
  sumWeekEnd: number
  createdAt: Date
}

export interface IGetUsageMonitoringRecord {
  data: IGetUsageMonitoring
}
export class UpsertUsageMonitorData implements IUpsertUsageMonitoeing {
  id: string
  fixedDailyUserTarget: number
  atcualActiveDailyUser: number
  totlaOnGroundStaffMustUseOpsApp: number
  totalDalilyOnGroundStaffMustUseOpsAppWithRegister: number
  totalDalilyOnGroundStaffMustUseOpsAppWithOutRegister: number
  component: string
  statistics: string
  allStaff: string
  sumWeekDay: number
  sumWeekEnd: number
  createdAt: Date

  constructor(data?: IUpsertUsageMonitoeing) {
    this.id = data?.id ?? ''
    this.fixedDailyUserTarget = data?.fixedDailyUserTarget ?? 0
    this.atcualActiveDailyUser = data?.atcualActiveDailyUser ?? 0
    this.totlaOnGroundStaffMustUseOpsApp =
      data?.totlaOnGroundStaffMustUseOpsApp ?? 0
    this.totalDalilyOnGroundStaffMustUseOpsAppWithRegister =
      data?.totalDalilyOnGroundStaffMustUseOpsAppWithRegister ?? 0
    this.totalDalilyOnGroundStaffMustUseOpsAppWithRegister =
      data?.totalDalilyOnGroundStaffMustUseOpsAppWithRegister ?? 0
    this.totalDalilyOnGroundStaffMustUseOpsAppWithOutRegister =
      data?.totalDalilyOnGroundStaffMustUseOpsAppWithOutRegister ?? 0
    this.component = data?.component ?? ''
    this.statistics = data?.statistics ?? ''
    this.allStaff = data?.allStaff ?? ''
    this.sumWeekDay = data?.sumWeekDay ?? 0
    this.sumWeekEnd = data?.sumWeekEnd ?? 0
    this.createdAt = data?.createdAt ?? new Date()
  }
}
