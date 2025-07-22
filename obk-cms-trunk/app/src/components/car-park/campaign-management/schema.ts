import { ParkingFeeRedemptionSchema } from '@src/types/car-park/campaign'
import * as yup from 'yup'

const arrayHours = Array.from({ length: 8 }, (_, i) => i + 1)
const campaignSchema: yup.ObjectSchema<ParkingFeeRedemptionSchema> = yup
  .object()
  .shape({
    firstTier: yup.object().shape({
      minPrice: yup.number().required().min(0),
      maxPrice: yup
        .number()
        .required()
        .moreThan(
          yup.ref('minPrice'),
          'First tier max price must be greater than first tier min price'
        ),
      redeemHours: yup.number().required().oneOf(arrayHours),
      rateCode: yup.string().required(),
    }),
    secondTier: yup.object().shape({
      minPrice: yup
        .number()
        .required()
        .test(
          'is-greater-than-first-tier-max',
          'Second tier min price must be greater than first tier max price',
          function (value) {
            const firstMax =
              this.from?.[1]?.value.firstTier.maxPrice || undefined

            return firstMax !== undefined && value !== undefined
              ? value > firstMax
              : false
          }
        ),
      maxPrice: yup
        .number()
        .required()
        .moreThan(
          yup.ref('minPrice'),
          'Second tier max price must be greater than second tier min price'
        ),
      redeemHours: yup.number().required().oneOf(arrayHours),
      rateCode: yup.string().required(),
    }),
    thirdTier: yup.object().shape({
      minPrice: yup
        .number()
        .required()
        .test(
          'is-greater-than-sencond-tier-max',
          'Third tier min price must be greater than second tier max price',
          function (value) {
            const secondMax =
              this.from?.[1]?.value.secondTier.maxPrice || undefined

            return secondMax !== undefined && value !== undefined
              ? value > secondMax
              : false
          }
        ),
      maxPrice: yup
        .number()
        .required()
        .moreThan(
          yup.ref('minPrice'),
          'Third tier max price must be greater than third tier min price'
        ),
      redeemHours: yup.number().required().oneOf(arrayHours),
      rateCode: yup.string().required(),
    }),
    fourthTier: yup.object().shape({
      minPrice: yup
        .number()
        .required()
        .test(
          'is-greater-than-third-tier-max',
          'Fourth tier min price must be greater than third tier max price',
          function (value) {
            const thirdMax =
              this.from?.[1]?.value.thirdTier.maxPrice || undefined

            return thirdMax !== undefined && value !== undefined
              ? value > thirdMax
              : false
          }
        ),
      maxPrice: yup.number().nullable(),
      redeemHours: yup.number().required().oneOf(arrayHours),
      rateCode: yup.string().required(),
    }),
  })

export const defaultValues: ParkingFeeRedemptionSchema = {
  firstTier: {
    minPrice: 0,
    maxPrice: 0,
    redeemHours: 0,
    rateCode: '',
  },
  secondTier: {
    minPrice: 0,
    maxPrice: 0,
    redeemHours: 0,
    rateCode: '',
  },
  thirdTier: {
    minPrice: 0,
    maxPrice: 0,
    redeemHours: 0,
    rateCode: '',
  },
  fourthTier: {
    minPrice: 0,
    maxPrice: undefined,
    redeemHours: 0,
    rateCode: '',
  },
}
export default campaignSchema
