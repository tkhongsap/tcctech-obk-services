import { AutoComplete, AutoCompleteProps } from 'primereact/autocomplete'
import { IFieldInput } from '../interfaces/field-input'
import { Controller } from 'react-hook-form'
import { useFormController } from './form-controller'
import LabelField from '../utils/label-field'
import { getFormErrorMessage } from '../utils/form-error-message'
import { classNames } from 'primereact/utils'

type Props = AutoCompleteProps & IFieldInput

const AutoCompleteField = (props: Props) => {
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
          <AutoComplete
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            value={field.value}
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

export default AutoCompleteField
