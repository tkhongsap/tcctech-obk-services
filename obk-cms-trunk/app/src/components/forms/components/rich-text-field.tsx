import LabelField from '@components/forms/utils/label-field'
import { Editor, EditorProps } from 'primereact/editor'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { getFormErrorMessage } from '../utils/form-error-message'

import type { EditorTextChangeEvent } from 'primereact/editor'

type Props = IFieldInput &
  Omit<EditorProps, 'onChange'> & {
    validate?: (value: string) => boolean
    onChange?: (e: EditorTextChangeEvent) => void
  }

const RichTextField = (props: Props) => {
  const { control, clearErrors, setError } = useFormController()
  const {
    name,
    rules,
    label,
    onChange,
    className,
    showRequiredLabel = true,
    validate,
    ...rest
  } = props

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
          className='relative'
        >
          <div
            className={classNames(className, {
              'border-1 border-red-500': fieldState.error,
            })}
          >
            <Editor
              id={field.name}
              value={field.value}
              onTextChange={(e) => {
                const value = e.htmlValue ?? ''
                field.onChange(value)
                onChange && onChange(e)

                if (validate) {
                  if (validate(value ?? '')) {
                    clearErrors(name)
                  } else {
                    setError(name, {
                      type: 'manual',
                      message: 'Invalid content',
                    })
                  }
                }
              }}
              {...rest}
            />
          </div>
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default RichTextField
