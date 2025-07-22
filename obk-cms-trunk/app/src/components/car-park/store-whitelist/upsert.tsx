import { CarparkWhitelistSchema } from '@src/types/car-park/carpark.store-whitelist'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import LabelField from '@components/forms/utils/label-field'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import { confirmDialog } from 'primereact/confirmdialog'
import { Checkbox } from 'primereact/checkbox'
import { useTranslate } from '@refinedev/core'
import SectionTitle from '@components/display/section-title'
import { storeWhitelistService } from '@src/services/carpark-config/store-whitelist'
import clsx from 'clsx'
import { Dropdown } from 'primereact/dropdown'
import { PropertiesResponse } from 'ob-parking-sdk/dist/api'

interface UpsertWhitelistProps {
  id: string | null
  type: 'create' | 'update'
  initialData: CarparkWhitelistSchema | null
  property: PropertiesResponse[]
}

const defaultValues: CarparkWhitelistSchema = {
  taxId: '',
  storeName: '',
  companyName: '',
  propertyId: '',
  unitNo: '',
  address: '',
  building: '',
  hasTaxId: false,
  receiptAddressInObk: false,
}

const whitelistSchema: yup.ObjectSchema<CarparkWhitelistSchema> = yup
  .object()
  .shape({
    taxId: yup.string().max(13),
    storeName: yup.string().required(),
    companyName: yup.string().required(),
    propertyId: yup.string().required(),
    unitNo: yup.string(),
    address: yup.string(),
    building: yup.string(),
    hasTaxId: yup.boolean().required(),
    receiptAddressInObk: yup.boolean().required(),
  })

