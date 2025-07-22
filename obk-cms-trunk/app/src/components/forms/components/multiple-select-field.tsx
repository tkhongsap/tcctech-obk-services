import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect'
import LabelField from '../utils/label-field'

type Props = IFieldInput & MultiSelectProps

const MultipleSelectField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    className,
    onChange,
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
          <MultiSelect
            id={field.name}
            value={field.value}
            onChange={(e) => {
              field.onChange(e.value)
              onChange && onChange(e)
            }}
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            {...rest}
          />
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default MultipleSelectField
