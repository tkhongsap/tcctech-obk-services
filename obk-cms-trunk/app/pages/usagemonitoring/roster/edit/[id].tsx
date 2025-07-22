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
  GetRosterRegister,
  IGetRosterRegister,
} from '@src/services/roster/model'
import { rosterregisterService } from '@src/services/roster/service'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import DropdownField from '@components/forms/components/dropdown-field'
type Location = {
  name: string
  locationCode: string
}
type Props = {
  id: string
  data: IGetRosterRegister
  locations: Location[]
}

export default function RosterRegisterEdit(props: Props) {
  const { data, id } = props
  const { locations } = props
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )

  const onDeleteAction = async () => {
    const value = formRef.current?.getValues()
    await rosterregisterService
      .deleteAction(value.id)
      .then(() => {
        router.push({
          pathname: '/usagemonitoring/roster',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    if (data.locationCode) {
      const foundLocation = props.locations.find(
        (loc) => loc.locationCode === data.locationCode
      )
      setSelectedLocation(foundLocation || null)
    }
  }, [data, props.locations])

  const handleComponentChange = (e: { value: string }) => {
    if (!locations) return
    const selected = locations.find((loc) => loc.name === e.value) || null
    setSelectedLocation(selected)
  }

  useEffect(() => {
    if (selectedLocation) {
      formRef.current?.setValue('locationCode', selectedLocation.locationCode)
    }
  }, [selectedLocation])

  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)

  const formData = new GetRosterRegister(data)

  const onSaveUpdate = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    let sendData = {
      id: id,
      component: value!.component,
      weekDay: value!.weekDay,
      weekEnd: value!.weekEnd,
      locationCode: value!.locationCode,
    }
    const promise = rosterregisterService
      .editRoleUser(sendData)
      .then(() => {
        router.push({
          pathname: '/usagemonitoring/roster',
        })
      })
      .finally()
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Edit Roster')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/usagemonitoring/roster',
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
          type='button'
          className='px-5'
          label='Delete'
          severity='danger'
          onClick={onDeleteAction}
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
                <DropdownField
                  label='Component'
                  name='component'
                  options={locations}
                  optionLabel='name'
                  optionValue='name'
                  placeholder='Select Component..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Component is required.' }}
                  filter
                  filterBy='name'
                  onChange={handleComponentChange}
                  disabled
                  value={selectedLocation?.name}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <div className='p-inputgroup w-full'>
                  <div className='relative w-full' style={{ display: 'none' }}>
                    <TextField
                      label='locationCode'
                      name='locationCode'
                      value={selectedLocation?.locationCode || ''}
                      placeholder='Location Code will update automatically'
                      className='w-full'
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Week Day'
                  name='weekDay'
                  placeholder='Week Day quantity...'
                  type='text'
                  rules={{
                    required: 'Quantity is required.',
                    validate: (value) =>
                      /^\d+$/.test(value) ||
                      'Only positive numbers are allowed.',
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/\d/.test(e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Tab'
                    ) {
                      e.preventDefault()
                    }
                  }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <div className='p-inputgroup w-full'>
                  <div className='relative w-full'>
                    <TextField
                      label='Week End'
                      name='weekEnd'
                      placeholder='Week End quantity...'
                      type='text'
                      rules={{
                        required: 'Quantity is required.',
                        validate: (value) =>
                          /^\d+$/.test(value) ||
                          'Only positive numbers are allowed.',
                      }}
                      onKeyDown={(e) => {
                        if (
                          !/\d/.test(e.key) &&
                          e.key !== 'Backspace' &&
                          e.key !== 'Tab'
                        ) {
                          e.preventDefault()
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              type='button'
              className='px-5'
              label='Delete'
              severity='danger'
              onClick={onDeleteAction}
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

RosterRegisterEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const roleRes = await rosterregisterService.getRosterRoleList()
    const roles = roleRes
    const locationRes = await rosterregisterService.getRosterRoleList()
    const locations = locationRes
    const data: IGetRosterRegister =
      await rosterregisterService.getByIdMemberSOC(id)
    ctx.props = { ...ctx.props, roles, id, data, locations }
    return ctx
  },
  {},
  {
    redirectPath: '/opsapp-register',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
