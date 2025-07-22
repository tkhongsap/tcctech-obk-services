import RoundedButton from '@components/button/rounded'
import SectionTitle from '@components/display/section-title'
import withGenericServer from '@hocs/server/generic'
import { useNavigation, useResource, useTranslate } from '@refinedev/core'
import dayjs from 'dayjs'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
} from '@chakra-ui/react'
import map from 'lodash/map'
import DisplayLabelValue from '@components/display/label-value'
import MaintenanceButton from '@components/support/app-maintenance/maintenance-button'
import { useEffect, useState } from 'react'
import GenericModal from '@components/common/modal'
import { nextApi } from '@src/utils/api'
import useLoading from '@src/hooks/useLoading'
import Skeleton from '@components/skeleton'
import { PCODE } from '@src/data/constants/privilege'
import { toast } from 'react-toastify'
import { memberService } from '@src/services/member/service'
import { IPersonalInfo } from '@src/services/member/model'

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

export interface IAppMaintenanceData {
  android: {
    updatedAt: string
    underMaintenance: boolean
  }
  ios: {
    updatedAt: string
    underMaintenance: boolean
  }
  message: {
    title: {
      en: string
      th: string
      cn: string
    }
    body: {
      en: string
      th: string
      cn: string
    }
  }
  updatedAt: string
  updatedBy: string
}

type Props = {
  personalInfo: IPersonalInfo
}

