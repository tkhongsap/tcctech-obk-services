import React, { useState, useRef, useEffect } from 'react'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'
import * as OBNOTISDK from 'ob-notification-sdk'
import router from 'next/router'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TargetStep from '@components/notifications/template/create/notification/target-step'
import MessageStep from '@components/notifications/template/create/notification/message-step'
import ButtonStep from '@components/notifications/template/create/notification/button-step'
import EnablePushNotificationStep from '@components/notifications/template/create/notification/enable-push-notification-step'
import { KeyValue } from '@src/types/key-value'
import { confirmDialog } from 'primereact/confirmdialog'
import ScheduleStep from '@components/notifications/template/create/notification/schedule-step'
import {
  CampaignUIModel,
  MappingMessageTemplateToCampaignsUIModel,
  MappingCampaignUIToCampaigns,
  MappingCampaignToUIModel,
} from '@components/notifications/inapp/inapp-notification'
import {
  MappingMessageTemplateToTemplateUIModel,
  MessageTemplateModel,
} from '@components/notifications/template/types/template'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { MenuItem } from 'primereact/menuitem'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { findIndex, findLastIndex, get, isEmpty, omit, set } from 'lodash'
import StepItemTemplate from '../components/step-item-template'
import { PCODE } from '@src/data/constants/privilege'
import { usePermission } from '@src/hooks/permissionProvider'
import { targetGroupByUserType } from '../types/notification'
import * as OBBMSSDK from 'ob-bms-sdk'
import { FindMemberResult } from 'ob-bms-sdk/dist/api'
import { getCookie } from 'cookies-next'
import { MID, USER_NAME } from '@src/authProvider/constants'

type Props = {
  id?: string
  formData:
    | MappingMessageTemplateToTemplateUIModel
    | MappingMessageTemplateToCampaignsUIModel
    | MappingCampaignToUIModel
  categories: KeyValue[]
  tags: KeyValue[]
  isAnnouncement: boolean
  targetGroups?: KeyValue[]
  towers?: KeyValue[]
  floors?: { name: string; value: string; towerId: string }[]
}

