import { Controller } from 'react-hook-form'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { InputNumber, InputNumberProps } from 'primereact/inputnumber'
import LabelField from '@components/forms/utils/label-field'
import { classNames } from 'primereact/utils'
import { getFormErrorMessage } from '../utils/form-error-message'

type Props = IFieldInput & InputNumberProps

const NumberField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    className,
    onChange,
    showRequiredLabel = true,
    helperText,
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
          helperText={helperText}
        >
          <InputNumber
            id={field.name}
            value={field.value}
            placeholder={props.placeholder ?? ''}
            disabled={props.disabled ?? false}
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

export default NumberField
