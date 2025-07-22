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
  IGetRosterRegister,
  IUpsertRosterRegister,
  UpsertRosterRegister,
} from '@src/services/roster/model'
import { rosterregisterService } from '@src/services/roster/service'

import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'

import DropdownField from '@components/forms/components/dropdown-field'

type Location = {
  name: string
  locationCode: string
  refId: string
}

type Props = {
  id: string
  data: IGetRosterRegister
  locations: Location[]
}

export default function RosterRegisterCreate(props: Props) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )

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
  const { locations } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()

  const formRef = useRef<FormControllerRef<UpsertRosterRegister>>(null)

  let data: IGetRosterRegister = {
    id: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    component: '',
    weekDay: 0,
    weekEnd: 0,
    locationCode: '',
    isActive: true,
  }

  const formData = new UpsertRosterRegister(data)

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    let sendData: IUpsertRosterRegister = {
      component: value!.component,
      locationCode: value!.locationCode,
      weekDay: value!.weekDay,
      weekEnd: value!.weekEnd,
    }
    const promise = rosterregisterService
      .createUser(sendData)
      .then(() => {
        router.push({
          pathname: '/usagemonitoring/roster',
        })
      })
      .catch((e) => {
        if (e.response.data.messages[0]) {
          formRef.current?.setError('component', {
            message: e.response.data.messages[0],
          })
        }
        throw e.response.data
      })

    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    const fetchData = async () => {}
    fetchData()
    setMenuName('Create Roster')
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
          className='px-3 bg-primary-blue'
          label='Create Roster'
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
                />
              </div>
              <div className='field col-12 md:col-4'>
                <div className='p-inputgroup w-full'>
                  <div className='relative w-full' style={{ display: 'none' }}>
                    <TextField
                      label='RefID'
                      name='RefID'
                      value={selectedLocation?.refId || ''}
                      placeholder='RefID will update automatically'
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

RosterRegisterCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    let locations = await rosterregisterService.getLocations()
    locations = locations.map((item: any) => ({
      ...item,
      name: `${item.name} (${item.locationCode})`,
    }))
    ctx.props = { ...ctx.props, locations }

    return ctx
  },
  {},
  {
    redirectPath: '/usagemonitoring/roster',
    accessPage: PCODE.VIEWGUARDTOURSCHEDULEPLAN,
  }
)
