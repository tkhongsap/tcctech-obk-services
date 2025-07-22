import withGenericServer from '@hocs/server/generic'
import {
  Box,
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
import { useGetLocale } from '@refinedev/core'
import { LOCALE_KEY } from '@src/data/constants/locale'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import * as OB_DOCUMENT_SDK from 'ob-document-sdk'
import useLoading from '@src/hooks/useLoading'
import Skeleton from '@components/skeleton'
import { useRouter } from 'next/router'
import { IFaqDocumentDetail } from '@src/types/document'

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

export default function ShowLegal() {
  const router = useRouter()
  const locale = useGetLocale()
  const currentLocale = locale()
  const { query } = useRouter()
  const { startLoading, stopLoading, loading } = useLoading()
  const [documentData, setDocumentData] = useState<IFaqDocumentDetail>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { id } = query
    if (id && typeof id === 'string') {
      startLoading()
      await OB_DOCUMENT_SDK.client
        .historyCategoryDetail(id)
        .then((res: any) => {
          console.log('Fetch history category detail successfully!!: ', res)
          setDocumentData(res?.data?.data)
        })
        .catch((err) => {
          console.log('Fetch history category detail error: ', err)
        })
        .finally(() => stopLoading())
    }
  }

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <div className='tw-flex tw-flex-col tw-items-center tw-gap-[32px] tw-w-full'>
          {documentData?.history_document?.map((question, key) => {
            const contentLabel = `Content (${
              LOCALE_KEY[item.key as keyof typeof LOCALE_KEY]
            })`
            return (
              <div
                key={key}
                className='tw-w-full tw-rounded-lg tw-space-y-[24px]'
              >
                <div className='tw-flex tw-flex-col tw-items-center tw-gap-[24px]'>
                  <DisplayLabelValue label={contentLabel} titleSm>
                    <div className='ql-snow'>
                      <div
                        className='ql-editor !tw-p-0'
                        dangerouslySetInnerHTML={{
                          __html:
                            question.body[
                              item.key as keyof typeof question.body
                            ] || 'No content',
                        }}
                      />
                    </div>
                  </DisplayLabelValue>
                </div>
              </div>
            )
          })}
        </div>
      </TabPanel>
    )
  })

  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  const fullName = `${
    documentData?.updated_by?.account?.profile?.first_name || ''
  } ${documentData?.updated_by?.account?.profile?.middle_name || ''} ${
    documentData?.updated_by?.account?.profile?.last_name || ''
  }`

  return (
    <Box maxW='inherit' pb='60px'>
      <SectionTitle>
        View{' '}
        {documentData?.title[
          currentLocale as keyof typeof documentData.title
        ] || documentData?.title['en']}
      </SectionTitle>
      <Box pt='42px'>
        <SectionBlock>
          {loading ? (
            <>
              <Skeleton.ContentSkeleton className='tw-mb-10' />
              <Skeleton.ContentSkeleton />
            </>
          ) : (
            <>
              <Heading as='h3' color='astronaut'>
                {
                  documentData?.title[
                    currentLocale as keyof typeof documentData.title
                  ]
                }
              </Heading>
              <Box pt='4px' fontSize='14px'>
                Last update{' '}
                {dayjs(documentData?.updated_at).format('YYYY-MM-DD HH:mm')}{' '}
                Updated By {documentData?.updated_by_name}
              </Box>
              <VStack spacing='32px' pt='32px'>
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
          onClick={() => router.back()}
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
    return ctx
  },
  {
    redirectPath: '/legal/legal-content/show',
  }
)
