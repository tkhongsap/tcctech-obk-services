import {
  FilterNotificationTemplate,
  IFilterNotificationTemplate,
} from './types/filter'
import { useRef } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import { KeyValue } from '@src/types/key-value'

interface Tags {
  name: string
  code: string
}

const target = ['All', 'All office worker', 'Shoppers']

type Props = {
  tags: KeyValue[]
  categories: KeyValue[]
  onFilter(data: IFilterNotificationTemplate): void
}

export const NotificationTemplateFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterNotificationTemplate>>(null)
  const { onFilter, categories, tags } = props

  const selectedTagTemplate = (option: Tags, props: any) => {
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
    const value = formRef.current?.getValues()
    onFilter(value!)
  }

  return (
    <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
      <h3 className='mb-5 lg:mb-0'>Templates</h3>
      <FormController
        ref={formRef}
        defualtValue={new FilterNotificationTemplate()}
        onSubmit={onFilter}
      >
        <div className='flex flex-wrap gap-3'>
          <div className='flex w-full md:w-14rem'>
            <TextField name='name' placeholder='Search' className='w-full' />
          </div>
          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='category'
              onChange={onChange}
              options={categories}
              placeholder='category'
              className='w-full md:w-14rem'
              optionLabel='name'
              optionValue='value'
            />
          </div>
          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='status'
              onChange={onChange}
              options={target}
              placeholder='Target audience'
              className='w-full md:w-14rem'
            />
          </div>

          <div className='flex w-full md:w-14rem'>
            <DropdownField
              name='tags'
              options={tags}
              placeholder='Tag'
              optionLabel='name'
              optionValue='value'
              valueTemplate={selectedTagTemplate}
              onChange={onChange}
              className='w-full md:w-14rem'
            />
          </div>
        </div>
      </FormController>
    </div>
  )
}
