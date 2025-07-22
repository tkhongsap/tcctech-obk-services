import { Controller } from 'react-hook-form'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import LabelField from '@components/forms/utils/label-field'
import { classNames } from 'primereact/utils'
import { DatePicker } from 'antd'
import { getFormErrorMessage } from '../utils/form-error-message'

type Props = IFieldInput & {
  onChange?: () => void
  className?: () => string
  validate?: any
}

const DateTimeField = (props: Props) => {
  const { control, clearErrors, setError } = useFormController()
  const {
    name,
    rules,
    label,
    onChange,
    className,
    validate,
    showRequiredLabel = true,
    ...rest
  } = props

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules }}
      render={({ field, formState, fieldState }) => (
        <LabelField
          htmlFor={field.name}
          label={label}
          isRequired={showRequiredLabel && !!rules?.required}
        >
          <DatePicker
            value={field.value}
            name={name}
            onChange={(dates) => {
              field.onChange(dates)
              onChange && onChange()
              if (validate) {
                if (validate(dates)) {
                  clearErrors(name)
                } else {
                  setError(name, {
                    type: 'manual',
                    message: 'Please enter a valid URL',
                  })
                }
              }
            }}
            status={fieldState.error ? 'error' : undefined}
            style={{
              padding: '11px',
              height: 'auto',
              width: 'auto',
              borderRadius: '7px',
              borderWidth: '1.1px',
              border: fieldState.error ? undefined : '1px solid #d1d5db',
            }}
            className={'w-full flex h-auto ' + classNames(className)}
            showTime
            {...rest}
          />
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default DateTimeField
