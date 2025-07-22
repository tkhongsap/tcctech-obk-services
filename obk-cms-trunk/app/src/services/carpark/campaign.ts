import { USER_NAME } from '@src/authProvider/constants'
import {
  CampaignType,
  FinalTierSchema,
  ParkingFeeRedemptionSchema,
  TierSchema,
} from '@src/types/car-park/campaign'
import { getCookie } from 'cookies-next'
import * as OB_PARKING_SDK from 'ob-parking-sdk'
import {
  CampaignResponse,
  CampaignSequenceResponseData,
} from 'ob-parking-sdk/dist/api'

class CampaignService {
  public async getCampaign(): Promise<CampaignType | undefined> {
    try {
      const response = await OB_PARKING_SDK.client.campaignIndex()
      if (
        response.status === 200 &&
        Object.keys(response.data.data).length > 0
      ) {
        return {
          defaultValue: this.serializePayload(response.data.data),
          createdAt: (response.data.created_at as string) || '',
          updatedAt: (response.data.updated_at as string) || '',
          updatedBy: response.data.updated_by || '',
        }
      }
    } catch (error) {
      console.log('Get campaign error :', error)
    }
  }

  public async upsertCampaign(
    data: ParkingFeeRedemptionSchema
  ): Promise<CampaignResponse[] | undefined> {
    try {
      const transformData = this.transformPayload(data)
      const updateBy = getCookie(USER_NAME)

      const response = await OB_PARKING_SDK.client.campaignUpsert({
        data: { ...transformData },
        updated_by: updateBy,
      })
      if (response.status === 200 && response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Upsert campaign error :', error)
    }
  }

  transformPayload(data: ParkingFeeRedemptionSchema) {
    return {
      1: {
        ...(data.firstTier.id && { id: data.firstTier.id }),
        price_min: data.firstTier.minPrice,
        price_max: data.firstTier.maxPrice,
        redeem_hour: data.firstTier.redeemHours,
        rate_code: data.firstTier.rateCode,
      },
      2: {
        ...(data.secondTier.id && { id: data.secondTier.id }),
        price_min: data.secondTier.minPrice,
        price_max: data.secondTier.maxPrice,
        redeem_hour: data.secondTier.redeemHours,
        rate_code: data.secondTier.rateCode,
      },
      3: {
        ...(data.thirdTier.id && { id: data.thirdTier.id }),
        price_min: data.thirdTier.minPrice,
        price_max: data.thirdTier.maxPrice,
        redeem_hour: data.thirdTier.redeemHours,
        rate_code: data.thirdTier.rateCode,
      },
      4: {
        ...(data.fourthTier.id && { id: data.fourthTier.id }),
        price_min: data.fourthTier.minPrice,
        ...(data.fourthTier.maxPrice && {
          price_max: data.fourthTier.maxPrice,
        }),
        redeem_hour: data.fourthTier.redeemHours,
        rate_code: data.fourthTier.rateCode,
      },
    }
  }

  serializePayload(
    data: CampaignSequenceResponseData
  ): ParkingFeeRedemptionSchema {
    return {
      firstTier: this.serializeValue(data['1']),
      secondTier: this.serializeValue(data['2']),
      thirdTier: this.serializeValue(data['3']),
      fourthTier: this.serializeFinalValue(data['4']),
    }
  }
  serializeValue(data: CampaignResponse): TierSchema {
    return {
      ...(data.id && { id: data.id }),
      minPrice: data.price_min,
      maxPrice: data.price_max as number,
      redeemHours: data.redeem_hour,
      rateCode: data.rate_code,
    }
  }

  serializeFinalValue(data: CampaignResponse): FinalTierSchema {
    return {
      ...(data.id && { id: data.id }),
      minPrice: data.price_min,
      maxPrice: data.price_max,
      redeemHours: data.redeem_hour,
      rateCode: data.rate_code,
    }
  }
}

const campaignService = new CampaignService()
export default campaignService
