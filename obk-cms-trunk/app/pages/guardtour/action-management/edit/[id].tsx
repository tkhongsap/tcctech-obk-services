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

import { GetActionManagement } from '@src/services/guardtour/action-management/model'
import { actionManagementService } from '@src/services/guardtour/action-management/service'

type Props = {
  actionTypes: KeyValue[]
  id: string
  data: GetActionManagement
}

export default function ActionEdit(props: Props) {
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false)
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const router = useRouter()
  const formRef = useRef<FormControllerRef<any>>(null)
  const { actionTypes, data, id } = props
  const [selectedActionType, setSelectedActionType] = useState<string | null>(
    null
  )
  const qrValue = actionTypes.find((type) => type.name === 'qr')?.value

  const formData = new GetActionManagement(data)

  const onSaveUpdate = async () => {
    setVisiblePublishDialog(false)
    const value = formRef.current?.getValues()

    let sendData = {
      name: value.name,
      description: value.description,
      aid: id,
      metaData: value.metaData,
    }

    console.log(sendData)
    const promise = actionManagementService
      .editAction(sendData)
      .then(() => {
        router.push({
          pathname: '/guardtour/action-management',
        })
      })
      .catch((e) => {
        console.log('error', e)
      })
    toast.promise(promise, defaultToastMessage)
  }

  const onDeleteAction = async () => {
    const value = formRef.current?.getValues()
    await actionManagementService
      .deleteAction(value.id)
      .then((res) => {
        console.log('res', res)

        router.push({
          pathname: '/guardtour/action-management',
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    setSelectedActionType(data.actionTypeId)
    setMenuName('Edit Action')
    setMenuAction(buttonAction)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

  const OnCancel = () => {
    router.push({
      pathname: '/guardtour/action-management',
    })
  }

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
          type='button'
          className='px-5'
          label='Delete'
          severity='danger'
          onClick={() => setVisibleDeleteDialog(true)}
        />
        <Button
          className='px-3 bg-primary-blue'
          label='Save Action'
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
                  label='Name'
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
                  name='actionType.id'
                  options={actionTypes}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Select Action..'
                  className='w-full'
                  showClear
                  rules={{ required: 'Action is required.' }}
                  disabled
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

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDeleteDialog}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleDeleteDialog(false)
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this action?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='px-5'
                type='submit'
                label='Delete'
                severity='danger'
                onClick={onDeleteAction}
              />
              <Button
                className='text-primary-blue'
                type='button'
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
ActionEdit.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const data = await actionManagementService.getById(id)

    const actionTypesRes = await actionManagementService.getAllActionType()
    const actionTypes = actionTypesRes.data.map((x) => {
      return { name: x.action, value: x.id } as KeyValue
    })

    ctx.props = { ...ctx.props, actionTypes, data, id }
    return ctx
  },
  {},
  {
    redirectPath: '/guardtour/action-management',
    accessPage: PCODE.VIEWGUARDTOURACTIONMANAGEMENT,
  }
)
