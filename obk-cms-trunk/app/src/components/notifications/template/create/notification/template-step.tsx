import DropdownField from '@components/forms/components/dropdown-field'
import TextField from '@components/forms/components/text-field'
import { KeyValue } from '@src/types/key-value'
import { Button } from 'primereact/button'

type Props = {
  categories: KeyValue[]
  disableCategory: boolean
}

export default function TemplateStep(props: Props) {
  const { categories } = props
  return (
    <div className='mb-5'>
      <span className='flex text-xl font-bold mb-5 pl-5 lg:pl-2 text-primary-800'>
        Template
      </span>
      <div className='flex w-full mt-2 p-5 lg:p-2'>
        <div className='grid w-full'>
          <div className='col-12 lg:col-6'>
            <TextField
              name='id'
              aria-describedby='username-help'
              label='Template ID'
              disabled
            />
          </div>
          <div className='col-12 lg:col-6'></div>
          <div className='col-12 lg:col-6'>
            <DropdownField
              name='message_category_id'
              label='Notification Category'
              options={categories}
              optionLabel='name'
              placeholder='Select Category'
              className='w-full'
              disabled={props.disableCategory}
              rules={{ required: 'Notification Category required' }}
            />
          </div>
          <div className='col-12'>
            <TextField
              name='name'
              label='Template name'
              rules={{ required: 'Template name required' }}
            />
          </div>
        </div>
      </div>

      <div className='flex justify-content-end w-full px-5'>
        <Button type='submit' className='px-5 bg-primary-blue' label='Next' />
      </div>
    </div>
  )
}
