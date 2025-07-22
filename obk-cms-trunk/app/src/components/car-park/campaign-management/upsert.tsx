import SectionBlock from '@components/display/section-block'
import SectionTitle from '@components/display/section-title'
import { useTranslate } from '@refinedev/core'
import { Button } from 'primereact/button'
import Heading from '@components/typography/heading'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Trans } from 'react-i18next'
import dayjs from 'dayjs'
import LabelField from '@components/forms/utils/label-field'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import clsx from 'clsx'
import { Dropdown } from 'primereact/dropdown'
import { defaultValues } from './schema'
import { confirmDialog } from 'primereact/confirmdialog'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import campaignSchema from './schema'
import { ParkingFeeRedemptionSchema } from '@src/types/car-park/campaign'
import campaignService from '@src/services/carpark/campaign'

const hourChoices = Array.from({ length: 4 }, (_, i) => ({
  label: `${(i + 1) * 2} Hours`,
  value: (i + 1) * 2,
}))

type KeyType = keyof typeof defaultValues
type NameKeys = `${KeyType}.${keyof ParkingFeeRedemptionSchema[KeyType]}`

interface CampaignUpsertProps {
  data: ParkingFeeRedemptionSchema | null
  updatedAt: string
  updatedBy: string
}

export default function Upsert({
  data,
  updatedAt,
  updatedBy,
}: CampaignUpsertProps) {
  const router = useRouter()
  const translate = useTranslate()
  const { control, handleSubmit, formState, clearErrors, watch, trigger } =
    useForm<ParkingFeeRedemptionSchema>({
      defaultValues: data ?? defaultValues,
      resolver: yupResolver(campaignSchema),
      context: campaignSchema,
      mode: 'onSubmit',
      reValidateMode: 'onChange',
    })

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'firstTier.maxPrice') {
        trigger('secondTier.minPrice')
      }
      if (name === 'secondTier.maxPrice') {
        trigger('thirdTier.minPrice')
      }
      if (name === 'thirdTier.maxPrice') {
        trigger('fourthTier.minPrice')
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, trigger])

  const onSubmit = (data: ParkingFeeRedemptionSchema) => {
    confirmDialog({
      message: 'Are you sure you want to publish changes?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              const updatedCampaignData = await campaignService.upsertCampaign(
                data
              )
              if (!updatedCampaignData) {
                reject()
                return
              }
              accept()
              router.reload()
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const fields: KeyType[] = [
    'firstTier',
    'secondTier',
    'thirdTier',
    'fourthTier',
  ]

  return (
    <div className='tw-max-w-inherit tw-pb-[60px]'>
      <div className='tw-flex tw-items-center tw-justify-between'>
        <SectionTitle>{translate('campaignManagement.title')}</SectionTitle>

        <div className='flex gap-5'>
          <Button
            label={translate('general.publish')}
            style={{ backgroundColor: '#4318FF' }}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
      <form
        className='space-y-9 tw-pt-[42px]'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='tw-w-full md:tw-flex tw-justify-between'>
          <SectionBlock style={{ backgroundColor: 'white' }}>
            <div className='tw-w-full tw-flex tw-flex-col tw-gap-8'>
              <div>
                <Heading as='h2'>
                  {translate('campaignManagement.parkingFeeRedemption')}
                </Heading>

                <Trans
                  i18nKey='campaignManagement.timeStamps'
                  values={{
                    updated_time: updatedAt
                      ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm')
                      : '-',
                    updated_by: updatedBy || '-',
                  }}
                  components={{
                    updatedAt: <strong />,
                    updatedBy: <strong />,
                  }}
                />
              </div>
              {Object.keys(formState.errors).length > 0 && (
                <span className='w-fit px-4 py-3 tw-rounded-lg bg-red-50 tw-text-[#CD1A1A]'>
                  {translate('campaignManagement.errorMesaage')}
                </span>
              )}
              <div className='tw-flex tw-flex-col gap-6'>
                {fields.map((item, index) => (
                  <div key={index} className='formgrid grid'>
                    <div className='col-1 pt-5 tw-font-bold tw-text-[#1B2559]'>
                      {`${translate('campaignManagement.tier')} ${index + 1}`}
                    </div>

                    <div className='col-5 tw-flex tw-flex-col'>
                      <label
                        className={clsx(
                          'mb-2',
                          formState.errors[item as KeyType]?.minPrice ||
                            formState.errors[item as KeyType]?.maxPrice
                            ? 'tw-text-[#CD1A1A]'
                            : 'text-primary-800'
                        )}
                      >
                        {translate('campaignManagement.totalSpendRange')} *
                      </label>
                      <div className='tw-w-full tw-flex tw-items-center tw-min-w-0'>
                        <Controller
                          name={`${item}.minPrice` as NameKeys}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <InputNumber
                              value={value as number}
                              maxFractionDigits={2}
                              onValueChange={onChange}
                              onFocus={() =>
                                clearErrors(`${item}.minPrice` as NameKeys)
                              }
                              className={clsx('flex-1', {
                                'p-invalid':
                                  formState.errors[item as KeyType]?.minPrice,
                                'w-full': index === 3,
                              })}
                              suffix=' THB'
                            />
                          )}
                        />
                        {index !== 3 && (
                          <>
                            <div className='font-bold text-center w-2 tw-text-xl tw-text-[#1B2559]'>
                              -
                            </div>
                            <Controller
                              name={`${item}.maxPrice` as NameKeys}
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <InputNumber
                                  value={value as number}
                                  maxFractionDigits={2}
                                  onValueChange={onChange}
                                  onFocus={() =>
                                    clearErrors(`${item}.maxPrice` as NameKeys)
                                  }
                                  className={clsx('flex-1', {
                                    'p-invalid':
                                      formState.errors[item as KeyType]
                                        ?.maxPrice,
                                  })}
                                  suffix=' THB'
                                />
                              )}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className='col-2'>
                      <Controller
                        name={`${item}.redeemHours` as NameKeys}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <LabelField
                            htmlFor={`hour-${index}`}
                            label={translate('campaignManagement.redeemHour')}
                            isRequired={false}
                            error={Boolean(
                              formState.errors[item as KeyType]?.redeemHours
                            )}
                          >
                            <Dropdown
                              value={value}
                              onChange={onChange}
                              options={hourChoices}
                              className='w-full'
                              placeholder='Select'
                            />
                          </LabelField>
                        )}
                      />
                    </div>

                    <div className='col-4'>
                      <Controller
                        name={`${item}.rateCode` as NameKeys}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <LabelField
                            htmlFor={`rate-${index}`}
                            label={translate('campaignManagement.rateCode')}
                            isRequired={false}
                            className='tw-relative tw-w-full'
                            error={Boolean(
                              formState.errors[item as KeyType]?.rateCode
                            )}
                          >
                            <InputText
                              value={value as string}
                              onChange={onChange}
                              onFocus={() =>
                                clearErrors(`${item}.rateCode` as NameKeys)
                              }
                              className={clsx('tw-w-full', {
                                'p-invalid tw-ring-1 tw-ring-red-500':
                                  formState.errors[item as KeyType]?.rateCode,
                              })}
                            />
                          </LabelField>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionBlock>
        </div>
        <div className='flex flex-wrap gap-3 pt-6'>
          <Button
            style={{ backgroundColor: '#4318FF' }}
            type='submit'
            className='px-5'
            label={translate('general.publish')}
            onClick={() => handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </div>
  )
}
