export type TierSchema = {
  id?: string
  minPrice: number
  maxPrice: number
  redeemHours: number
  rateCode: string
}

export type FinalTierSchema = {
  id?: string
  minPrice: number
  maxPrice?: number | null
  redeemHours: number
  rateCode: string
}

export interface ParkingFeeRedemptionSchema {
  firstTier: TierSchema
  secondTier: TierSchema
  thirdTier: TierSchema
  fourthTier: FinalTierSchema
}

export interface CampaignType {
  defaultValue: ParkingFeeRedemptionSchema
  createdAt: string
  updatedAt: string
  updatedBy: string
}
