import LabelField from '@components/forms/utils/label-field'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { Editor, EditorProps } from 'primereact/editor'
import { Box } from '@chakra-ui/react'

type Props = IFieldInput &
  EditorProps & {
    isCustom?: boolean
  }

const EditorField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    onTextChange,
    className,
    showRequiredLabel = true,
    isCustom = false,
    ...rest
  } = props

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['code-block'],
    [{ color: [] }, { background: [] }],
  ]

  const editorHeader = <span className='ql-formats'></span>

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules }}
      render={({ field, fieldState, formState }) => (
        <LabelField
          htmlFor={field.name}
          label={label}
          isRequired={showRequiredLabel && !!rules?.required}
        >
          <Box cursor={'auto'}>
            <Editor
              draggable
              onDragStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              id={field.name}
              value={field.value}
              className={
                'w-full ' +
                classNames(className, { 'p-invalid': fieldState.error })
              }
              headerTemplate={isCustom ? editorHeader : undefined}
              modules={isCustom ? { toolbar: toolbarOptions } : undefined}
              onTextChange={(e) => {
                field.onChange(e.htmlValue)
                onTextChange && onTextChange(e)
              }}
              {...rest}
            />
            {getFormErrorMessage(field.name, formState.errors)}
          </Box>
        </LabelField>
      )}
    />
  )
}

export default EditorField
