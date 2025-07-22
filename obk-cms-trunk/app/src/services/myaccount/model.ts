export interface IMyAccount {
  mid: string
  email: string
  updatedDate: Date
  updatedBy: string
  status: number
  name: string
  role: IMemberRole[]
}

export interface IMemberRole {
  rid: string
  roleName: string
  privilege: IMemberRolePrivilege[]
}

export interface IMemberRolePrivilege {
  ptid: string
  privilegeName: string
}
