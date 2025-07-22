import { PropertySchema } from '@src/types/car-park/carpark.property'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import LabelField from '@components/forms/utils/label-field'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import { confirmDialog } from 'primereact/confirmdialog'
import { useTranslate } from '@refinedev/core'
import SectionTitle from '@components/display/section-title'
import clsx from 'clsx'
import propertyService from '@src/services/carpark-config/property'
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { useState } from 'react'
// import '@styles/autocomplete.css'
interface UpsertPropertyProps {
  type: 'create' | 'update'
  id: string | null
  initialData: PropertySchema | null
}

const defaultValue: PropertySchema = {
  name: '',
  addresses: [],
  keywords: [],
}

const propertySchema: yup.ObjectSchema<PropertySchema> = yup.object().shape({
  name: yup.string().required(),
  addresses: yup.array().of(yup.string().required()).required(),
  keywords: yup.array().of(yup.string().required()).required(),
})

export default function UpsertProperty({
  id,
  type,
  initialData,
}: UpsertPropertyProps) {
  const router = useRouter()
  const translate = useTranslate()
  const { control, handleSubmit, setError, formState, getValues, clearErrors } =
    useForm<PropertySchema>({
      defaultValues: initialData ?? defaultValue,
      resolver: yupResolver(propertySchema),
      mode: 'onSubmit',
    })

  const [filteredAddress, setFilteredAddress] = useState<string[]>()
  const [filteredKeyword, setFilteredKeyword] = useState<string[]>()

  const onSubmit = (data: PropertySchema) => {
    if (type === 'create') {
      confirmDialog({
        message: 'Are you sure you want to create new property?',
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
                const newProperty = await propertyService.createProperty(data)
                if (!newProperty) {
                  setError('name', {
                    type: 'duplicated',
                    message: 'Property name already exist',
                  })
                  return reject()
                } else {
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
                const updatedProperty = await propertyService.updateProperty(
                  id,
                  data
                )
                if (!updatedProperty) {
                  setError('name', {
                    type: 'duplicated',
                    message: 'Property name already exist',
                  })
                  return reject()
                } else {
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
  }

  const handleDelete = async () => {
    if (!id) return
    confirmDialog({
      message:
        "This action will permanently delete the feature. It will also remove the associated store's whitelist and cannot be undone.",
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
              const deletedProperty = await propertyService.deleteProperty(id)
              if (deletedProperty) {
                accept()
                handlePushBack()
              } else {
                reject()
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

  const handlePushBack = () =>
    router.push({
      pathname: '/car-park/property',
    })

  const handleNavigateBack = () => {
    const values = getValues()
    const isDirty = Object.entries(defaultValue).some(([key, defaultValue]) => {
      const currentValue = values[key as keyof typeof values]

      if (type === 'create') {
        return currentValue !== defaultValue
      }

      if (type === 'update' && initialData) {
        const initialValue = initialData[key as keyof typeof initialData]
        return currentValue !== initialValue
      }

      return false
    })
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

  const searchAddress = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => setFilteredAddress([event.query]), 200)
  }

  const searchKeyword = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => setFilteredKeyword([event.query]), 200)
  }

  return (
    <div className='tw-flex-1'>
      <div className='tw-flex tw-justify-between items-center'>
        <SectionTitle> {translate('property.title')}</SectionTitle>
        <div className='flex gap-5'>
          <Button
            className='text-white'
            label={
              type === 'create'
                ? translate('property.button.create')
                : translate('general.publish')
            }
            onClick={handleSubmit(onSubmit)}
          />
          {type === 'update' && (
            <Button
              type='submit'
              className='px-5'
              severity='danger'
              label={translate('property.button.delete')}
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
              <div className='tw-w-full tw-flex tw-flex-col tw-gap-6'>
                <Controller
                  name='name'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='name'
                      label={translate('property.fields.name')}
                      isRequired={false}
                      className='relative tw-w-full tw-flex-1'
                      error={Boolean(formState.errors.name)}
                    >
                      <InputText
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => clearErrors('name')}
                        className={clsx('tw-w-full tw-flex-1', {
                          'p-invalid tw-ring-1 ring-red-500':
                            formState.errors.name,
                        })}
                      />
                      {formState.errors.name?.type === 'duplicated' && (
                        <p className='tw-text-[#CD1A1A] pt-2'>
                          {formState.errors.name.message}
                        </p>
                      )}
                    </LabelField>
                  )}
                />
                <Controller
                  name='addresses'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='address'
                      label={translate('property.fields.address')}
                      isRequired={false}
                      className='relative tw-w-full tw-flex-1'
                      error={Boolean(formState.errors.addresses)}
                    >
                      <AutoComplete
                        multiple
                        value={value}
                        suggestions={filteredAddress}
                        completeMethod={searchAddress}
                        onChange={onChange}
                        className='tw-w-full'
                      />
                    </LabelField>
                  )}
                />
                <Controller
                  name='keywords'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='keyword'
                      label={translate('property.fields.keyword')}
                      isRequired={false}
                      className='relative tw-w-full tw-flex-1'
                      error={Boolean(formState.errors.keywords)}
                    >
                      <AutoComplete
                        multiple
                        value={value}
                        suggestions={filteredKeyword}
                        completeMethod={searchKeyword}
                        onChange={onChange}
                        className='tw-w-full custom-autocomplete'
                        inputClassName='custom-input'
                        panelClassName='custom-panel'
                      />
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
                ? translate('property.button.create')
                : translate('general.publish')
            }
            onClick={() => handleSubmit(onSubmit)}
          />
          {type === 'update' && (
            <Button
              type='submit'
              className='px-5'
              label={translate('property.button.delete')}
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
