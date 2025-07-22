import SectionBlock from '@components/display/section-block'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  VStack,
  HStack,
} from '@chakra-ui/react'
import Heading from '@components/typography/heading'
import { FormProvider } from 'react-hook-form'
import InputText from '@components/label-input/text'
import InputSelect from '@components/label-input/select'
import map from 'lodash/map'
import InputTextarea from '@components/label-input/textarea'
import UpsertPane from '@components/action-pane/upsert'
import { useNavigation, useResource } from '@refinedev/core'
import { LOCALE_KEY } from '@src/data/constants/locale'
import Skeleton from '@components/skeleton'
import { nextApi } from '@src/utils/api'
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

export default function AppVersionUpsert(props: any) {
  const { form, loading, startLoading, stopLoading, data, user } = props
  const resources = useResource()
  const { register, handleSubmit, watch, formState } = form
  watch()

  const navigation = useNavigation()

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
              label={`Title (${
                LOCALE_KEY[item.key as keyof typeof LOCALE_KEY]
              })`}
              register={register(`${key}.title`)}
            />
          </Box>
          <Box w='100%'>
            <InputTextarea
              label={`Content (${
                LOCALE_KEY[item.key as keyof typeof LOCALE_KEY]
              })`}
              register={register(`${key}.content`)}
              bg='transparent'
            />
          </Box>
        </VStack>
      </TabPanel>
    )
  })

  const onSubmit = async (data: any) => {
    const payload = {
      [data.system]: {
        version: data.version,
        updatedBy: user || 'Unknown',
        message: {
          title: {
            en: data.en.title,
            th: data.th.title,
            cn: data.cn.title,
          },
          body: {
            en: data.en.content,
            th: data.th.content,
            cn: data.cn.content,
          },
        },
      },
    }
    startLoading()
    await nextApi
      .put('/app-setting/app-version-update', payload)
      .then(() => navigation.goBack())
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Error')
        console.log('error', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  return (
    <Box>
      <FormProvider {...form}>
        <Box justifyContent='space-between' display={{ md: 'flex' }}>
          <Box flex={1}>
            <SectionBlock>
              {loading ? (
                <>
                  <Skeleton.ContentSkeleton className='tw-mb-16' />
                  <Skeleton.ContentSkeleton />
                </>
              ) : (
                <Box>
                  <HStack
                    justifyContent='space-between'
                    alignItems='flex-start'
                  >
                    <Heading as='h3' color='biscay'>
                      {resources?.resource?.meta?.label}
                    </Heading>
                    <UpsertPane
                      submitLabel='Update app enforced version'
                      submitMsg='Are you sure you want to update the app enforced version?'
                      onSubmit={handleSubmit(onSubmit)}
                    />
                  </HStack>

                  <VStack
                    spacing='32px'
                    w='100%'
                    alignItems='flex-start'
                    pt='32px'
                  >
                    <SimpleGrid spacing='24px' columns={3} w='100%'>
                      <Box>
                        <InputText
                          label='ID'
                          disabled
                          bg='#F4F7FE'
                          value='xxxx'
                        />
                      </Box>

                      <Box>
                        <InputText
                          label='Latest iOS Version'
                          disabled
                          bg='#F4F7FE'
                          value={
                            data?.find(
                              (item: any) => item.system.toLowerCase() === 'ios'
                            )?.version
                          }
                        />
                      </Box>
                      <Box>
                        <InputText
                          label='Latest Android Version'
                          disabled
                          bg='#F4F7FE'
                          value={
                            data?.find(
                              (item: any) =>
                                item.system.toLowerCase() === 'android'
                            )?.version
                          }
                        />
                      </Box>
                    </SimpleGrid>

                    <SimpleGrid spacing='24px' columns={3} w='100%'>
                      <Box>
                        <InputSelect
                          bg='transparent'
                          label='Update Type'
                          disabled
                          // TODO: implment this nexy phase
                          // register={register('updateType', { required: true })}
                          placeholder='Hard Update'
                          isInvalid={formState.errors.updateType}
                          items={[
                            {
                              label: 'Soft',
                              value: 'soft',
                            },
                            {
                              label: 'Hard',
                              value: 'hard',
                            },
                          ]}
                        />
                      </Box>
                      <Box>
                        <InputSelect
                          bg='transparent'
                          label='System'
                          register={register('system', { required: true })}
                          isInvalid={formState.errors.system}
                          items={[
                            {
                              label: 'iOS',
                              value: 'ios',
                            },
                            {
                              label: 'Android',
                              value: 'android',
                            },
                          ]}
                        />
                      </Box>
                      <Box>
                        <InputText
                          label='Version'
                          register={register('version', { required: true })}
                          isInvalid={formState.errors.version}
                        />
                      </Box>
                    </SimpleGrid>

                    <Box w='100%'>
                      <Tabs isFitted>
                        <TabList>{tabList}</TabList>
                        <TabPanels>{tabPanelList}</TabPanels>
                      </Tabs>
                    </Box>
                  </VStack>
                </Box>
              )}
            </SectionBlock>

            <Box pt='24px'>
              <UpsertPane
                submitLabel='Update app enforced version'
                submitMsg='Are you sure you want to update the app enforced version?'
                onSubmit={handleSubmit(onSubmit)}
              />
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  )
}
