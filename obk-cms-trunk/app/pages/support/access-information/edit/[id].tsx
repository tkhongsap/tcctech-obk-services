import Upsert from '@components/access-information/upsert'
import SectionTitle from '@components/display/section-title'
import withGenericServer from '@hocs/server/generic'
import { useResource, useTranslate } from '@refinedev/core'
import useLoading from '@src/hooks/useLoading'
import { ICategoryCmsResponse } from '@src/types/document'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { accessLocalInformationService } from '@src/services/access-information/service'

export interface IAccessLocalInformationFormProps {
  contentEn: string
  contentTh?: string | null
  url?: string | null
}

export default function EditAccessLocalInformation() {
  const translate = useTranslate()
  const resources = useResource()
  const defaultValues: IAccessLocalInformationFormProps = {
    contentEn: '',
    contentTh: '',
    url: '',
  }

  const accessLocalInformationSchema: yup.ObjectSchema<IAccessLocalInformationFormProps> =
    yup.object().shape({
      contentEn: yup.string().required('Please enter English content'),
      contentTh: yup.string().notRequired(),
      url: yup
        .string()
        .nullable()
        .matches(
          /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i,
          'Please enter the correct URL'
        ),
    })

  const { control, handleSubmit, setValue, formState } =
    useForm<IAccessLocalInformationFormProps>({
      defaultValues: defaultValues,
      resolver: yupResolver(accessLocalInformationSchema),
      mode: 'onSubmit',
    })

  const { query } = useRouter()
  const { id } = query
  const { loading, startLoading, stopLoading } = useLoading()
  const [accessContent, setAccessContent] = useState<
    ICategoryCmsResponse | undefined
  >()

  useEffect(() => {
    const fetching = async () => {
      startLoading()
      const data = await accessLocalInformationService.getById(id as string)
      setAccessContent(data)
      stopLoading()
    }
    fetching()
  }, [])

  return (
    <div className='tw-flex-1'>
      <SectionTitle>
        {' '}
        {translate('accessLocalInformation.editTitle')}
        {resources?.resource?.meta?.label}
      </SectionTitle>
      <div className='tw-pt-[42px]'>
        {accessContent && (
          <Upsert
            loading={loading}
            control={control}
            handleSubmit={handleSubmit}
            setValue={setValue}
            formState={formState}
            documentData={accessContent}
          />
        )}
      </div>
    </div>
  )
}

EditAccessLocalInformation.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/support/access-information',
  }
)
