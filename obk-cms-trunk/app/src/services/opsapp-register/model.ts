export interface IGetOpsAppRegister {
  keyCloakUserId: string
  mid: string
  email: string
  password: string
  identifyNumber: string
  identifyType: number
  userType: string
  roles: [
    {
      rid: string
      roleName: string
    }
  ]
  firstName: string
  lastName: string
  name: string
  updatedDate: string
  isLocked: boolean
  isActive: boolean
  location: string
  functionRoleLocation: IfunctionRoleLocations[]
  staffId: number
  userDesignations: ImapLocationandRole[]
}
export class GetOpsAppRegister {
  mid: string
  email: string
  password: string
  identifyNumber: string
  identifyType: number
  userType: string
  roles: string[]
  firstName: string
  lastName: string
  updatedDate: string
  location: string
  staffId: number
  functionRoleLocation: IfunctionRoleLocations[]

  constructor(data: IGetOpsAppRegister) {
    this.mid = data?.mid
    this.email = data?.email
    this.password = data?.password
    this.identifyNumber = data?.identifyNumber
    this.identifyType = data?.identifyType
    this.userType = data?.userType
    this.roles = data?.roles.map((x) => x.rid)
    this.firstName = data?.firstName
    this.lastName = data?.lastName
    this.updatedDate = data?.updatedDate
    this.location = data?.location
    this.staffId = data?.staffId
    this.functionRoleLocation = data?.functionRoleLocation
  }
}

export interface IGetOpsAppRegisterRecord {
  totalRecords: number
  data: IGetOpsAppRegister[]
}

export interface IOpsAppRoleList {
  rid: string[]
  userType: string
  roleName: string
  locations: string
}

export interface IFilterOpsAppRegister {
  filter?: string
  userType?: string
  status?: number
}

export class FilterOpsAppRegister implements IFilterOpsAppRegister {
  filter?: string
  userType?: string
  status?: number | undefined

  constructor(data?: IFilterOpsAppRegister) {
    this.filter = data?.filter
    this.userType = data?.userType
  }
}

export interface IUpsertOpsAppRegister {
  id?: string
  emailOrPhone: string
  password: string
  identifyNumber: string
  identifyType: number
  userType: string
  firstName: string
  lastName: string
  FunctionRoleLocation: IfunctionRoleLocations[]
}

export class UpsertOpsAppRegister implements IUpsertOpsAppRegister {
  id?: string
  emailOrPhone: string
  password: string
  identifyNumber: string
  identifyType: number
  userType: string
  firstName: string
  lastName: string
  FunctionRoleLocation: IfunctionRoleLocations[]

  constructor(data: IGetOpsAppRegister) {
    this.id = data?.mid
    this.emailOrPhone = data?.email
    this.password = data?.password
    this.identifyNumber = data?.identifyNumber
    this.identifyType = data?.identifyType
    this.userType = data?.userType
    this.firstName = data?.firstName
    this.lastName = data?.lastName
    this.FunctionRoleLocation = data.functionRoleLocation
  }
}

export interface IEditRoleUser {
  userId: string
  role: string[]
}

export interface IfunctionRoleLocations {
  LocationId: number
  FunctionRoleId: number
}

export interface IfecthLocation {
  lid: string
  locationCode: string
  name: string
  typeId: number
  type: string
  parentId: number
  refId: number
}

export interface IfecthFunctionRole {
  id: number
  code: string
  name: string
  description: string
  sys: boolean
}
export interface IfetchRole {
  rid: string
  userType: number
  roleName: string
}

export interface ImapLocationandRole {
  location: number[]
  role: number[]
}
export class EditRoleUser {
  userId: string
  role: string[]
  FunctionRoleLocations: IfunctionRoleLocations[]
  StaffId: number

  constructor(
    data: IGetOpsAppRegister,
    roles: IOpsAppRoleList[],
    FunctionRoleLocations: IfunctionRoleLocations[]
  ) {
    this.userId = data?.mid

    this.role = data?.roles.map((role) => {
      const matchedRole = roles.find((r) => r.roleName === role.roleName)
      return matchedRole ? matchedRole.rid[0] : ''
    })
    this.FunctionRoleLocations = FunctionRoleLocations
    this.StaffId = data?.staffId
  }
}

export class UnlockUser {
  mid: string

  constructor(data: IGetOpsAppRegister) {
    this.mid = data?.mid
  }
}
export class ResetPassword {}

export class isActive {
  mid: string
  isActive: boolean

  constructor(data: IGetOpsAppRegister) {
    this.mid = data?.mid
    this.isActive = data?.isActive
  }
}
