import LabelField from '@components/forms/utils/label-field'
import React from 'react'
import { Controller } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { RadioButton, RadioButtonProps } from 'primereact/radiobutton'
import { classNames } from 'primereact/utils'

type Props = IFieldInput & {
  items: RadioButtonProps[]
  direction?: 'horizon' | 'vertical'
  defaultValue?: number
  onCustomChange?: (e: any) => void
}

const RadioGroupField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    items,
    showRequiredLabel = true,
    direction = 'horizon',
    defaultValue,
    onCustomChange,
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
          <div
            className={classNames('flex gap-4', {
              'flex-column': direction === 'vertical',
            })}
          >
            {items.map((x, i) => {
              const {
                inputId = x.name,
                value = x.value,
                className,
                onChange,
                ...rest
              } = x
              return (
                <div key={i}>
                  <RadioButton
                    inputId={inputId + name}
                    id={i.toString()}
                    value={value}
                    className={classNames(className, {
                      'p-invalid': fieldState.error,
                    })}
                    checked={
                      value === field.value ||
                      (defaultValue === value && field.value === undefined)
                    }
                    onChange={(e) => {
                      field.onChange(e)
                      onChange && onChange(e)
                      onCustomChange?.(e)
                    }}
                    {...rest}
                  />
                  <label
                    htmlFor={x.name + name}
                    className='ml-1 mr-3 text-primary-800 tw-text-sm'
                  >
                    {x.name}
                  </label>
                </div>
              )
            })}
          </div>
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default RadioGroupField
