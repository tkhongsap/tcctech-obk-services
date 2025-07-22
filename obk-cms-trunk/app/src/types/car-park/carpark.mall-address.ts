export interface MallAddress {
  id: string
  address: string
}
export type MallAddressSchema = Omit<MallAddress, 'id'>
