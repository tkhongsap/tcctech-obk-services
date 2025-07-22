/* eslint-disable unused-imports/no-unused-vars-ts */
import React from 'react'
import { useFormController } from './form-controller'
import { Controller } from 'react-hook-form'
import LabelField from '../utils/label-field'
import { getFormErrorMessage } from '../utils/form-error-message'
import { Checkbox } from 'primereact/checkbox'
import { classNames } from 'primereact/utils'

const CheckBoxField = (props: any) => {
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
          <Checkbox
            id={field.name}
            checked={field.value}
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            onChange={(e) => {
              field.onChange(e.checked)
              onChange?.(e.checked)
            }}
            {...rest}
          />
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default CheckBoxField
