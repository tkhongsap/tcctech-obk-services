import { Box, VStack, HStack } from '@chakra-ui/react'
import SectionTitle from '@components/display/section-title'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import InputText from '@components/input/text'
import withGenericServer from '@hocs/server/generic'
import { useResource } from '@refinedev/core'
import UpsertPane from '@components/action-pane/upsert'
import dayjs from 'dayjs'
import { useForm, FormProvider } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { nextApi } from '@src/utils/api'
import useLoading from '@src/hooks/useLoading'
import Skeleton from '@components/skeleton'
import { PCODE } from '@src/data/constants/privilege'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { memberService } from '@src/services/member/service'
import { IPersonalInfo } from '@src/services/member/model'

type Props = {
  personalInfo: IPersonalInfo
}

export default function ContactCenter(props: Props) {
  const resources = useResource()
  const router = useRouter()
  const form = useForm()
  const { loading, startLoading, stopLoading } = useLoading()
  const { register, handleSubmit, formState } = form
  const { errors } = formState

  const [contractData, setContractData] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (contractData) {
      form.reset(contractData)
    }
  }, [contractData])

  const fetchData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/contract')
      .then((res) => {
        console.log('fetch contract data', res.data)
        setContractData(res.data)
      })
      .catch((err) => {
        console.log('fetch contract data err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const onSubmit = async (data: any) => {
    const user = props.personalInfo.name
    await nextApi
      .put('/app-setting/contract', {
        ...data,
        updatedBy: user || 'Unknown',
      })
      .then((res) => {
        toast.success('Contract data updated')
        console.log('update contract data', res.data)
      })
      .catch((err) => {
        toast.error('Failed to update contract data')
        console.log('update contract data err', err)
      })
      .finally(() => {
        fetchData()
      })
  }

  return (
    <Box maxW='inherit' pb='60px'>
      <SectionTitle>{resources?.resource?.meta?.label}</SectionTitle>

      <VStack spacing='32px' pt='60px'>
        <SectionBlock>
          {loading ? (
            <>
              <Skeleton.ContentSkeleton className='mb-16' />
              <Skeleton.ContentSkeleton />
            </>
          ) : (
            <FormProvider {...form}>
              <HStack justifyContent='space-between' alignItems='flex-start'>
                <Heading as='h3' color='biscay'>
                  {resources?.resource?.meta?.subject ||
                    resources?.resource?.meta?.label}
                </Heading>
                <UpsertPane
                  types={['submit', 'cancel']}
                  submitLabel='Publish'
                  onSubmit={handleSubmit(onSubmit)}
                  onCancel={() => router.reload()}
                />
              </HStack>
              <Box fontSize='14px' lineHeight='32px' color='outerSpace'>
                Last update{' '}
                <span className='tw-font-bold'>
                  {contractData?.updatedAt
                    ? dayjs(contractData.updatedAt).format('YYYY-MM-DD HH:mm')
                    : '-'}
                </span>{' '}
                Updated By{' '}
                <span className='tw-font-bold'>
                  {contractData?.updatedBy || '-'}
                </span>
              </Box>

              <Box pt='24px'>
                <Heading as='h3' color='biscay'>
                  Call contact center
                </Heading>
                <Box pt='20px'>
                  <InputText
                    register={register('phone', { required: true })}
                    error={errors['phone']}
                  />
                </Box>
              </Box>

              <Box pt='24px'>
                <Heading as='h3' color='biscay'>
                  Email contact center
                </Heading>
                <Box pt='20px'>
                  <InputText
                    register={register('email', { required: true })}
                    error={errors['email']}
                  />
                </Box>
              </Box>
            </FormProvider>
          )}
        </SectionBlock>
      </VStack>

      <Box pt='24px'>
        <UpsertPane
          types={['submit', 'cancel']}
          submitLabel='Publish'
          onSubmit={handleSubmit(onSubmit)}
          onCancelChanges={() => router.reload()}
        />
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const res = await memberService.getByKeycloakId(ctx.props.userId)
    const personalInfo = res.data
    return { ...ctx, props: { personalInfo } }
  },
  {
    redirectPath: '/support/contact-center',
    accessPage: PCODE.VIEWCONTACTCENTER,
  }
)
