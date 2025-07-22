import LabelField from '@components/forms/utils/label-field'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { Chips, ChipsProps } from 'primereact/chips'

type Props = ChipsProps &
  IFieldInput & {
    isCanDup?: boolean
  }

const ChipsField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    onChange,
    className,
    showRequiredLabel = true,
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
        >
          <Chips
            id={field.name}
            value={field.value}
            name={name}
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            onChange={(e) => {
              field.onChange(e.value)
              onChange && onChange(e)
            }}
            {...rest}
          />
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default ChipsField
