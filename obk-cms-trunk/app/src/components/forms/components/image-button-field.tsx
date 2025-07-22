import LabelField from '@components/forms/utils/label-field'
import { classNames } from 'primereact/utils'
import React, { useRef } from 'react'
import { Controller, ControllerRenderProps, FieldValues } from 'react-hook-form'
import { getFormErrorMessage } from '../utils/form-error-message'
import { IFieldInput } from '../interfaces/field-input'
import { useFormController } from './form-controller'
import { Button } from 'primereact/button'
import SvgUpload from '@assets/svg/upload.svg'
import { convertToBase64 } from '@src/utils/image'

type Props = IFieldInput & {
  acceptTypes?: string
  fileLength?: number
  onError?(err: { title: string; message: string }): void
  title?: string
  messageWrongFile?: string
  inputRef?: React.Ref<HTMLInputElement>
} & (MultipleFiles | MultipleBase64 | SigleBase64 | SigleFile)

type SigleBase64 = {
  mode?: 'single'
  outputType: 'base64'
  onChange?(e: string | ArrayBuffer | null): void
}

type SigleFile = {
  mode?: 'single'
  outputType: 'file'
  onChange?(e: File): void
}

type MultipleBase64 = {
  mode?: 'multiple'
  outputType: 'file'
  onChange?(e: FileList): void
}

type MultipleFiles = {
  mode?: 'multiple'
  outputType: 'base64'
  onChange?(e: (string | ArrayBuffer | null)[]): void
}

const ImageButtonField = (props: Props) => {
  const { control } = useFormController()
  const {
    name,
    rules,
    label,
    mode = 'single',
    outputType,
    acceptTypes,
    fileLength = 5,
    onChange,
    onError,
    title = 'Upload image',
    messageWrongFile = 'please upload image .png .jpeg .jpg',
    inputRef,
  } = props
  const fallbackInputRef = useRef<HTMLInputElement>(null)
  const activeInputRef =
    (inputRef as React.MutableRefObject<HTMLInputElement>) || fallbackInputRef

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
    if (e.target.files) {
      for (let index = 0; index < e.target.files.length; index++) {
        const file = e.target.files[index]
        if (acceptTypes && !acceptTypes?.includes(file.type)) {
          onError &&
            onError({
              title: 'Wrong image file',
              message: messageWrongFile,
            })
          if (activeInputRef.current) {
            activeInputRef.current.value = ''
          }
          return
        }
      }

      if (outputType === 'base64') {
        const files = e.target.files
        const filesBase64: (string | ArrayBuffer | null)[] = []
        const filesPromise: Promise<string | ArrayBuffer | null>[] = []
        const length = files.length > fileLength ? fileLength : files.length
        for (let i = 0; i < length; i++) {
          filesPromise.push(convertToBase64(files[i]))
        }
        await Promise.all(filesPromise).then((base64Files) => {
          filesBase64.push(
            ...base64Files
              .filter((base64) => base64 != null)
              .map((base64) => base64!.toString())
          )
          if (mode === 'single') {
            onChange && onChange(filesBase64[0] as any)
            field.onChange(filesBase64[0])
          } else {
            onChange && onChange(filesBase64 as any)
            field.onChange(filesBase64)
          }
        })
      } else {
        if (mode === 'single') {
          const file = e.target.files[0]
          onChange && onChange(file as any)
          field.onChange(file)
        } else {
          onChange && onChange(e.target.files[0] as any)
          field.onChange(Array.from(e.target.files))
        }
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
              onClick={() => activeInputRef.current!.click()}
            >
              <SvgUpload /> <span>{title}</span>
            </div>
          </Button>
          <input
            type='file'
            multiple={mode === 'multiple'}
            ref={activeInputRef}
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

export default ImageButtonField
