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
  IfunctionRoleLocations,
  IGetOpsAppRegister,
  ImapLocationandRole,
  IUpsertOpsAppRegister,
  UpsertOpsAppRegister,
} from '@src/services/opsapp-register/model'
import { opsappregisterService } from '@src/services/opsapp-register/service'
import { v4 as uuidv4 } from 'uuid'
import PasswordField from '@components/forms/components/password-field'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import MultipleSelectFieldToken from '@components/forms/components/multiple-select-field-token'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'

type Props = {
  id: string
  data: IGetOpsAppRegister
  roles: any[]
}

export default function OpsAppRegisterCreate(props: Props) {
  const [selectedLocations, setSelectedLocations] = useState<number[]>([])

  const [functionRolesValue, setFunctionRolesValue] = useState<
    IfunctionRoleLocations[]
  >([])

  const addUserDesignation = () => {
    const value = [
      ...userDesignations,
      { location: '', role: '' },
    ] as ImapLocationandRole[]
    setUserDesignations(value)
  }

  const [userDesignations, setUserDesignations] = useState<
    ImapLocationandRole[]
  >([])
  const removeUserDesignation = (index: number) => {
    const updatedDesignations = [...userDesignations]
    updatedDesignations.splice(index, 1)
    setUserDesignations(updatedDesignations)
  }
  const [functionRoles, setFunctionRoles] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  const { roles } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<UpsertOpsAppRegister>>(null)
  let data: IGetOpsAppRegister = {
    mid: '',
    email: '',
    password: '',
    identifyNumber: '',
    identifyType: 0,
    userType: '',
    name: '',
    firstName: '',
    lastName: '',
    updatedDate: '',
    isLocked: false,
    roles: [
      {
        roleName: '',
        rid: '',
      },
    ],
    location: '',
    functionRoleLocation: [{ LocationId: 0, FunctionRoleId: 0 }],
    staffId: 0,
    userDesignations: [
      {
        location: [0],
        role: [0],
      },
    ],
    keyCloakUserId: '',
    isActive: false,
  }
  const formData = new UpsertOpsAppRegister(data)

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    let sendData: IUpsertOpsAppRegister = {
      id: uuidv4(),
      emailOrPhone: value!.emailOrPhone,
      password: value!.password,
      identifyNumber: 'N/A',
      identifyType: 0,
      userType: value!.userType,
      firstName: value!.firstName,
      lastName: value!.lastName,
      FunctionRoleLocation: functionRolesValue,
    }

    const promise = opsappregisterService
      .createUser(sendData)
      .then(() => {
        router.push({
          pathname: '/opsapp-register',
        })
      })
      .catch((e) => {
        if (e.response.data.messages[0]) {
          formRef.current?.setError('emailOrPhone', {
            message: e.response.data.messages[0],
          })
        }
        throw e.response.data
      })

    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await opsappregisterService.getFunctionRoles()
        const locationsData = await opsappregisterService.getLocations()
        const updatedData = locationsData.map((item: any) => ({
          ...item,
          UseName: `${item.name} (${item.locationCode})`,
        }))

        setFunctionRoles(rolesData)
        setLocations(updatedData)
      } catch (error) {}
    }
    fetchData()
    setMenuName('Create User')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/opsapp-register',
    })
  }

  const handleLocationChange = (index: number, value: any) => {
    const updatedDesignations = [...userDesignations]
    updatedDesignations[index].location = value

    const updatedLocations = updatedDesignations.map((d) => d.location).flat()
    setSelectedLocations(updatedLocations)

    setUserDesignations(updatedDesignations)

    const functionRoleLocation: {
      LocationId: number
      FunctionRoleId: number
    }[] = []
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

  const getAvailableLocations = (index: number) => {
    const usedLocations = [...selectedLocations]
    const currentLocation = userDesignations[index]?.location || []

    const filteredLocations = locations.filter(
      (location) =>
        !usedLocations.includes(location.id) ||
        currentLocation.includes(location.id)
    )

    return filteredLocations
  }

  const handleUserDesignationChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedDesignations = [...userDesignations]
    updatedDesignations[index] = {
      ...updatedDesignations[index],
      [field]: value,
    }
    setUserDesignations(updatedDesignations)

    const functionRoleLocation: {
      LocationId: number
      FunctionRoleId: number
    }[] = []
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
          label='Create user'
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

  const handleTrim = (e: any, name: keyof UpsertOpsAppRegister) => {
    const trimmedValue = e.target.value.trim()
    formRef.current?.setValue(name, trimmedValue)
  }

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
                <TextField
                  label='Email'
                  name='emailOrPhone'
                  placeholder='Enter Email...'
                  rules={{
                    required: 'Email is required.',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Please enter a valid email address.',
                    },
                  }}
                  onChange={(e) => handleTrim(e, 'emailOrPhone')}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <div className='p-inputgroup w-full'>
                  <div className='relative w-full'>
                    <PasswordField
                      label='Password'
                      name='password'
                      feedback={false}
                      placeholder='Enter Password..'
                      rules={{ required: 'Password is required.' }}
                      onChange={(e) => handleTrim(e, 'password')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='First Name'
                  name='firstName'
                  placeholder='Enter First Name...'
                  rules={{ required: 'First Name is required.' }}
                  onChange={(e) => handleTrim(e, 'firstName')}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Last Name'
                  name='lastName'
                  placeholder='Enter Last Name...'
                  rules={{ required: 'Last Name is required.' }}
                  onChange={(e) => handleTrim(e, 'lastName')}
                />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-9'>
                <MultipleSelectField
                  label='Role'
                  name='userType'
                  options={roles}
                  optionLabel='roleName'
                  optionValue='userType'
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
                    name={`functionRoleLocation [${index}][location]`}
                    value={designation.location}
                    options={getAvailableLocations(index)}
                    optionLabel='UseName'
                    optionValue='refId'
                    placeholder='Select Location..'
                    className='w-full'
                    showClear
                    rules={{ required: 'Location is required.' }}
                    display='chip'
                    onChange={(e) => handleLocationChange(index, e.value)}
                    filter
                    filterBy='fullName'
                  />
                </div>

                <div className='field col-12 md:col-5'>
                  <MultipleSelectField
                    label='Role'
                    name={`functionRoleRole [${index}][role]`}
                    value={designation.role}
                    options={functionRoles}
                    optionLabel='name'
                    optionValue='id'
                    placeholder='Select Role..'
                    className='w-full'
                    showClear
                    rules={{ required: 'Role is required.' }}
                    display='chip'
                    onChange={(e) =>
                      handleUserDesignationChange(index, 'role', e.value)
                    }
                    filter
                    filterBy='fullName'
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

        <div className='flex flex-wrap gap-3'>{buttonAction}</div>
      </FormController>
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
              Are you sure you want to create this item?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onPublish}
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
OpsAppRegisterCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const roleRes = await opsappregisterService.getOpsAppRoleList()
    const roles = roleRes

    ctx.props = { ...ctx.props, roles }
    return ctx
  },
  {},
  {
    redirectPath: '/opsapp-register',
    accessPage: PCODE.CREATEONBOARDINGREGISTER,
  }
)
