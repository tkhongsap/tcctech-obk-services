import { FilterNotification, IFilterNotification } from './inapp-notification'
import { useRef } from 'react'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import { KeyValue } from '@src/types/key-value'

const status: KeyValue[] = [
  { name: 'All', value: ' ' },
  { name: 'Waitng for approval', value: 'WATING_FOR_APPROVAL' },
  { name: 'Rejected', value: 'REJECTED' },
  { name: 'Approved (Scheduled)', value: 'APPROVED_SCHEDULED' },
  { name: 'Approved (Sent)', value: 'APPROVED_SENT' },
]

type Props = {
  tags: KeyValue[]
  catagories: KeyValue[]
  onFilter(e: IFilterNotification): void
}

export const NotificationFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterNotification>>(null)
  const defualtValue = new FilterNotification(undefined)
  const { tags, catagories, onFilter } = props

  const selectedTagTemplate = (option: KeyValue, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const onChange = () => {
    const value = formRef.current?.getValues() ?? defualtValue
    onFilter(value)
  }

  return (
    <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
      <h3 className='mb-5 lg:mb-0'>List</h3>
      <FormController
        ref={formRef}
        defualtValue={defualtValue}
        onSubmit={() => {}}
      >
        <div className='flex flex-wrap gap-3'>
          <div className='flex w-full md:w-14rem'>
            <TextField
              name='filter'
              placeholder='Search'
              className='w-full'
              onChange={onChange}
            />
          </div>
          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='status'
              optionLabel='name'
              optionValue='value'
              options={status}
              placeholder='Status'
              className='w-full md:w-14rem'
              onChange={onChange}
            />
          </div>
          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='category'
              optionLabel='name'
              optionValue='value'
              options={catagories}
              placeholder='Category'
              className='w-full md:w-14rem'
              showClear
              onChange={onChange}
            />
          </div>
          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='tag'
              options={tags}
              optionLabel='name'
              optionValue='value'
              placeholder='Tag'
              filter
              valueTemplate={selectedTagTemplate}
              className='w-full md:w-14rem'
              showClear
              onChange={onChange}
            />
          </div>
        </div>
      </FormController>
    </div>
  )
}
