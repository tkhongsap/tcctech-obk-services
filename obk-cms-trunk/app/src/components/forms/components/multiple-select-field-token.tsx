import { classNames } from 'primereact/utils'
import React from 'react'
import { Controller } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect'
import LabelField from '../utils/label-field'
import styled from 'styled-components'

type Props = IFieldInput & MultiSelectProps

const WrapperMultiSelect = styled.div`
  .p-multiselect-label {
    white-space: normal;
  }
  .p-multiselect-token {
    margin: 3px !important;
  }
  svg {
    top: 14px;
    right: 16px;
  }
  .p-multiselect-label-container {
    max-height: 200px;
    overflow: scroll;
  }
  .p-multiselect-panel {
    max-width: 600px;
  }
`

const MultipleSelectFieldToken = (props: Props) => {
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
  console.log('MultipleSelectFieldToken -->', name, control)
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
          <WrapperMultiSelect>
            <MultiSelect
              id={field.name}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.value)
                onChange && onChange(e)
              }}
              className={classNames(className, {
                'p-invalid': fieldState.error,
              })}
              {...rest}
            />
          </WrapperMultiSelect>
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default MultipleSelectFieldToken
