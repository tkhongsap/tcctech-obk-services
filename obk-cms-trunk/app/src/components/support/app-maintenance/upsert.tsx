import SectionBlock from '@components/display/section-block'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from '@chakra-ui/react'
import Heading from '@components/typography/heading'
import { FormProvider } from 'react-hook-form'
import InputText from '@components/label-input/text'
import map from 'lodash/map'
import InputTextarea from '@components/label-input/textarea'
import UpsertPane from '@components/action-pane/upsert'
import { useEffect } from 'react'
import Skeleton from '@components/skeleton'
import dayjs from 'dayjs'
import { nextApi } from '@src/utils/api'
import { useNavigation } from '@refinedev/core'
import { toast } from 'react-toastify'

const tabProps = {
  color: 'rockBlue',
  fontSize: { md: '20px' },
  fontWeight: 700,
  _selected: {
    color: 'astronaut',
    borderColor: 'astronaut',
  },
}

const tabItems = [
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'th',
    label: 'Thai',
  },
  {
    key: 'cn',
    label: 'Chinese',
  },
]

export default function AppMaintenanceUpsert(props: any) {
  const { form, data, loading, startLoading, stopLoading, userInfo } = props
  const { message, updatedAt, updatedBy } = data
  const { register, handleSubmit, watch, reset } = form
  watch()

  const navigation = useNavigation()

  useEffect(() => {
    if (message) {
      reset(message)
    }
  }, [message])

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    const key = item.key
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <VStack spacing='32px' w='100%'>
          <Box w='100%'>
            <InputText
              label={`Title (${item.label})`}
              register={register(`title.${key}`)}
            />
          </Box>
          <Box w='100%'>
            <InputTextarea
              label={`Content (${item.label})`}
              register={register(`body.${key}`)}
              bg='transparent'
            />
          </Box>
        </VStack>
      </TabPanel>
    )
  })

  const onSubmit = async (formData: any) => {
    const user = userInfo?.name
    const payload = {
      ...data,
      updatedBy: user || 'Unknown',
      message: formData,
    }
    startLoading()
    await nextApi
      .put('/app-setting/app-maintenance', payload)
      .then(() => navigation.goBack())
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Error')
        console.log('error', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const onCancel = () => {}

  const onDelete = () => {}

  return (
    <div>
      <FormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <div className='md:tw-flex tw-justify-between'>
          <div className='tw-flex-1'>
            {loading ? (
              <>
                <Skeleton.ContentSkeleton className='mb-16' />
                <Skeleton.ContentSkeleton />
              </>
            ) : (
              <>
                <SectionBlock>
                  <div>
                    <div className='tw-flex tw-justify-between tw-items-center tw-mb-6'>
                      <div>
                        <Heading as='h3' color='biscay' mb='8px'>
                          App maintenance screen
                        </Heading>
                        <div className='tw-text-sm'>
                          Last update{' '}
                          <span className='tw-font-bold'>
                            {updatedAt
                              ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm')
                              : '-'}
                          </span>{' '}
                          Updated By{' '}
                          <span className='tw-font-bold'>
                            {updatedBy || '-'}
                          </span>
                        </div>
                      </div>
                      <UpsertPane
                        onSubmit={handleSubmit(onSubmit)}
                        onCancel={onCancel}
                        onDelete={onDelete}
                        submitLabel='Save change'
                        cancelLabel='Cancel'
                      />
                    </div>

                    <div className='tw-w-full'>
                      <Tabs isFitted>
                        <TabList>{tabList}</TabList>
                        <TabPanels>{tabPanelList}</TabPanels>
                      </Tabs>
                    </div>
                  </div>
                </SectionBlock>

                <div className='tw-py-6'>
                  <UpsertPane
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={onCancel}
                    onDelete={onDelete}
                    submitLabel='Save change'
                    cancelLabel='Cancel'
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </FormProvider>
    </div>
  )
}