const NotificationUpsert = (props: Props) => {
  OBNOTISDK.setBaseUrl(process.env.OB_NOTIFICATION_SDK_BASE_URL || '')
  const { setMenuAction } = useLayoutContext()
  const { checkAccess } = usePermission()
  const { id, formData, tags, isAnnouncement, targetGroups, floors, towers } =
    props
  const categories = isAnnouncement
    ? props.categories.filter((x) => x.name === 'Announcement')
    : props.categories.filter((x) => x.name !== 'Announcement')

  const LangItems: Lang[] = [
    { label: 'English', code: 'en' },
    { label: 'Thai(ไทย)', code: 'th' },
    // { label: 'Simplify Chinese(简体中文)', code: 'zh' },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [activeLang, setActiveLang] = useState<Lang>(LangItems[0])
  const formRef = useRef<FormControllerRef<any>>(null)
  const updatedby = getCookie(USER_NAME)
  const mid = getCookie(MID)
  const items: MenuItem[] = isAnnouncement
    ? [
        {
          label: 'Scheduling',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 0 }),
        },
        {
          label: 'Message',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 1 }),
        },
        {
          label: 'Enable push notification',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 2 }),
        },
        {
          label: 'Scheduling',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 3 }),
        },
      ]
    : [
        {
          label: 'Target',
          visible: !isAnnouncement,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 0 }),
        },
        {
          label: 'Message',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 1 }),
        },
        {
          label: 'Button',
          visible: !isAnnouncement,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 2 }),
        },
        {
          label: 'Enable push notification',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 3 }),
        },
        {
          label: 'Scheduling',
          visible: true,
          template: () =>
            StepItemTemplate({ activeIndex: activeIndex, index: 4 }),
        },
      ]

  if (isAnnouncement) {
    formData.message_category_id = categories.find(
      (x) => x.name === 'Announcement'
    )?.value
  }

  const OnClose = () => {
    router.back()
  }

  const processTargetGroup = async (
    rawValue: CampaignUIModel,
    data: MappingCampaignUIToCampaigns
  ) => {
    const targetGroupByFloors: targetGroupByUserType[] = get(
      rawValue,
      'targetGroupDetails.targetGroupByUserType',
      []
    )
    data.targetGroupDetails = omit(data.targetGroupDetails, 'detail')

    const hasTargetGroupByFloors =
      Array.isArray(targetGroupByFloors) &&
      isEmpty(data.targetGroupDetails?.name) &&
      isEmpty(data.target_group_id)

    if (hasTargetGroupByFloors) {
      const selectedFloorIds = targetGroupByFloors.flatMap(
        (item) => item.floor?.map((floor) => floor.value) || []
      )
      const validFloorIds = selectedFloorIds.filter((id): id is string => !!id)

      if (validFloorIds.length > 0) {
        const accountIds = await fetchFloorData(validFloorIds)

        set(data, 'targetGroupDetails', {
          name: generateLocationString(targetGroupByFloors),
          account_id_group: accountIds,
        })
        data.target_group_id = ''
      }
    } else if (!isEmpty(data.targetGroupDetails?.name)) {
      data.targetGroupDetails = omit(
        data.targetGroupDetails,
        'targetGroupByUserType'
      )
      data.target_group_id = ''
    } else if (isEmpty(data.targetGroupDetails?.name)) {
      const targetGroupId = get(rawValue, 'target_groups')
      // @ts-ignore
      data.target_group_id = targetGroupId
      data.targetGroupDetails = undefined
    }

    return data
  }

  const onSaveDraft = async () => {
    const isValid = await formRef.current?.trigger()
    if (!isValid) return
    confirmDialog({
      message: 'Are you sure you want to save this notification as a draft?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-center gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              option.accept()

              const rawValue = formRef.current?.getValues() as CampaignUIModel

              let data = new MappingCampaignUIToCampaigns(rawValue)
              data.updated_by_name = updatedby
              data = await processTargetGroup(rawValue, data)

              data.updated_by = getCookie(MID)
              data.updated_by_name = getCookie(USER_NAME)

              const promise = Promise.resolve().then(() => {
                if (!!id) {
                  return OBNOTISDK.client.campaignsUpdate(id, data, mid)
                }
                return OBNOTISDK.client.campaignsCreate(data, mid)
              })

              toast.promise(
                promise.then(() => {
                  router.push('/notifications/draft')
                }),
                defaultToastMessage
              )
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  function generateLocationString(
    targetGroupByUserType: targetGroupByUserType[] | undefined
  ) {
    if (!targetGroupByUserType) {
      return ''
    }

    const result = targetGroupByUserType.map((item) => {
      const towerName = towers?.find((tower) => tower.value === item.tower)

      const floorNames = item.floor
        .map((floorItem) =>
          floors?.find((floor) => floor.value === floorItem.value)
        )
        .filter(Boolean)

      return {
        tower: towerName,
        floors: floorNames,
      }
    })

    return JSON.stringify(result)
  }
  const fetchFloorData = async (floorIds: string[], page: number = 1) => {
    let totalPage = 1
    let currentPage = page
    let allAccountIds: string[] = []
    const pageSize = 200
    while (currentPage <= totalPage) {
      const members = await OBBMSSDK.client.membersV2ListMembers(
        {
          floor_ids: floorIds,
        },
        undefined,
        undefined,
        currentPage,
        pageSize
      )

      const memberData: FindMemberResult[] = members?.data?.data || []
      const paginationData = members?.data?.pagination

      const accountIds = memberData
        .map((member) => member.account_id)
        .filter(
          (id): id is string =>
            id !== null && id !== undefined && id.trim() !== ''
        )

      allAccountIds = [...allAccountIds, ...accountIds]

      totalPage = paginationData?.total_page ?? 1
      currentPage += 1
    }

    return allAccountIds
  }

  function onSubmitNext() {
    if (activeIndex >= items.length - 1) {
      let message = `Are you sure you want to submit this ${
        isAnnouncement ? 'announcement' : 'notification'
      } for approval?`
      if (checkAccess(PCODE.APPROVEORREJECTEDTHESUBMITTEDNOTIFICATION)) {
        message = 'Are you sure you want to approve this notification?'
      }
      confirmDialog({
        message: message,
        closable: false,
        style: { width: '500px' },
        contentClassName: 'flex justify-content-center font-semibold text-lg',
        footer: (option) => (
          <div className='flex justify-content-center gap-3'>
            <Button
              type='submit'
              label='Confirm'
              className='bg-primary-blue'
              onClick={async () => {
                option.accept()

                const rawValue =
                  formRef.current?.getValues() as MessageTemplateModel
                let dataSubmit = new MappingCampaignUIToCampaigns(rawValue)
                dataSubmit.updated_by_name = updatedby
                dataSubmit = await processTargetGroup(rawValue, dataSubmit)

                const promise = Promise.resolve().then(() => {
                  if (
                    checkAccess(PCODE.APPROVEORREJECTEDTHESUBMITTEDNOTIFICATION)
                  ) {
                    if (!!id) {
                      return OBNOTISDK.client
                        .campaignsUpdate(id, dataSubmit, mid)
                        .then((res) => {
                          return OBNOTISDK.client.campaignsApprove(
                            res.data.data.id,
                            mid
                          )
                        })
                    }
                    return OBNOTISDK.client
                      .campaignsCreate(dataSubmit, mid)
                      .then((res) => {
                        return OBNOTISDK.client.campaignsApprove(
                          res.data.data.id,
                          mid
                        )
                      })
                  } else {
                    if (!!id) {
                      return OBNOTISDK.client
                        .campaignsUpdate(id, dataSubmit, mid)
                        .then((res) => {
                          return OBNOTISDK.client.campaignsSubmit(
                            res.data.data.id,
                            mid
                          )
                        })
                    }
                    return OBNOTISDK.client
                      .campaignsCreate(dataSubmit, mid)
                      .then((res) => {
                        return OBNOTISDK.client.campaignsSubmit(
                          res.data.data.id,
                          mid
                        )
                      })
                  }
                })

                toast.promise(
                  promise.then((res) => {
                    router.push('/notifications/inapp/show/' + res.data.data.id)
                  }),
                  defaultToastMessage
                )
              }}
            />
            <Button
              className='text-primary-blue'
              label='Cancel'
              text
              onClick={option.reject}
            />
          </div>
        ),
      })

      return
    }
    setActiveIndex(findIndex(items, (x, i) => x.visible! && i > activeIndex))
  }

  function onBack() {
    if (activeIndex === 0) {
      return
    }

    setActiveIndex(
      findLastIndex(items, (x, i) => x.visible! && i < activeIndex)
    )
  }

  const menuAction = (
    <div className='flex gap-3'>
      <Button
        type='button'
        label='Save draft'
        className='text-primary-blue'
        onClick={onSaveDraft}
        outlined
      />
      <Button
        type='button'
        className='px-5 text-primary-blue'
        label='Cancel'
        severity='secondary'
        onClick={OnClose}
        text
      />
    </div>
  )

  useEffect(() => {
    setMenuAction(menuAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuAction])

  return (
    <div className=''>
      <div className='card'>
        <div className='bg-white mb-5'>
          <Steps
            model={items}
            activeIndex={activeIndex}
            onSelect={(e) => setActiveIndex(e.index)}
            readOnly={false}
          />
        </div>

        <FormController
          defualtValue={formData}
          ref={formRef}
          onSubmit={onSubmitNext}
        >
          {isAnnouncement
            ? {
                0: (
                  <TargetStep
                    // onBackClick={onBack}
                    targetData={targetGroups}
                    floors={floors}
                    towers={towers}
                  />
                ),
                1: (
                  <MessageStep
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                    tags={tags}
                    langItems={LangItems}
                    onBackClick={onBack}
                    addBlockVisible={!isAnnouncement}
                    requiredTitleAndMessage={true}
                  />
                ),
                2: (
                  <EnablePushNotificationStep
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                    langItems={LangItems}
                    onBackClick={onBack}
                  />
                ),
                3: (
                  <ScheduleStep
                    categories={categories}
                    onBackClick={onBack}
                    isAnnouncement={isAnnouncement}
                  />
                ),
              }[activeIndex]
            : {
                0: (
                  <TargetStep
                    // onBackClick={onBack}
                    targetData={targetGroups}
                    floors={floors}
                    towers={towers}
                  />
                ),
                1: (
                  <MessageStep
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                    tags={tags}
                    langItems={LangItems}
                    onBackClick={onBack}
                    addBlockVisible={!isAnnouncement}
                    requiredTitleAndMessage={true}
                  />
                ),
                2: (
                  <ButtonStep
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                    langItems={LangItems}
                    onBackClick={onBack}
                  />
                ),
                3: (
                  <EnablePushNotificationStep
                    activeLang={activeLang}
                    setActiveLang={setActiveLang}
                    langItems={LangItems}
                    onBackClick={onBack}
                  />
                ),
                4: (
                  <ScheduleStep
                    onBackClick={onBack}
                    categories={categories}
                    isAnnouncement={isAnnouncement}
                  />
                ),
              }[activeIndex]}
        </FormController>
      </div>
      <div className='flex flex-wrap w-5 gap-5 my-5'>{menuAction}</div>
    </div>
  )
}

export default NotificationUpsert
