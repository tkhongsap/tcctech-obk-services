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
import { documentTypeService } from '@src/services/carpark-config/document-type'
import { DocumentTypeSchema } from '@src/types/car-park/carpark.document-type'

interface DocumentTypeProps {
  type: 'create' | 'update'
  id: string | null
  initialData: DocumentTypeSchema | null
}

const defaultValue: DocumentTypeSchema = {
  keyword: '',
  type: '',
}

const documentTypeSchema: yup.ObjectSchema<DocumentTypeSchema> = yup
  .object()
  .shape({
    keyword: yup.string().required(),
    type: yup.string().required(),
  })

export default function Upsert({ id, type, initialData }: DocumentTypeProps) {
  const router = useRouter()
  const translate = useTranslate()
  const { control, handleSubmit, getValues, formState, clearErrors, setError } =
    useForm<DocumentTypeSchema>({
      defaultValues: initialData ?? defaultValue,
      resolver: yupResolver(documentTypeSchema),
      mode: 'onSubmit',
    })

  const onSubmit = (data: DocumentTypeSchema) => {
    if (type === 'create') {
      confirmDialog({
        message: 'Are you sure you want to create new document type?',
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
                const newDocumentType =
                  await documentTypeService.createDocumentType(data)
                if (!newDocumentType) {
                  setError('keyword', {
                    type: 'duplicated',
                    message: 'Keyword already exist',
                  })
                  setError('type', {
                    type: 'duplicated',
                    message: 'Type already exist',
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
                const updateDocument =
                  await documentTypeService.updateDocumentType(id, data)
                if (!updateDocument) return reject()
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
  }

  const handleDelete = async () => {
    if (!id) return
    confirmDialog({
      message: 'Are you sure you want to delete this document?',
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
              const deleteDocument =
                await documentTypeService.deleteStoreDocumentType(id)
              if (deleteDocument) handlePushBack()
              if (!deleteDocument) return reject()
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
  const handlePushBack = () =>
    router.push({
      pathname: '/car-park/document-type',
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
  return (
    <div className='tw-flex-1'>
      <div className='tw-flex tw-justify-between items-center'>
        <SectionTitle> {translate('docsType.title')}</SectionTitle>
        <div className='flex gap-5'>
          <Button
            className='text-white'
            label={
              type === 'create'
                ? translate('docsType.button.create')
                : translate('general.publish')
            }
            onClick={handleSubmit(onSubmit)}
          />
          {type === 'update' && (
            <Button
              type='submit'
              className='px-5'
              severity='danger'
              label={translate('docsType.button.delete')}
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
              <div className='tw-w-full tw-flex tw-gap-6'>
                <Controller
                  name='keyword'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='keyword'
                      label={translate('docsType.fields.keyword')}
                      isRequired={false}
                      className='relative tw-w-full tw-flex-1'
                      error={Boolean(formState.errors.keyword)}
                    >
                      <InputText
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => clearErrors('keyword')}
                        className={clsx('tw-w-full tw-flex-1', {
                          'p-invalid tw-ring-1 ring-red-500':
                            formState.errors.keyword,
                        })}
                      />
                    </LabelField>
                  )}
                />
                <Controller
                  name='type'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <LabelField
                      htmlFor='type'
                      label={translate('docsType.fields.type')}
                      isRequired={false}
                      className='relative tw-w-full tw-flex-1'
                      error={Boolean(formState.errors.type)}
                    >
                      <InputText
                        value={value || ''}
                        onChange={onChange}
                        onFocus={() => clearErrors('type')}
                        className={clsx('tw-w-full tw-flex-1', {
                          'p-invalid tw-ring-1 ring-red-500':
                            formState.errors.type,
                        })}
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
                ? translate('docsType.button.create')
                : translate('general.publish')
            }
            onClick={() => handleSubmit(onSubmit)}
          />
          {type === 'update' && (
            <Button
              type='submit'
              className='px-5'
              label={translate('docsType.button.delete')}
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
      </form>{' '}
    </div>
  )
}
