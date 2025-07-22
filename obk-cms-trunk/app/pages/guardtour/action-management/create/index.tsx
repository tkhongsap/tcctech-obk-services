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
import { KeyValue } from '@src/types/key-value'
import { toast } from 'react-toastify'
import { defaultToastMessage } from '@src/utils/default-toast'
import { actionManagementService } from '@src/services/guardtour/action-management/service'
import { CreateActionManagement } from '@src/services/guardtour/action-management/model'

type Props = {
  actionTypes: KeyValue[]
}

export default function ActionCreate(props: Props) {
  const { actionTypes } = props
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)
  const [selectedActionType, setSelectedActionType] = useState<string | null>(
    null
  )
  const qrValue = actionTypes.find((type) => type.name === 'qr')?.value

  const formData = new CreateActionManagement(undefined)

  const onPublish = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    if (
      !value.metaData?.qrId ||
      value.atid != 'e8eb7171-de01-4a85-a955-711b211eecc2'
    ) {
      delete value.metaData
    }

    console.log(value)

    const promise = actionManagementService.createAction(value).then(() => {
      router.push({
        pathname: '/guardtour/action-management',
      })
    })
    toast.promise(promise, defaultToastMessage)
  }

  useEffect(() => {
    setMenuName('Create Action')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/action-management',
    })
  }

  // const onChange =((e:any) => {
  //   setErrormessage(null)
  //   setSelectedActionType(e.value)
  // })

  const buttonAction = (
    <div className='flex flex-column xl:flex-row mb-5 justify-content-between align-items-center'>
      <div className='flex gap-3 px-3'>
        <Button
          type='button'
          className='px-5 text-primary-blue'
          label='Cancel'
          severity='secondary'
          text
          onClick={OnCancel}
        />
        <Button
          className='px-3 bg-primary-blue'
          label='Create Action'
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
            <span className='flex text-xl font-bold mb-5'>Details</span>

            <div className='formgrid grid'>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Action Name'
                  name='name'
                  rules={{ required: 'Name is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <TextField
                  label='Description'
                  name='description'
                  rules={{ required: 'Description is required.' }}
                />
              </div>
              <div className='field col-12 md:col-4'>
                <DropdownField
                  label='Action Type'
                  name='atid'
                  options={actionTypes}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Select Action..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Action is required.' }}
                  onChange={(e) => setSelectedActionType(e.value)}
                />
              </div>
            </div>

            <div
              className='formgrid grid'
              style={selectedActionType !== qrValue ? { display: 'none' } : {}}
            >
              <div className='field col-12'>
                <TextField
                  label='Meta Data'
                  name='metaData.qrId'
                  disabled={selectedActionType !== qrValue}
                  rules={{
                    required:
                      selectedActionType === qrValue
                        ? 'Meta data is required for QR action type.'
                        : undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {buttonAction}
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
              Are you sure you want to create this action?
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
ActionCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const actionTypesRes = await actionManagementService.getAllActionType()
    const actionTypes = actionTypesRes.data.map((x) => {
      return { name: x.action, value: x.id } as KeyValue
    })

    console.log(actionTypes)

    ctx.props = { ...ctx.props, actionTypes }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/action-management',
    accessPage: PCODE.VIEWGUARDTOURACTIONMANAGEMENT,
  }
)
