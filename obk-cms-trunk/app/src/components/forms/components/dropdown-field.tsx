import LabelField from '@components/forms/utils/label-field'
import { Dropdown, DropdownProps } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
import React, { CSSProperties } from 'react'
import { Controller } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
type Props = IFieldInput &
  DropdownProps & {
    dropdownStyles?: CSSProperties
  }

const DropdownField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    onChange,
    className,
    showRequiredLabel = true,
    dropdownStyles,
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
          <Dropdown
            id={field.name}
            value={field.value}
            style={dropdownStyles ?? {}}
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            onChange={(e) => {
              field.onChange(e.target.value)
              onChange && onChange(e)
            }}
            {...rest}
          ></Dropdown>
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default DropdownField
