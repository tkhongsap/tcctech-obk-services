/* eslint-disable */
import { KeyValue } from '@src/types/key-value'
import { useRef, useState } from 'react'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FilterDirectoryContact,
  IFilterDirectoryContact,
} from '@src/services/directory-contact/model'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'

type Props = {
  categories: KeyValue[]
  onFilter(e: IFilterDirectoryContact): void
}

export const DirectoryContactFilter = (props: Props) => {
  const formRef = useRef<FormControllerRef<IFilterDirectoryContact>>(null)
  const defualtValue = new FilterDirectoryContact(undefined)
  const router = useRouter()
  const { categories, onFilter } = props
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >()
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>('')

  const selectedCategoryTemplate = (option: KeyValue, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const footerTemplate = () => (
    <div className='flex justify-content-center border-top-1'>
      <Button
        className='text-primary-blue'
        label='Add Category'
        text
        onClick={() => router.push('/directory-contact/category/create')}
      />
    </div>
  )

  const onChange = (e: any) => {
    const value = formRef.current?.getValues() ?? defualtValue
    setSelectedCategoryId(value.categoryId)
    setSelectedCategoryTitle(
      categories.find((cat) => cat.value === value.categoryId)?.name || ''
    )
    onFilter(value)
  }

  const onEditCategoryClick = () => {
    router.push('/directory-contact/category/edit/' + selectedCategoryId)
  }

  return (
    <FormController
      ref={formRef}
      defualtValue={defualtValue}
      onSubmit={() => {}}
    >
      <div className='flex flex-wrap justify-content-between align-items-center w-full mb-5'>
        <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
          {selectedCategoryTitle || 'All Category'}
        </h3>
        <div className='flex gap-3'>
          <div className='flex flex-wrap gap-3'>
            <div className='flex w-full md:w-17rem'>
              <DropdownField
                name='categoryId'
                options={categories}
                optionLabel='name'
                optionValue='value'
                placeholder='Select category..'
                valueTemplate={selectedCategoryTemplate}
                className='w-full md:w-17rem'
                showClear
                onChange={onChange}
                panelFooterTemplate={footerTemplate}
              />
            </div>
            <div className='flex p-2'>
              <Button
                className='border-primary bg-transparent text-primary-blue'
                label='Edit Category'
                disabled={!selectedCategoryId}
                onClick={onEditCategoryClick}
              />
            </div>
          </div>
        </div>
      </div>
    </FormController>
  )
}
