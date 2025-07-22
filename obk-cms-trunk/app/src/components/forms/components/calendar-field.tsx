import { Controller } from 'react-hook-form'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import LabelField from '@components/forms/utils/label-field'
import { Calendar, CalendarProps } from 'primereact/calendar'
import { classNames } from 'primereact/utils'
import { getFormErrorMessage } from '../utils/form-error-message'

type Props = CalendarProps & IFieldInput

const CalendarField = (props: Props) => {
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
          <Calendar
            id={field.name}
            value={field.value}
            name={name}
            onChange={(e: any) => {
              field.onChange(e.target.value)
              onChange && onChange(e)
            }}
            showIcon
            className={
              'w-full ' +
              classNames(className, { 'p-invalid': fieldState.error })
            }
            readOnlyInput
            {...rest}
          />
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default CalendarField
