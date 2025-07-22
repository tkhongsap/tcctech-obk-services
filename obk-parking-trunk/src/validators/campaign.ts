import * as yup from "yup";

const hours = Array.from({ length: 4 }, (_, i) => (i + 1) * 2);

const campaignTier = yup.object({
  id: yup.string().optional(),
  price_min: yup.number().required().min(0),
  price_max: yup.number().required().min(0),
  redeem_hour: yup.number().required().oneOf(hours),
  rate_code: yup.string().required(),
});

const campaignTierFinal = yup.object({
  id: yup.string().optional(),
  price_min: yup.number().required(),
  price_max: yup
    .mixed()
    .test(
      "is-undefined",
      "price_max must be undefined for tier 4",
      (value) => value === undefined
    ),
  redeem_hour: yup.number().required().oneOf(hours),
  rate_code: yup.string().required(),
});

export const upsertCampaignSchema = yup
  .object({
    1: campaignTier,
    2: campaignTier,
    3: campaignTier,
    4: campaignTierFinal,
  })
  .test(
    "tiers-order",
    "Each tier's price_max must be less than the next tier's price_min",
    function (value) {
      if (!value) return false;

      return (
        value[1].price_max < value[2].price_min &&
        value[2].price_max < value[3].price_min &&
        value[3].price_max < value[4].price_min
      );
    }
  );
