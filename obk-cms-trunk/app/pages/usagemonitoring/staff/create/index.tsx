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
import DropdownField from '@components/forms/components/dropdown-field'
import {
  IStaffRolesList,
  IGetStaffTableRegister,
  UpsertsStaffTableRegister,
  IUpsertStaffTableRegister,
} from '@src/services/usagemonitoring/staff-table/model'
import { staffTableregisterService } from '@src/services/usagemonitoring/staff-table/service'

import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { InputSwitch } from 'primereact/inputswitch'

type Props = {
  roles: IStaffRolesList[]
}

export default function StaffTableCreate(props: Props) {
  const { roles } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<UpsertsStaffTableRegister>>(null)
  const [mustUseOpsApp, setMustUseOpsApp] = useState<boolean>(true) // ให้ใช้ boolean แทนที่จะเป็น true

  const handleMustUseOpsAppChange = (value: boolean) => {
    setMustUseOpsApp(value) // อัปเดตสถานะเมื่อ toggle
  }

  let data: IGetStaffTableRegister = {
    sfid: '',
    staffName: '',
    email: '',
    component: '',
    position: '',
    company: '',
    location: '',
    mustUseOpsApp: true,
    isActive: true,
  }
  const formData = new UpsertsStaffTableRegister(data)

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    let sendData: { data: IUpsertStaffTableRegister[] } = {
      data: [
        {
          staffName: String(value!.staffName),
          email: String(value!.email),
          component: String(value!.component),
          position: String(value!.position),
          company: String(value!.company),
          mustUseOpsApp: mustUseOpsApp,
          isActive: value!.isActive,
        },
      ],
    }

    const promise = staffTableregisterService
      .createUser(sendData)
      .then((e: any) => {
        if (e.data.data.errors.length > 0) {
          formRef.current?.setError('email', {
            message: e.data.data.errors[0],
          })
          throw e.data.data.errors
        }

        router.push({
          pathname: '/usagemonitoring/staff',
        })
      })
      .catch((e) => {
        if (e.response.data.messages[0]) {
          formRef.current?.setError('email', {
            message: e.response.data.messages[0],
          })
        }
        throw e.response.data
      })
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Create User')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/usagemonitoring/staff',
    })
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
              <div className='field col-12 md:col-6'>
                <TextField
                  label='Staff Name'
                  name='staffName'
                  placeholder='Enter Staff Name...'
                  rules={{ required: 'Staff name is required.' }}
                />
              </div>
              <div className='field col-12 md:col-6'>
                <TextField
                  label='Email'
                  name='email'
                  placeholder='Enter Email...'
                  rules={{ required: 'Email is required.' }}
                />
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-6'>
                <DropdownField
                  label='Component'
                  name='component'
                  options={roles}
                  optionLabel='component'
                  optionValue='component'
                  placeholder='Select Component..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Component is required.' }}
                />
              </div>
              <div className='field col-12 md:col-6'>
                <TextField
                  label='Position'
                  name='position'
                  placeholder='Enter Position...'
                />
              </div>
            </div>
            <div className='formgrid grid'>
              <div className='field col-12 md:col-6'>
                <TextField
                  label='Company'
                  name='company'
                  placeholder='Enter Company...'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='card mb-5'>
          <div className='p-2'>
            <span className='flex text-xl tw-text-[#2B3674] font-bold mb-3'>
              Must Use Opsapp
            </span>

            <div className='formgrid grid'>
              <div className='field flex col-12 align-items-end md:col-4'>
                <div
                  className='flex flex-column gap-2'
                  style={{ minWidth: '70px' }}
                >
                  <InputSwitch
                    id='mustUseOpsApp'
                    name='mustUseOpsApp'
                    checked={mustUseOpsApp}
                    onChange={(e) => {
                      handleMustUseOpsAppChange(e.value)
                    }}
                    aria-label='Toggle must use ops app'
                  />
                </div>
              </div>
            </div>
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
StaffTableCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const roleRes = await staffTableregisterService.getStaffRolesList()

    const roles = roleRes.data || []

    ctx.props = { ...ctx.props, roles }
    return ctx
  },
  {},
  {
    redirectPath: '/usagemonitoring/staff',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
