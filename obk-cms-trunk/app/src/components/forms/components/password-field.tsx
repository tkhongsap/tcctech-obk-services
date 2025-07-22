import LabelField from '@components/forms/utils/label-field'
import { Password, PasswordProps } from 'primereact/password'
import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { getFormErrorMessage } from '../utils/form-error-message'

type Props = IFieldInput &
  PasswordProps & {
    validate?: any
  }

const PasswordField = (props: Props) => {
  const { control, clearErrors, setError } = useFormController()
  const {
    name,
    rules,
    label,
    onChange,
    className,
    showRequiredLabel = true,
    validate,
    maxLength,
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
          <Password
            id={field.name}
            value={field.value}
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            maxLength={maxLength}
            onChange={(e) => {
              field.onChange(e.target.value)
              onChange && onChange(e)
              if (validate) {
                if (validate(e.target.value)) {
                  clearErrors(name)
                } else {
                  setError(name, {
                    type: 'manual',
                    message: 'Invalid password',
                  })
                }
              }
            }}
            feedback={true}
            toggleMask={true}
            {...rest}
          />
          {maxLength && (
            <p className='textbox-character-count'>{`${
              field.value?.length ?? 0
            } / ${maxLength}`}</p>
          )}
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default PasswordField
