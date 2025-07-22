import React, { useCallback, useEffect, useState } from 'react'
import { useTranslate } from '@refinedev/core'
import Tag from '@components/tag'
import LabelValue from '@components/display/label-value'
import styled from 'styled-components'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import { Button } from 'primereact/button'
import { ColumnDef } from '@tanstack/react-table'
import Table from '@components/table'
import withGenericServer from '@hocs/server/generic'
import SectionBlock from '@components/display/section-block'
import Heading from '@components/typography/heading'
import * as OB_IAM_SDK from 'ob-iam-sdk'
import { useRouter } from 'next/router'
import InputCheckbox from '@components/input/checkbox'
import * as OB_BMS_SDK from 'ob-bms-sdk'
import { PCODE } from '@src/data/constants/privilege'
import { capitalize, get, isUndefined, snakeCase } from 'lodash'
import dayjs from 'dayjs'
import useTableTools from '@src/hooks/useTableTools'
import { PAGE_SIZE } from '@components/table/constants'
import { confirmDialog } from 'primereact/confirmdialog'
import { WrappedResponseLocationIndexResponse } from 'ob-bms-sdk/dist/api'
import { useGetLocale } from '@refinedev/core'
import { SigninIdentityLogResultData } from 'ob-iam-sdk/dist/api'

const StyledTabSection = styled(Box)`
  padding: 32px;
  border: 1px solid ${(props) => props.theme.colors.rockBlue};
  width: 100%;
  border-radius: 8px;
`

