import LabelField from '@components/forms/utils/label-field'
import { InputText, InputTextProps } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { getFormErrorMessage } from '../utils/form-error-message'

type Props = IFieldInput & {
  iconClass: string
  position?: 'left' | 'right'
} & InputTextProps

const IconTextField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    iconClass,
    position,
    className,
    showRequiredLabel = true,
    onChange,
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
          <span className={'p-input-icon-' + (position ?? 'left')}>
            <i className={iconClass} />
            <InputText
              id={field.name}
              value={field.value}
              placeholder={props.placeholder ?? ''}
              disabled={props.disabled ?? false}
              className={
                'w-full ' +
                classNames(className, { 'p-invalid': fieldState.error })
              }
              onChange={(e) => {
                field.onChange(e.target.value)
                onChange && onChange(e)
              }}
              {...rest}
            />
          </span>
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default IconTextField
