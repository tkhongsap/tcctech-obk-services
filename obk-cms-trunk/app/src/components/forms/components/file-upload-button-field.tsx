import LabelField from '@components/forms/utils/label-field'
import { classNames } from 'primereact/utils'
import React, { useRef } from 'react'
import { Controller, ControllerRenderProps, FieldValues } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { Button } from 'primereact/button'
import SvgUpload from '@assets/svg/upload.svg'

type Props = IFieldInput & {
  acceptTypes?: string
  fileLength?: number
  onError?(err: { title: string; message: string }): void
} & SigleFile

type SigleFile = {
  mode?: 'single'
  outputType: 'file'
  onChange?(e: any): void
}

const FieldUploadButtonField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    mode = 'single',
    acceptTypes,
    onChange,
    // onError,
    disabled,
  } = props
  const inputFileRef = useRef<HTMLInputElement>(null)

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    if (e.target.files) {
      if (mode === 'single') {
        const file = e
        onChange && onChange(file as any)
        field.onChange(file)
      } else {
        onChange && onChange(e.target as any)
        field.onChange(e.target)
      }
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ ...rules }}
      render={({ field, fieldState, formState }) => (
        <LabelField htmlFor={field.name} label={label}>
          <Button
            disabled={disabled}
            type='button'
            className='w-full'
            severity={fieldState.error ? 'danger' : undefined}
            outlined
          >
            <div
              className={classNames(
                'flex justify-content-center w-full align-items-center gap-2',
                {
                  'text-danger': fieldState.error,
                }
              )}
              onClick={() => inputFileRef.current!.click()}
            >
              <SvgUpload /> <span>Upload file</span>
            </div>
          </Button>
          <input
            disabled={disabled}
            type='file'
            ref={inputFileRef}
            accept={acceptTypes}
            hidden={true}
            onChange={(e) => onFileChange(e, field)}
          />
          {getFormErrorMessage(field.name, formState.errors)}
        </LabelField>
      )}
    />
  )
}

export default FieldUploadButtonField