export default function AppMaintenance(props: Props) {
  const resources = useResource()
  const translate = useTranslate()
  const nav = useNavigation() as any
  const { loading, startLoading, stopLoading } = useLoading()

  const [appMaintenanceData, setAppMaintenanceData] =
    useState<IAppMaintenanceData>()

  const [confirmMaintenaceModalInfo, setConfirmMaintenaceModalInfo] = useState({
    platform: 'iOS',
    isOpen: false,
    type: 'start',
  })

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <div className='tw-flex tw-flex-col tw-items-center tw-gap-[32px] tw-w-full'>
          <div key={item.key} className='tw-w-full tw-space-y-[24px]'>
            <div className='tw-flex tw-flex-col tw-items-center tw-gap-[24px]'>
              <DisplayLabelValue label='title' titleSm>
                <div>
                  {appMaintenanceData?.message?.title[
                    item.key as keyof typeof appMaintenanceData.message.title
                  ] || 'No content'}
                </div>
              </DisplayLabelValue>

              <DisplayLabelValue label='Description' titleSm>
                <div className='ql-snow'>
                  <div
                    className='ql-editor !tw-p-0'
                    dangerouslySetInnerHTML={{
                      __html:
                        appMaintenanceData?.message?.body[
                          item.key as keyof typeof appMaintenanceData.message.body
                        ] || 'No content',
                    }}
                  />
                </div>
              </DisplayLabelValue>
            </div>
          </div>
        </div>
      </TabPanel>
    )
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    startLoading()
    await nextApi
      .get('/app-setting/app-maintenance')
      .then((res) => {
        console.log('fetch app maintenance data', res.data)
        setAppMaintenanceData(res.data)
      })
      .catch((err) => {
        console.log('fetch app maintenance data err', err)
      })
      .finally(() => {
        stopLoading()
      })
  }

  const handleConfirmButtonClicked = async () => {
    setConfirmMaintenaceModalInfo({
      ...confirmMaintenaceModalInfo,
      isOpen: false,
    })
    const user = props.personalInfo.name
    if (confirmMaintenaceModalInfo.type === 'start') {
      const payload = {
        ...appMaintenanceData,
        [`${confirmMaintenaceModalInfo.platform}`]: {
          underMaintenance: true,
          updatedAt: dayjs().toISOString(),
        },
        updatedBy: user || 'Unknown',
      }
      startLoading()
      await nextApi
        .put('/app-setting/app-maintenance', payload)
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Error')
          console.log('error', err)
        })
    }
    if (confirmMaintenaceModalInfo.type === 'end') {
      const payload = {
        ...appMaintenanceData,
        [`${confirmMaintenaceModalInfo.platform}`]: {
          underMaintenance: false,
          updatedAt: dayjs().toISOString(),
        },
        updatedBy: user || 'Unknown',
      }
      startLoading()
      await nextApi
        .put('/app-setting/app-maintenance', payload)
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'Error')
          console.log('error', err)
        })
    }
    fetchData()
  }

  const ConfirmMaintenanceModal = () => (
    <Modal
      isOpen={confirmMaintenaceModalInfo.isOpen}
      onClose={() =>
        setConfirmMaintenaceModalInfo({
          ...confirmMaintenaceModalInfo,
          isOpen: false,
        })
      }
      isCentered
    >
      <GenericModal>
        <div className='tw-p-10 tw-max-w-[640px]'>
          <div className='tw-text-[#1B2559] tw-text-2xl tw-font-bold'>
            {confirmMaintenaceModalInfo.type === 'start'
              ? translate('appMaintenance.modal.confirm.title', {
                  platform: confirmMaintenaceModalInfo.platform,
                })
              : translate('appMaintenance.modal.end.title', {
                  platform: confirmMaintenaceModalInfo.platform,
                })}
            <div className='tw-flex tw-items-center tw-space-x-5 tw-mt-6'>
              <RoundedButton
                color='white'
                bg='#4318FF'
                border='#4318FF'
                p='12px 24px'
                height='auto'
                onClick={handleConfirmButtonClicked}
              >
                {translate('appMaintenance.button.confirm')}
              </RoundedButton>
              <RoundedButton
                color='#4318FF'
                bg='transparent'
                border='#4318FF'
                p='12px 24px'
                height='auto'
                onClick={() =>
                  setConfirmMaintenaceModalInfo({
                    ...confirmMaintenaceModalInfo,
                    isOpen: false,
                  })
                }
              >
                {translate('appMaintenance.button.cancel')}
              </RoundedButton>
            </div>
          </div>
        </div>
      </GenericModal>
    </Modal>
  )

  const handleMaintenanceButtonClicked = (
    platform: string,
    isUnderMaintenace?: boolean
  ) => {
    if (isUnderMaintenace) {
      setConfirmMaintenaceModalInfo({
        platform,
        isOpen: true,
        type: 'end',
      })
    } else {
      setConfirmMaintenaceModalInfo({
        platform,
        isOpen: true,
        type: 'start',
      })
    }
  }

  return (
    <>
      <ConfirmMaintenanceModal />
      <div className='tw-max-w-inherit tw-pb-[60px]'>
        <div className='tw-mb-[50px]'>
          <SectionTitle>{resources?.resource?.meta?.label}</SectionTitle>
        </div>
        <div className='tw-p-8 tw-bg-white tw-rounded-[10px] tw-space-y-6 tw-mb-[30px]'>
          {loading ? (
            <>
              <Skeleton.ContentSkeleton className='mb-16' />
              <Skeleton.ContentSkeleton />
            </>
          ) : (
            <>
              <div className='tw-text-[#1B2559] tw-font-bold tw-text-2xl'>
                {translate('appMaintenance.title.currentStatus')}
              </div>
              <MaintenanceButton
                platform='Android'
                onClick={() =>
                  handleMaintenanceButtonClicked(
                    'android',
                    appMaintenanceData?.android?.underMaintenance || false
                  )
                }
                isUnderMaintenace={
                  appMaintenanceData?.android?.underMaintenance || false
                }
                createdAt={appMaintenanceData?.android?.updatedAt}
              />
              <MaintenanceButton
                platform='iOS'
                onClick={() =>
                  handleMaintenanceButtonClicked(
                    'ios',
                    appMaintenanceData?.ios?.underMaintenance || false
                  )
                }
                isUnderMaintenace={
                  appMaintenanceData?.ios?.underMaintenance || false
                }
                createdAt={appMaintenanceData?.ios?.updatedAt}
              />
            </>
          )}
        </div>
        <div className='tw-p-8 tw-bg-white tw-rounded-[10px]'>
          {loading ? (
            <>
              <Skeleton.ContentSkeleton className='mb-16' />
              <Skeleton.ContentSkeleton />
            </>
          ) : (
            <>
              <div className='tw-flex tw-items-center tw-justify-between tw-mb-10'>
                <div>
                  <div className='tw-text-[#1B2559] tw-font-bold tw-text-2xl tw-mb-2'>
                    {translate('appMaintenance.title.screen')}
                  </div>
                  <div>
                    Last update{' '}
                    <span className='tw-font-bold'>
                      {appMaintenanceData?.updatedAt
                        ? dayjs(appMaintenanceData.updatedAt).format(
                            'YYYY-MM-DD HH:mm'
                          )
                        : '-'}
                    </span>{' '}
                    Updated By{' '}
                    <span className='tw-font-bold'>
                      {appMaintenanceData?.updatedBy || '-'}
                    </span>
                  </div>
                </div>
                <RoundedButton
                  color='#4318FF'
                  bg='transparent'
                  border='#4318FF'
                  p='12px 36px'
                  height='auto'
                  onClick={() => nav?.push('/support/app-maintenance/edit')}
                >
                  {translate('appMaintenance.button.edit')}
                </RoundedButton>
              </div>
              <div className='tw-w-full'>
                <Tabs isFitted>
                  <TabList>{tabList}</TabList>
                  <TabPanels>{tabPanelList}</TabPanels>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const res = await memberService.getByKeycloakId(ctx.props.userId)
    const personalInfo = res.data
    ctx.props = { ...ctx.props, personalInfo }
    return ctx
  },
  {},
  {
    redirectPath: '/support/app-maintenance',
    accessPage: PCODE.VIEWAPPMAINTENANCE,
  }
)
