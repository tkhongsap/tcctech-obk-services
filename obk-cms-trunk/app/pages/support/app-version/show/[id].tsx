import withGenericServer from '@hocs/server/generic'
import {
  Box,
  SimpleGrid,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import SectionTitle from '@components/display/section-title'
import Heading from '@components/typography/heading'
import SectionBlock from '@components/display/section-block'
import DisplayLabelValue from '@components/display/label-value'
import map from 'lodash/map'
import RoundedButton from '@components/button/rounded'
import { useNavigation, useResource } from '@refinedev/core'
import { IAppVersionDocumentLog } from '@src/types/document'
import { LOCALE_KEY } from '@src/data/constants/locale'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import useLoading from '@src/hooks/useLoading'
import { nextApi } from '@src/utils/api'
import { useRouter } from 'next/router'
import { PLATFORM_TYPE } from '@src/data/constants/platform'
import Skeleton from '@components/skeleton'
import { PCODE } from '@src/data/constants/privilege'

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

export default function ShowAppVersion() {
  const { list } = useNavigation()
  const resources = useResource()
  const { query } = useRouter()

  const { loading, startLoading, stopLoading } = useLoading()
  const [versionData, setVersionData] = useState<IAppVersionDocumentLog>()

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <VStack w='100%' spacing='32px'>
          <DisplayLabelValue
            label={`Title (${LOCALE_KEY[item.key as keyof typeof LOCALE_KEY]})`}
          >
            <Box px='16px'>
              {versionData?.message?.title?.[
                item.key as keyof typeof versionData.message.title
              ] || 'No content'}
            </Box>
          </DisplayLabelValue>
          <DisplayLabelValue
            label={`Content (${
              LOCALE_KEY[item.key as keyof typeof LOCALE_KEY]
            })`}
          >
            <Box px='16px'>
              {versionData?.message?.body?.[
                item.key as keyof typeof versionData.message.body
              ] || 'No content'}
            </Box>
          </DisplayLabelValue>
        </VStack>
      </TabPanel>
    )
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    startLoading()
    if (query.id === 'ios' || query.id === 'android') {
      await nextApi
        .get('/app-setting/app-version-update')
        .then((res) => {
          const result = res.data.find(
            (item: any) => item.system?.toLowerCase() === query.id
          )
          console.log('fetch app version data', result)
          setVersionData(result)
        })
        .catch((err) => {
          console.log('fetch app version data err', err)
        })
        .finally(() => {
          stopLoading()
        })
    } else {
      await nextApi
        .get(`/app-setting/app-version/past-versions/${query.id}`)
        .then((res) => {
          console.log('fetch past versions', res.data)
          setVersionData({
            ...res.data,
            updatedAt: res.data?.updated_at,
            updatedBy: res.data?.updated_by,
          })
        })
        .catch((err) => {
          console.log('fetch past versions err', err)
        })
        .finally(() => {
          stopLoading()
        })
    }
  }

  return (
    <Box maxW='inherit' pb='60px'>
      <SectionTitle>View {resources?.resource?.meta?.label}</SectionTitle>
      <Box pt='42px'>
        <SectionBlock>
          {loading ? (
            <>
              <Skeleton.ContentSkeleton className='tw-mb-16' />
              <Skeleton.ContentSkeleton />
            </>
          ) : (
            <>
              <Heading as='h3' color='astronaut'>
                App version details
              </Heading>
              <Box pt='4px' fontSize='14px'>
                Last update{' '}
                <span className='tw-font-bold'>
                  {dayjs(versionData?.updatedAt).format('YYYY-MM-DD HH:mm')}
                </span>{' '}
                Updated By{' '}
                <span className='tw-font-bold'>
                  {typeof versionData?.updatedBy === 'string'
                    ? versionData?.updatedBy
                    : '-'}
                </span>
              </Box>
              <VStack spacing='32px' pt='32px'>
                <SimpleGrid columns={3} w='100%'>
                  {/* <DisplayLabelValue label='App Version ID'>
                    <Box>xxxxx</Box>
                  </DisplayLabelValue> */}

                  <DisplayLabelValue label='System'>
                    <Box>
                      {
                        PLATFORM_TYPE[
                          versionData?.system as keyof typeof PLATFORM_TYPE
                        ]
                      }
                    </Box>
                  </DisplayLabelValue>
                </SimpleGrid>

                <SimpleGrid columns={3} w='100%'>
                  <DisplayLabelValue label='Update type'>
                    <Box>Hard Update</Box>
                  </DisplayLabelValue>
                  <DisplayLabelValue label='Version'>
                    <Box>{versionData?.version}</Box>
                  </DisplayLabelValue>
                  <DisplayLabelValue label='Start Time'>
                    <Box>
                      {versionData?.updatedAt
                        ? dayjs(versionData?.updatedAt).format(
                            'YYYY-MM-DD HH:mm'
                          )
                        : '-'}
                    </Box>
                  </DisplayLabelValue>
                </SimpleGrid>

                <Box w='100%'>
                  <Tabs isFitted>
                    <TabList>{tabList}</TabList>
                    <TabPanels>{tabPanelList}</TabPanels>
                  </Tabs>
                </Box>
              </VStack>
            </>
          )}
        </SectionBlock>
      </Box>

      <Box pt='24px'>
        <RoundedButton
          onClick={() => list(resources?.identifier || '')}
          color='primaryBlue'
          bg='transparent'
          hoverOpacity={0}
        >
          Close
        </RoundedButton>
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/support/app-version',
    accessPage: PCODE.VIEWAPPVERSION,
  }
)
