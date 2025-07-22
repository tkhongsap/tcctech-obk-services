import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import TextAreaField from '@components/forms/components/text-area-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { useRef } from 'react'

interface IFormInput {
  reason: string
}

export default function DialogReject({
  visible,
  setVisible,
}: {
  visible: boolean
  setVisible: Function
  onConfirm: Function
}) {
  const formRef = useRef<FormControllerRef<IFormInput>>(null)

  const confirm = (data: IFormInput) => {
    console.log(data)
  }

  const defaultValues: IFormInput = {
    reason: '',
  }

  return (
    <Dialog
      header='confirm'
      blockScroll={true}
      visible={visible}
      style={{ width: '50vw' }}
      onHide={() => {
        formRef.current?.reset()
        setVisible(false)
      }}
    >
      <FormController
        ref={formRef}
        defualtValue={defaultValues}
        onSubmit={confirm}
      >
        <div className='mb-3'>
          Are you sure you want to deny this request? Please provide the reason
          for the rejection.
        </div>
        <div>
          <TextAreaField
            name='reason'
            placeholder='Input your comments here'
            rules={{ required: 'Comments is required.' }}
          />
        </div>
        <div className='flex gap-3'>
          <div>
            <Button className='bg-gray-900 border-gray-900 text-gray-50'>
              Confirm
            </Button>
          </div>
          <div>
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              onClick={() => {
                formRef.current?.reset()
                setVisible(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </FormController>
    </Dialog>
  )
}