const UpsertStoreWhitelist = ({
  id,
  type,
  initialData,
  property,
}: UpsertWhitelistProps) => {
  const router = useRouter()
  const propertyOption = property?.map((item) => ({
    label: item.name,
    value: item.id,
  }))
  const translate = useTranslate()
  const { control, handleSubmit, formState, getValues, clearErrors } =
    useForm<CarparkWhitelistSchema>({
      defaultValues: initialData ?? defaultValues,
      resolver: yupResolver(whitelistSchema),
      mode: 'onSubmit',
    })

  const errors = formState.errors

  const onSubmit = (data: CarparkWhitelistSchema) => {
    if (type === 'create') {
      confirmDialog({
        message: 'Are you sure you want to create new store?',
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
                const newStore =
                  await storeWhitelistService.createStoreWhitelist(data)
                if (!newStore) return reject()
                else {
                  accept()
                  handlePushBack()
                }
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
    if (type === 'update' && id) {
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
                const newStore =
                  await storeWhitelistService.updateStoreWhitelist(id, data)
                if (!newStore) return reject()
                else {
                  accept()
                  handlePushBack()
                }
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
  }

  const handleDelete = async () => {
    if (!id) return
    confirmDialog({
      message: 'Are you sure you want to delete this store?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: ({ accept, reject }) => (
        <div className='flex justify-content-start gap-3'>
          <Button
            type='submit'
            label={translate('general.delete')}
            severity='danger'
            onClick={async () => {
              const deleteStore =
                await storeWhitelistService.deleteStoreWhitelist(id)
              if (deleteStore) handlePushBack()
              if (!deleteStore) return reject()
              else {
                accept()
                handlePushBack()
              }
            }}
          />
          <Button
            className='text-primary-blue'
            label={translate('general.cancel')}
            text
            onClick={reject}
          />
        </div>
      ),
    })
  }

  const handlePushBack = () =>
    router.push({
      pathname: '/car-park/store-whitelists',
    })

  const handleNavigateBack = () => {
    const values = getValues()
    const isDirty = Object.entries(defaultValues).some(
      ([key, defaultValue]) => {
        const currentValue = values[key as keyof typeof values]

        if (type === 'create') {
          return currentValue !== defaultValue
        }

        if (type === 'update' && initialData) {
          const initialValue = initialData[key as keyof typeof initialData]
          return currentValue !== initialValue
        }

        return false
      }
    )
    if (isDirty) {
      confirmDialog({
        message: 'Are you sure you want to leave as you’re still editing?',
        closable: false,
        style: { width: '500px' },
        contentClassName: 'flex justify-content-center font-semibold text-lg',
        footer: ({ accept, reject }) => (
          <div className='flex justify-content-start gap-3'>
            <Button
              type='submit'
              label={translate('general.confirm')}
              className='bg-primary-blue'
              onClick={async () => {
                accept()
                handlePushBack()
              }}
            />
            <Button
              className='text-primary-blue'
              label={translate('general.cancel')}
              text
              onClick={reject}
            />
          </div>
        ),
      })
    } else {
      handlePushBack()
    }
  }

  const checkIsNumber = (value: string) => {
    return /^\d*$/.test(value)
  }

  return (
    <div className='tw-flex-1'>
      <div className='tw-flex tw-justify-between items-center'>
        <SectionTitle> {translate('storeWhitelist.title')}</SectionTitle>
        <div className='flex gap-5'>
          <Button
            className='text-white'
            label={
              type === 'create'
                ? translate('storeWhitelist.button.create')
                : translate('general.publish')
            }
            onClick={handleSubmit(onSubmit)}
          />
          {type === 'update' && (
            <Button
              type='submit'
              className='px-5'
              severity='danger'
              label={translate('storeWhitelist.button.delete')}
              outlined
              onClick={handleDelete}
            />
          )}
          <Button
            className='text-primary-blue'
            label={translate('general.cancel')}
            outlined
            onClick={handleNavigateBack}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-9 tw-pt-[42px]'
      >
        <div className='tw-w-full md:tw-flex tw-justify-between'>
          <SectionBlock style={{ backgroundColor: 'white' }}>
            <div className='tw-w-full tw-flex tw-flex-col tw-gap-8'>
              <Heading as='h2'>{translate('general.details')}</Heading>
              {Object.keys(errors).length > 0 && (
                <span className='w-full px-4 py-3 tw-rounded-lg bg-red-50 tw-text-[#CD1A1A]'>
                  {translate('storeWhitelist.error')}
                </span>
              )}
              <div className='tw-w-full tw-flex tw-gap-6'>
                <Controller
                  name='taxId'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='taxId'
                      label='Tax ID'
                      isRequired={false}
                      error={Boolean(errors.taxId)}
                      className='relative tw-w-full tw-flex-1 tw-text-red-400'
                    >
                      <InputText
                        value={value || ''}
                        onChange={(e) => {
                          if (checkIsNumber(e.target.value)) {
                            onChange(e.target.value)
                          }
                        }}
                        onFocus={() => clearErrors('taxId')}
                        className={clsx('tw-w-full tw-flex-1', {
                          'p-invalid tw-ring-1 ring-red-500': errors.taxId,
                        })}
                      />
                    </LabelField>
                  )}
                />
                <Controller
                  name='storeName'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='storeName'
                      label='Store name'
                      isRequired={true}
                      error={Boolean(errors.storeName)}
                      className='relative tw-w-full tw-flex-1'
                    >
                      <InputText
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => clearErrors('storeName')}
                        className={clsx('tw-w-full tw-flex-1', {
                          'p-invalid tw-ring-1 ring-red-500': errors.storeName,
                        })}
                      />
                    </LabelField>
                  )}
                />
                <Controller
                  name='companyName'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='companyName'
                      label='Company name'
                      isRequired={true}
                      error={Boolean(errors.companyName)}
                      className='relative tw-w-full tw-flex-1'
                    >
                      <InputText
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => clearErrors('companyName')}
                        className={clsx('tw-w-full tw-flex-1', {
                          'p-invalid tw-ring-1 ring-red-500':
                            errors.companyName,
                        })}
                      />
                    </LabelField>
                  )}
                />
              </div>
              <Controller
                name='propertyId'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LabelField
                    htmlFor='propertyId'
                    label='Property'
                    isRequired={true}
                    error={Boolean(errors.propertyId)}
                    className='relative tw-w-full tw-flex-1'
                  >
                    <Dropdown
                      value={value}
                      onChange={onChange}
                      options={propertyOption}
                      className='w-full'
                    />
                  </LabelField>
                )}
              />
              <Controller
                name='unitNo'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LabelField
                    htmlFor='unitNo'
                    label='Unit No'
                    isRequired={false}
                    error={Boolean(errors.unitNo)}
                    className='relative tw-w-full tw-flex-1'
                  >
                    <InputText
                      value={value || ''}
                      onChange={onChange}
                      onFocus={() => clearErrors('unitNo')}
                      className={clsx('tw-w-full tw-flex-1', {
                        'p-invalid tw-ring-1 ring-red-500': errors.unitNo,
                      })}
                    />
                  </LabelField>
                )}
              />
              <Controller
                name='address'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LabelField
                    htmlFor='address'
                    label='Address'
                    isRequired={false}
                    error={Boolean(errors.address)}
                    className='relative tw-w-full tw-flex-1'
                  >
                    <InputTextarea
                      rows={4}
                      value={value || ''}
                      onChange={onChange}
                      onFocus={() => clearErrors('address')}
                      className={clsx('tw-w-full tw-flex-1', {
                        'p-invalid tw-ring-1 ring-red-500': errors.address,
                      })}
                    />
                  </LabelField>
                )}
              />
              <Controller
                name='building'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <LabelField
                    htmlFor='building'
                    label='Building'
                    isRequired={false}
                    error={Boolean(errors.building)}
                    className='relative tw-w-full tw-flex-1'
                  >
                    <InputTextarea
                      rows={4}
                      value={value || ''}
                      onChange={onChange}
                      onFocus={() => clearErrors('building')}
                      className={clsx('tw-w-full tw-flex-1', {
                        'p-invalid tw-ring-1 ring-red-500': errors.building,
                      })}
                    />
                  </LabelField>
                )}
              />{' '}
              <div className='tw-flex tw-flex-row tw-justify-start tw-items-center gap-8'>
                <Controller
                  name='hasTaxId'
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <LabelField htmlFor='hasTaxId' label='Has tax id?'>
                      <Checkbox id={name} checked={value} onChange={onChange} />
                    </LabelField>
                  )}
                />

                <Controller
                  name='receiptAddressInObk'
                  control={control}
                  render={({ field: { name, onChange, value } }) => (
                    <LabelField
                      htmlFor='receiptAddressInObk'
                      label='Receipt address in Obk?'
                    >
                      <Checkbox id={name} checked={value} onChange={onChange} />
                    </LabelField>
                  )}
                />
              </div>
            </div>
          </SectionBlock>
        </div>
        <div className='flex flex-wrap gap-3 pt-6'>
          <Button
            type='submit'
            className='px-5'
            label={
              type === 'create'
                ? translate('storeWhitelist.button.create')
                : translate('general.publish')
            }
            onClick={() => handleSubmit(onSubmit)}
          />
          {type === 'update' && (
            <Button
              type='submit'
              className='px-5'
              label={translate('storeWhitelist.button.delete')}
              severity='danger'
              outlined
              onClick={handleDelete}
            />
          )}
          <Button
            type='button'
            className='px-5'
            label={translate('general.cancel')}
            severity='secondary'
            outlined
            onClick={handleNavigateBack}
          />
        </div>
      </form>
    </div>
  )
}

export default UpsertStoreWhitelist
