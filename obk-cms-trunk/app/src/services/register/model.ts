export interface IRegisterFormModel {
  name: string
  password: string
  confirmpassword: string
  id: string
  membercode: string
}
export interface IRegisterUpsertModel {
  mid: string
  name: string
  status: number
  password: string
  KeycloakUser: string
}
