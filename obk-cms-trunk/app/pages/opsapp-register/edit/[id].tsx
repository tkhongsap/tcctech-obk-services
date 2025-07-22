import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRouter } from 'next/router'
import { Dialog } from 'primereact/dialog'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import {
  EditRoleUser,
  GetOpsAppRegister,
  IGetOpsAppRegister,
  UnlockUser,
  IfecthLocation,
  IfecthFunctionRole,
  IfunctionRoleLocations,
  ImapLocationandRole,
  IfetchRole,
  ResetPassword,
  isActive,
} from '@src/services/opsapp-register/model'
import { opsappregisterService } from '@src/services/opsapp-register/service'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import MultipleSelectFieldToken from '@components/forms/components/multiple-select-field-token'
import { InputSwitch } from 'primereact/inputswitch'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
// import { KeyValue } from '@src/types/key-value'

type Props = {
  id: string
  data: IGetOpsAppRegister
  roles: IfetchRole[]
  rolesData: IfecthFunctionRole[]
  locationsData: IfecthLocation[]
  isResetPassWord: boolean
}

export default function OpsAppRegisterEdit(props: Props) {
  const { isResetPassWord } = props
  const { roles, data, locationsData, rolesData } = props
  console.log('data:', data)

  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleLockDialog, setVisibleLockDialog] = useState(false)
  const [visibleisActiveDialog, setVisibleisActiveDialog] = useState(false)
  const [visibleResetPasswordDialog, setVisibleResetPasswordDialog] =
    useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const [checked, setChecked] = useState(data.isLocked)
  const [checkedisActive, setCheckedisActive] = useState(data.isActive)
  const [firstName, lastName] = data.name ? data.name.split(' ') : ['', '']

  const formData = new GetOpsAppRegister(data)

  const [showLocationRoleSection, setShowLocationRoleSection] = useState(false)

  const [functionRoles, setFunctionRoles] = useState<IfecthFunctionRole[]>([])
  const [functionRolesValue, setFunctionRolesValue] = useState<
    IfunctionRoleLocations[]
  >([])

  const [locations, setLocations] = useState<IfecthLocation[]>([])

  const [userDesignations, setUserDesignations] = useState<
    ImapLocationandRole[]
  >([])

  useEffect(() => {
    setFunctionRoles(rolesData)
    setLocations(locationsData)

    const loop: ImapLocationandRole[] = rehandleUserDesignationChange(
      data.functionRoleLocation
    )
    setUserDesignations(loop)
    setFunctionRolesValue(data.functionRoleLocation)
  }, [])

  useEffect(() => {
    setShowLocationRoleSection(true)

    setMenuName('Edit User')
    setMenuAction(buttonAction)
  }, [])

  useEffect(() => {
    if (data?.userDesignations?.length > 0) {
      const mappedUserDesignations = data.userDesignations.map(
        (designation) => ({
          location: designation.location || [],
          role: designation.role || [],
        })
      )
      setUserDesignations(mappedUserDesignations)
    }
  }, [data?.userDesignations])

  const onResetPassword = async () => {
    let sendData: ResetPassword = {
      username: data.keyCloakUserId,
    }

    try {
      const response = await opsappregisterService.resetPassword(sendData)

      if (response.data.isSuccess === true) {
        toast.success('รีเซ็ตรหัสผ่านสำเร็จ')
        router.push({
          pathname: '/opsapp-register',
        })
      } else {
        toast.error('รีเซ็ตรหัสผ่านล้มเหลว')
      }
    } catch (error: any) {
      console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error)
      toast.error(
        error.response?.data?.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน'
      )
    } finally {
      setVisibleResetPasswordDialog(false)
    }
  }
  const onSaveUpdate = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    let sendData: EditRoleUser = {
      userId: value.mid,
      role: value.roles.flat(),
      FunctionRoleLocations: functionRolesValue,
      StaffId: data.staffId,
    }

    const promise = opsappregisterService
      .editRoleUser(sendData)
      .then(() => {
        router.push({
          pathname: '/opsapp-register',
        })
      })
      .catch((e) => {
        console.log('error message', e.response.data.messages[0])
        if (e.response.data.messages[0]) {
          formRef.current?.setError('email', {
            message: e.response.data.messages[0],
          })
        }
        throw e.response.data
      })
      .finally()
    toast.promise(promise, defaultToastMessage)
  }

  const onLockStatusChange = () => {
    setVisibleLockDialog(true)
  }
  const isActiveStatusChange = () => {
    setVisibleisActiveDialog(true)
  }

  const onConfirmLockChange = async () => {
    const newStatus = !checked
    setChecked(newStatus)
    const value = formRef.current?.getValues()

    let sendData: UnlockUser = {
      mid: value.mid,
    }

    const promise = opsappregisterService.unlockUser(sendData).then(() => {
      setVisibleLockDialog(false)
    })
    toast.promise(promise, defaultToastMessage)
  }
  const onConfirmisActiveChange = async () => {
    const newStatus = !checkedisActive
    setCheckedisActive(newStatus)
    const value = formRef.current?.getValues()

    let sendData: isActive = {
      mid: value.mid,
      isActive: newStatus,
    }

    const promise = opsappregisterService.isActive(sendData).then(() => {
      setVisibleisActiveDialog(false)
    })
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Edit User')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/opsapp-register',
    })
  }

  const addUserDesignation = () => {
    const value = [...userDesignations, { location: [], role: [] }]
    setUserDesignations(value)
  }

  const rehandleUserDesignationChange = (fancdata: any) => {
    const data: any = {}

    fancdata.forEach((item: any) => {
      if (!data[item.locationId]) {
        data[item.locationId] = {
          location: item.locationId,
          role: [],
        }
      }
      data[item.locationId].role.push(item.functionRoleId)
    })

    const mergedData = Object.values(data)

    const roleMap: any = {}

    mergedData.forEach((item: any) => {
      const roleKey = item.role.sort().join(',')
      if (!roleMap[roleKey]) {
        roleMap[roleKey] = {
          location: [],
          role: item.role,
        }
      }
      roleMap[roleKey].location.push(item.location)
    })

    const finalData: ImapLocationandRole[] = Object.values(roleMap)
    return finalData
  }

  const handleUserDesignationChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedDesignations = [...userDesignations]
    console.log('value====================>', value)
    updatedDesignations[index] = {
      ...updatedDesignations[index],
      [field]: value,
    }
    setUserDesignations(updatedDesignations)

    const functionRoleLocation: IfunctionRoleLocations[] = []
    updatedDesignations.forEach((e) => {
      if (e.location && e.role) {
        e.location.forEach((location: number) => {
          e.role.forEach((role: number) => {
            functionRoleLocation.push({
              LocationId: location,
              FunctionRoleId: role,
            })
          })
        })
      }
    })
    setFunctionRolesValue(functionRoleLocation)
  }

  const removeUserDesignation = (index: number) => {
    userDesignations.splice(index, 1)

    const functionRoleLocation: IfunctionRoleLocations[] = []
    userDesignations.forEach((e) => {
      if (e.location && e.role) {
        e.location.forEach((location: number) => {
          e.role.forEach((role: number) => {
            functionRoleLocation.push({
              LocationId: location,
              FunctionRoleId: role,
            })
          })
        })
      }
    })
    setFunctionRolesValue(functionRoleLocation)
  }

  const getAvailableLocations = (index: number) => {
    const selectedLocations = userDesignations
      .filter((_, i) => {
        return i !== index
      })
      .map((designation) => {
        return designation.location
      })
      .flat()

    return locations.filter(
      (location) => !selectedLocations.includes(location.refId)
    )
  }

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          className='px-5 text-primary-blue'
          label='Cancel'
          type='button'
          severity='secondary'
          text
          onClick={OnCancel}
        />
        <Button
          className='px-3 bg-primary-blue'
          label='Save change'
          onClick={() => {
            formRef.current?.trigger().then((res) => {
              if (res) {
                setVisiblePublishDialog(true)
              }
            })
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <FormController
        defualtValue={formData}
        ref={formRef}
        onSubmit={() => setVisiblePublishDialog(true)}
      >
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-5'>
              Details
            </span>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField label='Member ID' name='mid' disabled />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField label='Email' name='email' disabled />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='First Name'
                  name='firstName'
                  value={firstName}
                  disabled
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Last Name'
                  name='lastName'
                  value={lastName}
                  disabled
                />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-9'>
                <MultipleSelectField
                  label='Role'
                  name='roles'
                  options={roles}
                  optionLabel='roleName'
                  optionValue='rid'
                  placeholder='Select Role..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Role is required.' }}
                  display='chip'
                />
              </div>
            </div>
          </div>
        </div>

        {showLocationRoleSection && roles && roles.length > 0 && (
          <div className='card mb-5'>
            <div className='p-2'>
              <span className='flex text-xl tw-text-[#2B3674] font-bold mb-5'>
                Edit User Designations
              </span>

              <Button
                label='Add'
                icon='pi pi-plus'
                onClick={addUserDesignation}
                className='mb-3'
                type='button'
              />

              {userDesignations.map((designation, index) => (
                <div className='flex items-center gap-4 mb-3' key={index}>
                  <div className='field col-12 md:col-5'>
                    <MultipleSelectFieldToken
                      label='Location'
                      name={`functionRoleLocation[${index}][typeId]`}
                      value={designation.location}
                      options={getAvailableLocations(index)}
                      optionLabel='UseName'
                      optionValue='refId'
                      placeholder='Select Location..'
                      className='w-full'
                      showClear
                      display='chip'
                      onChange={(e) =>
                        handleUserDesignationChange(index, 'location', e.value)
                      }
                      filter
                      filterBy='name'
                    />
                  </div>

                  <div className='field col-12 md:col-5'>
                    <MultipleSelectField
                      label='Role'
                      name={`functionRoleLocation[${index}][FunctionRoleId]`}
                      value={designation.role}
                      options={functionRoles}
                      optionLabel='name'
                      optionValue='id'
                      placeholder='Select Role..'
                      className='w-full'
                      showClear
                      display='chip'
                      onChange={(e) =>
                        handleUserDesignationChange(index, 'role', e.value)
                      }
                      filter
                      filterBy='name'
                    />
                  </div>

                  <div className='field col-12 md:col-2 flex justify-center items-center'>
                    <Button
                      label='Delete'
                      icon='pi pi-trash'
                      onClick={() => removeUserDesignation(index)}
                      className='p-button-danger p-button-sm'
                      style={{
                        fontSize: '12px',
                        height: '43px',
                        width: '354px',
                        marginTop: '28px',
                        marginRight: '60px',
                      }}
                      type='button'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-3'>
              Locked User
            </span>

            <div className='formgrid grid'>
              <div className='field flex col-12 align-items-end md:col-4'>
                <div
                  className='flex flex-column gap-2'
                  style={{ minWidth: '70px' }}
                >
                  <label htmlFor='isActive' className='font-bold'>
                    {checked ? 'Locked' : 'Unlock'}
                  </label>
                  <InputSwitch
                    id='isLocked'
                    name='isLocked'
                    checked={checked}
                    onChange={onLockStatusChange}
                    disabled={!data.isLocked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-3'>
              IsActive User
            </span>

            <div className='formgrid grid'>
              <div className='field flex col-12 align-items-end md:col-4'>
                <div
                  className='flex flex-column gap-2'
                  style={{ minWidth: '70px' }}
                >
                  <label htmlFor='isActive' className='font-bold'>
                    {checkedisActive ? 'Active' : 'UnActive'}
                  </label>
                  <InputSwitch
                    id='isActive'
                    name='isActive'
                    checked={checkedisActive}
                    onChange={isActiveStatusChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='card mb-5'>
          {isResetPassWord && (
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-3'>
              Reset Password
            </span>
          )}

          {isResetPassWord && (
            <Button
              className='px-5 bg-primary-blue text-white'
              label='Reset Password'
              type='button'
              severity='secondary'
              text
              onClick={() => {
                setVisibleResetPasswordDialog(true)
              }}
            />
          )}
        </div>
      </FormController>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleResetPasswordDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleResetPasswordDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to Reset password?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onResetPassword}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleLockDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => setVisibleLockDialog(false)}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to change the{' '}
              {data.isLocked ? 'unlock' : 'lock'} user ?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onConfirmLockChange}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleisActiveDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleisActiveDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to change the active user?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onConfirmisActiveChange}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      >
        {' '}
      </Dialog>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visiblePublishDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisiblePublishDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to save these changes?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onSaveUpdate}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
    </>
  )
}

OpsAppRegisterEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const isResetPassWord = ctx.props?.can?.includes('GT005')
    const { id } = ctx.props.query
    const roleRes = await opsappregisterService.getOpsAppRoleList()
    const roles = roleRes
    const rolesData = await opsappregisterService.getFunctionRoles()
    let locationsData = await opsappregisterService.getLocations()
    locationsData = locationsData.map((item: any) => ({
      ...item,
      UseName: `${item.name} (${item.locationCode})`,
    }))

    // .map((x) => {
    //   return { name: x.roleName, value: x.rid }
    // })
    const data: IGetOpsAppRegister =
      await opsappregisterService.getByIdMemberSOC(id)
    ctx.props = {
      ...ctx.props,
      roles,
      id,
      data,
      rolesData,
      locationsData,
      isResetPassWord,
    }
    return ctx
  },
  {},
  {
    redirectPath: '/opsapp-register',
    accessPage: PCODE.CREATEONBOARDINGREGISTER,
  }
)