const StyledSubtitle = styled(Box)`
  color: ${(props) => props.theme.colors.biscay};
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

const tabProps = {
  color: 'rockBlue',
  fontSize: { md: '20px' },
  fontWeight: 700,
  _selected: {
    color: 'astronaut',
    borderColor: 'astronaut',
  },
}

interface IUserData {
  data: {
    account?: {
      profile?: {
        account_id: string
        first_name: string
        middle_name: string
        last_name: string
        created_at: string
        dob: string
        gender: string
      }
      isDeleted: boolean
      identity: {
        provider: string
        identifier: string
        default: boolean
      }[]
    }
  }
}

interface Permission {
  id: string
  permittee_type: string
  value: {
    name: string
    service: string
    actions: string[]
    resource_type: string
    resource: {
      account_id: string
    }
  }
  created_at: string
  updated_at: string
  deleted_at: string | null
  account_id: string
  account_group_id: string | null
  role_id: string | null
}

const activityTypeOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Account',
    value: 'account',
  },
  {
    label: 'Auth',
    value: 'auth',
  },
  {
    label: 'Identity',
    value: 'identity',
  },
  {
    label: 'Profile',
    value: 'profile',
  },
  {
    label: 'Setting',
    value: 'setting',
  },
]

const platformOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'CMS',
    value: 'cms',
  },
  {
    label: 'App',
    value: 'app',
  },
]

const normalizeActivityType = (activityType?: string) => {
  if (!activityType) return '-'
  const result = capitalize(activityType.split('.')[0])
  return result
}

const normalizeDetails = (activityType?: string) => {
  if (!activityType) return '-'
  const result = capitalize(activityType.split('.')[1])
  return result
}

const platformDict = {
  app: 'One Bangkok app',
  cms: 'One Bangkok operations board',
}

export default function UserShow() {
  const translate = useTranslate()
  const router = useRouter()
  const { id } = router.query
  const [userData, setUserData] = useState<IUserData | null>(null)
  const [userPermissions, setUserPermissions] = useState<Permission[] | null>(
    null
  )
  const [memberData, setMemberData] = useState<any>()
  const [signInIdentityLog, setSignInIdentityLog] =
    useState<SigninIdentityLogResultData>()
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState<boolean>(false)

  const [permissions, setPermissions] = useState({
    requestBuildingServices: false,
    requestOvertimeAC: false,
  })
  const [originalPermissions, setOriginalPermissions] = useState({
    requestBuildingServices: false,
    requestOvertimeAC: false,
  })

  const {
    pagination,
    setPagination,
    currentPage,
    setCurrentPage,
    sorting,
    setSorting,
    filters,
    setFilters,
  } = useTableTools()

  const [activityLog, setActivityLog] = useState<any[]>([])
  const [isLoadingActivityLog, setIsLoadingActivityLog] =
    useState<boolean>(false)

  const [locationList, setLocationList] = useState<
    WrappedResponseLocationIndexResponse | any
  >()
  const locale = useGetLocale()
  const currentLocale = locale()

  const [customFilter] = useState<any>([
    {
      field: 'updated_at',
      type: 'date',
    },
    {
      field: 'action',
      placeholder: 'Activity type',
      type: 'select',
      options: activityTypeOptions,
    },
    {
      field: 'platform',
      placeholder: 'Platform',
      type: 'select',
      options: platformOptions,
    },
  ])

  const fetchData = useCallback(async () => {
    if (!id) {
      console.log('No user ID provided')
      return
    }
    try {
      const userId = Array.isArray(id) ? id[0] : id
      const res = await OB_IAM_SDK.client.accountShow(userId)
      const accountPermission = await OB_IAM_SDK.client.accountPermission(
        userId
      )
      const settingIndexResult = await OB_IAM_SDK.client.settingIndex(userId)
      if (!accountPermission.data.data) {
        console.log('No permissions data received')
        return
      }
      const permissionsData = accountPermission.data.data as Permission[]
      setUserPermissions(permissionsData)

      // @ts-ignore
      const setting = settingIndexResult?.data?.data?.setting
      const isTwoFactorEnabled =
        setting?.two_factor_authentication_enabled ?? false

      setIsTwoFactorEnabled(isTwoFactorEnabled)

      const serviceRequestPermission = permissionsData.find(
        (p) => p.value.name === 'ob-bms:service-request'
      )
      const acRequestPermission = permissionsData.find(
        (p) => p.value.name === 'ob-bms:ac-request'
      )

      const newPermissions = {
        requestBuildingServices: serviceRequestPermission
          ? serviceRequestPermission.value.actions.length > 0
          : false,
        requestOvertimeAC: acRequestPermission
          ? acRequestPermission.value.actions.length > 0
          : false,
      }

      setPermissions(newPermissions)
      setOriginalPermissions(newPermissions)

      if (res?.data?.data) {
        setUserData(res.data as IUserData)
        const signInIdentityLog = await OB_IAM_SDK.client.signInIdentityShow(
          userId
        )
        setSignInIdentityLog(
          signInIdentityLog.data.data as SigninIdentityLogResultData
        )
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err)
    }
  }, [id])

  useEffect(() => {
    fetchActivityLog(filters[0]?.field, filters[0]?.value)
  }, [filters])

  useEffect(() => {
    fetchActivityLog()
  }, [sorting])

  const fetchActivityLog = async (filterBy?: string, filterKey?: string) => {
    if (!id) {
      console.log('No user ID provided')
      return
    }
    try {
      const userId = Array.isArray(id) ? id[0] : id
      const sortingColumn = snakeCase(sorting[0]?.id)
      const sortingDirection = sorting[0]?.desc ? 'desc' : 'asc'
      setIsLoadingActivityLog(true)
      await OB_IAM_SDK.client
        .activityLogAccountShow(
          userId,
          sortingColumn,
          sortingDirection,
          currentPage,
          PAGE_SIZE,
          filterBy,
          filterKey
        )
        .then((res) => {
          //@ts-ignore
          const activityLog = res.data.data.map((log: any) => ({
            ...log,
            action: normalizeActivityType(log.action),
            details: normalizeDetails(log.action),
            platform:
              log.platform &&
              platformDict[log.platform as keyof typeof platformDict],
          }))
          setActivityLog(activityLog)
          setPagination({
            ...pagination,
            totalData: res.data?.pagination?.total || 1,
            currentPage: res.data?.pagination?.page_number || 1,
            totalPage: res.data?.pagination?.total_page || 1,
          })
        })
        .catch((err) => {
          console.error('Failed to fetch user activity log:', err)
        })
        .finally(() => {
          setIsLoadingActivityLog(false)
        })
    } catch (err) {
      console.error('Failed to fetch user activity log:', err)
    }
  }

  const onFilter = (items: any) => {
    if (Array.isArray(items) && items.length > 0 && setFilters) {
      setFilters(items)
      fetchActivityLog()
    } else {
      // If items array is empty (no search filter), fetch data without search parameter
      setFilters(items)
      fetchActivityLog()
    }
  }

  const handleCheckboxChange = (
    name: 'requestBuildingServices' | 'requestOvertimeAC'
  ) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = {
        ...prevPermissions,
        [name]: !prevPermissions[name],
      }

      return updatedPermissions
    })
  }

  const handleSaveChanges = useCallback(async () => {
    if (!id || !userPermissions) return
    const userId = Array.isArray(id) ? id[0] : id
    confirmDialog({
      message: 'Are you sure you want to save the changes?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex font-semibold text-lg',
      footer: (option) => (
        <div className='flex gap-3 ml-3'>
          <Button
            type='submit'
            outlined
            className='px-3 py-2 bg-primary-blue text-white'
            label='Confirm'
            onClick={async () => {
              option.accept()
              try {
                const serviceRequestPermission = userPermissions.find(
                  (permission) =>
                    permission.value.name === 'ob-bms:service-request'
                )
                const acRequestPermission = userPermissions.find(
                  (permission) => permission.value.name === 'ob-bms:ac-request'
                )

                if (!serviceRequestPermission || !acRequestPermission) {
                  console.error('Permissions not found')
                  return
                }

                const serviceRequestPermissionId = serviceRequestPermission.id
                const acRequestPermissionId = acRequestPermission.id

                if (serviceRequestPermissionId) {
                  await OB_IAM_SDK.client.permissionsUpdate(
                    serviceRequestPermissionId,
                    {
                      action: permissions.requestBuildingServices
                        ? 'create'
                        : '',
                      account_id: userId,
                    }
                  )
                }

                if (acRequestPermissionId) {
                  await OB_IAM_SDK.client.permissionsUpdate(
                    acRequestPermissionId,
                    {
                      action: permissions.requestOvertimeAC ? 'create' : '',
                      account_id: userId,
                    }
                  )
                }

                console.log('Permissions updated successfully')
              } catch (error) {
                console.error('Failed to update permissions:', error)
              }
            }}
          />
          <Button
            className='px-3 py-2 text-primary-blue'
            type='button'
            label='Cancel'
            onClick={option.reject}
          />
        </div>
      ),
    })
  }, [id, userPermissions, permissions])

  const handleCancel = () => {
    setPermissions(originalPermissions)
  }

  const getLocation = async () => {
    const result = await OB_BMS_SDK.client.locationsIndex()
    if (!isUndefined(result) && result?.data) {
      setLocationList(result.data)
    }
  }

  const getUserData = async () => {
    const accountId = typeof id === 'string' ? id : (id[0] as string)

    const member = await OB_BMS_SDK.client
      ?.membersIndex(undefined, accountId)
      .then((res) => {
        // @ts-ignore
        if (res?.data?.data && res?.data?.data?.length > 0) {
          console.log(
            'fetch user memberId successfully',
            // @ts-ignore
            res?.data?.data[0]?.id
          )
          // @ts-ignore
          return res?.data?.data[0]
        }
      })
      .catch((err) => {
        console.log('fetch user memberId fail', err)
      })
    const data = await OB_BMS_SDK.client
      ?.membersShow(member?.id)
      .then((res) => {
        console.log('fetch user member data successfully', res)
        // @ts-ignore
        setMemberData({ ...member, towers: res?.data?.data?.towers })
      })
      .catch((err) => {
        console.log('fetch user data fail', err)
      })
    return data
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    getUserData()
    getLocation()
  }, [])

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'createdAt',
        accessorKey: 'updated_at',
        header: translate('user_activity.table.fields.date_time'),
        cell: function render({ getValue }) {
          return dayjs(getValue<any>()).format('DD/MM/YYYY HH:mm')
        },
        sortable: true,
      },
      {
        id: 'id',
        accessorKey: 'id',
        header: translate('user_activity.table.fields.request_id'),
        sortable: true,
      },
      {
        id: 'platform',
        accessorKey: 'platform',
        header: translate('user_activity.table.fields.platform'),
        sortable: true,
      },
      {
        id: 'activity',
        accessorKey: 'action',
        header: translate('user_activity.table.fields.activity_type'),
        sortable: true,
      },
      {
        id: 'details',
        accessorKey: 'details',
        header: translate('user_activity.table.fields.details'),
        sortable: true,
      },
    ],
    [translate]
  )

  const fullName = `${userData?.data?.account?.profile?.first_name || ''} ${
    userData?.data?.account?.profile?.middle_name || ''
  } ${userData?.data?.account?.profile?.last_name || ''}`
  const creationDate = userData?.data?.account?.profile?.created_at
  const dob = userData?.data?.account?.profile?.dob

  const floorName = () => {
    if (!isUndefined(locationList)) {
      const location = locationList.data?.find(
        (location: any) => location.id === memberData?.default_floor
      )
      if (!isUndefined(location)) {
        const locationDisplayName = get(location, [
          'floor',
          'display_name',
          currentLocale || 'en',
        ])
        if (isUndefined(locationDisplayName)) {
          return get(location, ['floor', 'name'], '-')
        } else {
          return locationDisplayName
        }
      }
      return '-'
    }
  }

  return (
    <Box maxW='inherit'>
      <Box
        fontSize='34px'
        fontWeight='bold'
        lineHeight='42px'
        color='astronaut'
      >
        User Information
      </Box>

      <Box py='60px'>
        <SectionBlock>
          <Heading as='h3' color='biscay'>
            {fullName}
          </Heading>
          <Box pt='4px' fontSize='14px' lineHeight='24px' color='codGray'>
            Member since:{' '}
            {creationDate
              ? new Date(creationDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Unknown'}
          </Box>
          <Box pt='24px'>
            <SimpleGrid columns={3} spacingY='24px'>
              <Box flex={1}>
                <LabelValue label='Status'>
                  <Tag
                    color={
                      userData?.data?.account?.isDeleted ? '#CD1A1A' : '#59B413'
                    }
                  >
                    <Box p='2px 8px'>
                      {userData?.data?.account?.isDeleted
                        ? 'Suspend'
                        : 'Active'}
                    </Box>
                  </Tag>
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='User ID'>
                  {userData?.data?.account?.profile?.account_id}
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Role'>Office worker</LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Company name'>
                  {memberData?.tenant?.name || '-'}
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Building'>
                  {memberData?.towers ? memberData?.towers[0]?.name : '-'}
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Floor'>{floorName()}</LabelValue>
              </Box>
            </SimpleGrid>
          </Box>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <Tabs isFitted>
            <TabList>
              <Tab {...tabProps}>Account</Tab>
              <Tab {...tabProps}>Security</Tab>
              <Tab {...tabProps}>Activity</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px='0'>
                <VStack spacing='32px' w='100%'>
                  <StyledTabSection>
                    <StyledSubtitle>Personal information</StyledSubtitle>
                    <Box pt='32px'>
                      <LabelValue label='Name'>{fullName}</LabelValue>
                    </Box>
                    <Box pt='32px'>
                      <LabelValue label='Date of birth'>
                        {dob
                          ? new Date(dob).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Unknown'}
                      </LabelValue>
                    </Box>
                    <Box pt='32px'>
                      <LabelValue label='Gender'>
                        {userData?.data?.account?.profile?.gender}
                      </LabelValue>
                    </Box>
                  </StyledTabSection>
                  <StyledTabSection>
                    <StyledSubtitle>Email</StyledSubtitle>
                    <Box pt='32px'>
                      <LabelValue label='Default email'>
                        {userData?.data?.account?.identity?.find(
                          (identity) =>
                            identity.default && identity.provider === 'email'
                        )?.identifier || '-'}
                      </LabelValue>
                    </Box>
                    <Box
                      pt='32px'
                      display='flex'
                      justifyContent='space-between'
                      alignItems='flex-end'
                    >
                      <Box>
                        <LabelValue label='2nd email'>
                          {userData?.data?.account?.identity
                            ?.filter(
                              (identity) =>
                                !identity.default &&
                                identity.provider === 'email'
                            )
                            .map((identity) => identity.identifier)
                            .filter(
                              (identifier, index, self) =>
                                self.indexOf(identifier) === index
                            )[0] || '-'}
                        </LabelValue>
                      </Box>
                    </Box>
                    <Box
                      pt='32px'
                      display='flex'
                      justifyContent='space-between'
                      alignItems='flex-end'
                    >
                      <Box>
                        <LabelValue label='3rd email'>
                          {' '}
                          {userData?.data?.account?.identity
                            ?.filter(
                              (identity) =>
                                !identity.default &&
                                identity.provider === 'email'
                            )
                            .map((identity) => identity.identifier)
                            .filter(
                              (identifier, index, self) =>
                                self.indexOf(identifier) === index
                            )[1] || '-'}
                        </LabelValue>
                      </Box>
                    </Box>
                  </StyledTabSection>
                  <StyledTabSection>
                    <StyledSubtitle>Phone number</StyledSubtitle>
                    <Box pt='32px'>
                      <LabelValue label='Default phone'>
                        {userData?.data?.account?.identity?.find(
                          (identity) =>
                            identity.default && identity.provider === 'phone'
                        )?.identifier || '-'}
                      </LabelValue>
                    </Box>
                    <Box
                      pt='32px'
                      display='flex'
                      justifyContent='space-between'
                      alignItems='flex-end'
                    >
                      <Box>
                        <LabelValue label='2nd phone'>
                          {userData?.data?.account?.identity?.find(
                            (identity) =>
                              !identity.default && identity.provider === 'phone'
                          )?.identifier || '-'}
                        </LabelValue>
                      </Box>
                    </Box>
                    <Box
                      pt='32px'
                      display='flex'
                      justifyContent='space-between'
                      alignItems='flex-end'
                    >
                      <Box>
                        <LabelValue label='3rd phone'>
                          {userData?.data?.account?.identity?.find(
                            (identity) =>
                              !identity.default && identity.provider === 'phone'
                          )?.identifier || '-'}
                        </LabelValue>
                      </Box>
                    </Box>
                  </StyledTabSection>
                  <StyledTabSection>
                    <StyledSubtitle>Permissions</StyledSubtitle>
                    <InputCheckbox
                      className='my-2'
                      isChecked={permissions.requestBuildingServices}
                      onChange={() =>
                        handleCheckboxChange('requestBuildingServices')
                      }
                    >
                      Allow user to request building services
                    </InputCheckbox>
                    <InputCheckbox
                      isChecked={permissions.requestOvertimeAC}
                      onChange={() => handleCheckboxChange('requestOvertimeAC')}
                    >
                      Allow user to request overtime air conditioning
                    </InputCheckbox>
                    <div className='mt-3 mr-2 flex gap-3'>
                      <Button
                        className='px-3 py-2 bg-primary-blue text-white'
                        label='Save changes'
                        onClick={handleSaveChanges}
                      />
                      <Button
                        className='px-3 py-2 text-primary-blue'
                        label='Cancel'
                        onClick={handleCancel}
                      />
                    </div>
                  </StyledTabSection>

                  {/* <StyledTabSection> // comment this out as we may use it again in the future
                    <StyledSubtitle>Account</StyledSubtitle>
                    <Box pt='32px'>
                      Are you sure you want to suspend or delete this account ?
                    </Box>
                    <Box py='32px' width='100%'>
                      <Box bg='rockBlue' height='1px' />
                    </Box>
                    <HStack spacing='24px'>
                      <Box>
                        <StyledButton bg='thunderbird' color='white'>
                          Suspend
                        </StyledButton>
                      </Box>
                      <Box>
                        <StyledButton
                          color='thunderbird'
                          borderColor='thunderbird'
                          variant='outline'
                        >
                          Delete This Account
                        </StyledButton>
                      </Box>
                    </HStack>
                  </StyledTabSection> */}
                </VStack>
              </TabPanel>

              <TabPanel px='0'>
                <VStack spacing='32px' w='100%'>
                  {/* <StyledTabSection> // comment this out as we may use it again in the future
                    <StyledSubtitle>Sign-in method</StyledSubtitle>
                    <Box pt='32px'>
                      <LabelValue label='Current sign-in method'>
                        Email
                      </LabelValue>
                    </Box>
                    <Box pt='32px'>
                      <LabelValue label='Current username'>
                        joe.sutti@gmail.com
                      </LabelValue>
                    </Box>
                  </StyledTabSection> */}

                  {/* <StyledTabSection> // comment this out as we may use it again in the future
                    <StyledSubtitle>Single Sign-On (SSO)</StyledSubtitle>
                    <Flex pt='32px' justifyContent='space-between'>
                      <Box>
                        <LabelValue label='Microsoft'>-</LabelValue>
                      </Box>
                      <Box>
                        <StyledButton
                          color='primaryBlue'
                          borderColor='primaryBlue'
                          variant='outline'
                        >
                          Edit
                        </StyledButton>
                      </Box>
                    </Flex>

                    <Flex pt='32px' justifyContent='space-between'>
                      <Box>
                        <LabelValue label='Google'>xxx@gmail.com</LabelValue>
                      </Box>
                      <Box>
                        <StyledButton
                          color='primaryBlue'
                          borderColor='primaryBlue'
                          variant='outline'
                        >
                          Edit
                        </StyledButton>
                      </Box>
                    </Flex>

                    <Flex pt='32px' justifyContent='space-between'>
                      <Box>
                        <LabelValue label='Apple'>-</LabelValue>
                      </Box>
                      <Box>
                        <StyledButton
                          color='primaryBlue'
                          borderColor='primaryBlue'
                          variant='outline'
                        >
                          Edit
                        </StyledButton>
                      </Box>
                    </Flex>

                    <Box py='32px' width='100%'>
                      <Box bg='rockBlue' height='1px' />
                    </Box>

                    <HStack spacing='24px'>
                      <Box>
                        <StyledButton bg='thunderbird' color='white'>
                          Suspend
                        </StyledButton>
                      </Box>
                      <Box>
                        <StyledButton
                          color='thunderbird'
                          borderColor='thunderbird'
                          variant='outline'
                        >
                          Delete This Account
                        </StyledButton>
                      </Box>
                    </HStack>
                  </StyledTabSection> */}

                  {/* <StyledTabSection>
                    <StyledSubtitle>Password</StyledSubtitle>
                    <Flex pt='32px' justifyContent='space-between'>
                      <Box>
                        <LabelValue label='Current password'>
                          *******
                        </LabelValue>
                      </Box>
                      <Box>
                        <StyledButton
                          color='primaryBlue'
                          borderColor='primaryBlue'
                          variant='outline'
                        >
                          Edit
                        </StyledButton>
                      </Box>
                    </Flex>
                  </StyledTabSection> */}

                  <StyledTabSection>
                    <StyledSubtitle>Sign-in method</StyledSubtitle>

                    <Box pt='32px'>
                      <LabelValue label='Current sign-in method'>
                        <Box px='8px'>
                          {signInIdentityLog &&
                          signInIdentityLog.activityLog &&
                          signInIdentityLog.activityLog.action !== 'auth.logout'
                            ? signInIdentityLog.identity.provider
                            : '-'}
                        </Box>
                      </LabelValue>
                    </Box>

                    <Box pt='32px'>
                      <LabelValue label='Username'>
                        <Box px='8px'>
                          {signInIdentityLog &&
                          signInIdentityLog.activityLog &&
                          signInIdentityLog.activityLog.action !== 'auth.logout'
                            ? signInIdentityLog.identity.identifier
                            : '-'}
                        </Box>
                      </LabelValue>
                    </Box>
                  </StyledTabSection>
                  <StyledTabSection>
                    <StyledSubtitle>Single Sign-On (SSO)</StyledSubtitle>
                    {['Microsoft', 'Google', 'Apple'].map((provider) => (
                      <Box pt='32px' key={provider}>
                        <LabelValue label={provider}>
                          <Box px='8px'>
                            {(signInIdentityLog &&
                              (() => {
                                const identity =
                                  signInIdentityLog.externalIdentities &&
                                  signInIdentityLog.externalIdentities.find(
                                    (item: any) =>
                                      item.type.toLowerCase() ===
                                      provider.toLowerCase()
                                  )
                                return identity ? identity.identifier : '-'
                              })()) ??
                              '-'}
                          </Box>
                        </LabelValue>
                      </Box>
                    ))}
                  </StyledTabSection>

                  <StyledTabSection>
                    <StyledSubtitle>
                      Two-Factor Authentication (2FA)
                    </StyledSubtitle>
                    <Box
                      pt='4px'
                      fontSize='14px'
                      lineHeight='24px'
                      color='codGray'
                    >
                      Enhance your account security by enabling Two-Factor
                      Authentication (2FA), which adds an extra layer of
                      protection to your account
                    </Box>

                    <Box pt='32px'>
                      <LabelValue label='Status'>
                        {isTwoFactorEnabled ? (
                          <Tag color='#59B413'>
                            <Box px='8px'>Enabled 2FA</Box>
                          </Tag>
                        ) : (
                          <Tag color='#CD1A1A'>
                            <Box px='8px'>Disabled 2FA</Box>
                          </Tag>
                        )}
                      </LabelValue>
                    </Box>

                    <Box pt='32px'>
                      <LabelValue label='Recovery email'>
                        {userData?.data?.account?.identity?.find(
                          (identity) =>
                            identity.default && identity.provider === 'email'
                        )?.identifier || '-'}
                      </LabelValue>
                    </Box>

                    <Box pt='32px'>
                      <LabelValue label='Recovery phone number'>
                        {userData?.data?.account?.identity?.find(
                          (identity) =>
                            identity.default && identity.provider === 'phone'
                        )?.identifier || '-'}
                      </LabelValue>
                    </Box>
                  </StyledTabSection>
                </VStack>
              </TabPanel>
              <TabPanel px='0' py='24px'>
                <Box>
                  <Table
                    bg='transparent'
                    data={activityLog}
                    columns={columns}
                    paginationProps={{
                      currentPage: currentPage,
                      pageOnChange: setCurrentPage,
                      totalPage: pagination.totalPage,
                    }}
                    customFilter={customFilter}
                    sortingProps={{
                      sorting,
                      setSorting,
                    }}
                    onFilter={onFilter}
                    searchable={false}
                    isLoading={isLoadingActivityLog}
                    title='Account activity'
                  />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </SectionBlock>
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {
    redirectPath: '/users/all',
    accessPage: PCODE.VIEWUSERLISTANDDETAILS,
  }
)
