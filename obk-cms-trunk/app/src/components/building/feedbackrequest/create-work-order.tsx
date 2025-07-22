import { ICreateAWorkOrderModel } from '@src/services/buildingservice/feedbackrequest/model'
import { Dialog } from 'primereact/dialog'
import { Dispatch, useRef } from 'react'
import { Button } from 'primereact/button'
import DropdownField from '@components/forms/components/dropdown-field'
import TextField from '@components/forms/components/text-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'

type Prop = {
  visible: boolean
  setVisible: Dispatch<React.SetStateAction<boolean>>
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  onSubmit: (data: ICreateAWorkOrderModel) => void
}

const dropdownOptions = ['value1', 'value2']

export function CreateWorkOrder(prop: Prop) {
  const defaultValues: ICreateAWorkOrderModel = {
    assignedTo: '',
    fromFeeedbackId: '',
    operatedBy: '',
  }

  const formRef = useRef<FormControllerRef<ICreateAWorkOrderModel>>(null)

  return (
    <Dialog
      header='Create a Work order'
      blockScroll={true}
      visible={prop.visible}
      style={{ width: '50vw' }}
      onHide={() => {
        prop.setVisible(false)
      }}
    >
      <FormController
        ref={formRef}
        defualtValue={defaultValues}
        onSubmit={prop.onSubmit}
      >
        <div className='grid'>
          <div className='col-12'>
            <TextField
              name='fromFeeedbackId'
              label='From feedback ID'
              rules={{ required: 'From feedback ID is required.' }}
            />
          </div>
          <div className='col-12'>
            <DropdownField
              name='operatedBy'
              label='Operated by'
              options={dropdownOptions}
              rules={{ required: 'Operated by is required.' }}
            />
          </div>
          <div className='col-12'>
            <DropdownField
              name='assignedTo'
              label='Assigned to'
              rules={{ required: 'Assigned to is required.' }}
              options={dropdownOptions}
            />
          </div>

          <div className='flex gap-3'>
            <Button
              className='bg-gray-900 border-gray-900 text-gray-50'
              type='submit'
            >
              Confirm
            </Button>
            <Button
              className='bg-gray-50 border-gray-900 text-gray-600'
              onClick={() => {
                formRef.current?.reset()
                prop.setVisible(false)
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
