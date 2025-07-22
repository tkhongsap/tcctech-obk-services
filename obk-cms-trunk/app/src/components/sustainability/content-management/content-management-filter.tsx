import { KeyValue } from '@src/types/key-value'
import { FormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  ContentManagement,
  IContentManagement,
} from './content-management-interface'
import { Button } from 'primereact/button'
import CheckBoxField from '@components/forms/components/checkbox-field'

const status = [
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 },
]

type Props = {
  onFilter(e: IContentManagement): void
  title?: string
  search?: boolean
  formRef: any
  config?: boolean
  show?: boolean
  time?: boolean
  save?: boolean
  onSave?: any
}

export const ContentManagementFilter = (props: Props) => {
  const defualtValue = new ContentManagement(undefined)
  const {
    onFilter,
    title,
    search,
    formRef,
    config,
    show = false,
    time = false,
    save = false,
    onSave,
  } = props

  const selectedStatusTemplate = (option: KeyValue, props: any) => {
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
    <FormController ref={formRef} defualtValue={defualtValue} onSubmit={onSave}>
      <div
        className='flex flex-wrap justify-content-between items-end w-full mb-0'
        style={{ alignItems: 'flex-end' }}
      >
        {config ? (
          <div className='flex flex-wrap gap-3'>
            <div className='flex flex-column'>
              {time && (
                <div className='flex flex-column gap-1 w-full'>
                  <TextField
                    name={`time`}
                    rules={{ required: 'Time required' }}
                    showRequiredLabel={false}
                    placeholder='Enter slide time'
                    label='Time to Slide (Second)'
                  />
                </div>
              )}
              {show && (
                <div className='flex gap-1 tw-align-middle'>
                  <CheckBoxField
                    name={`show`}
                    rules={{ required: undefined }}
                    onChange={(e: boolean) => {
                      onSave(e)
                    }}
                    showRequiredLabel={false}
                    disabled={false}
                  />
                  <span
                    className='flex text-base font-bold text-primary-800 p-2 tw-mt-1 cursor-pointer'
                    style={{ userSelect: 'none' }}
                    onClick={() => {
                      const data = formRef.current?.getValues()
                      formRef.current.setValue('show', !data.show)
                      onSave(!data.show)
                    }}
                  >
                    Show Message &quot;Do not show this again&quot;
                  </span>
                </div>
              )}
            </div>
            {save && (
              <div className='flex flex-column'>
                <Button
                  disabled={false}
                  className={`px-5 bg-primary-blue`}
                  label='Save'
                  style={{ height: '44px', marginTop: '26.67px' }}
                  onClick={formRef.current?.handleSubmit(onSave)}
                />
              </div>
            )}
          </div>
        ) : (
          <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold mb-0'>
            {title ?? ''}
          </h3>
        )}

        <div className='flex flex-wrap gap-3'>
          {search && (
            <div className='flex w-full md:w-14rem '>
              <TextField
                name='filter'
                placeholder='Search'
                className='w-full'
                onChange={onChange}
              />
            </div>
          )}
          <div className='flex w-full md:w-14rem ml-2'>
            <DropdownField
              name='status'
              options={status}
              optionLabel='name'
              optionValue='value'
              placeholder='Status'
              valueTemplate={selectedStatusTemplate}
              className='w-full md:w-14rem'
              showClear
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </FormController>
  )
}
