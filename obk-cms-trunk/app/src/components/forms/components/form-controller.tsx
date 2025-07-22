import { once } from 'lodash'
import React, {
  ForwardedRef,
  forwardRef,
  useContext,
  useImperativeHandle,
} from 'react'
import {
  DefaultValues,
  ErrorOption,
  FieldValues,
  FormState,
  Path,
  PathValue,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form'

type Props<T extends FieldValues> = {
  children: React.ReactNode
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  onSubmit: SubmitHandler<T>
  onInvalid?: SubmitErrorHandler<T> | undefined
  defualtValue: DefaultValues<T>
}

const createFormControllerContext = once(<T extends FieldValues>() =>
  React.createContext<UseFormReturn<T, any, undefined>>(null!)
)

export const useFormController = <T extends FieldValues>() =>
  useContext(createFormControllerContext<T>())

export type FormControllerRef<T extends FieldValues> = {
  reset: () => void
  clearErrors: (
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    name?:
      | `root.${string}`
      | 'root'
      | Path<T>
      | Path<T>[]
      | readonly Path<T>[]
      | undefined
  ) => void
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  setFocus: (name: Path<T>, options?: Partial<{}> | undefined) => void
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  setError: (
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    name: `root.${string}` | 'root' | Path<T>,
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    error: ErrorOption,
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    options?: { shouldFocus: boolean } | undefined
  ) => void
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  setValue: (
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    name: Path<T>,
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    value: PathValue<T, Path<T>>,
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    options?:
      | Partial<{
          shouldValidate: boolean
          shouldDirty: boolean
          shouldTouch: boolean
        }>
      | undefined
  ) => void
  getValues: () => T
  formState: FormState<T>
  trigger: (
    name?: Path<T> | Path<T>[] | readonly Path<T>[] | undefined,
    options?:
      | Partial<{
          shouldFocus: boolean
        }>
      | undefined
  ) => Promise<boolean>
  handleSubmit(
    onValid: SubmitHandler<T>,
    onInvalid?: SubmitErrorHandler<T> | undefined
  ): (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>
}

function FormControllerComponent<T extends FieldValues>(
  props: Props<T>,
  ref?: React.ForwardedRef<FormControllerRef<T>> | undefined
) {
  const { defualtValue, onSubmit, onInvalid, children } = props
  const defaultValues = defualtValue
  const form = useForm<T>({ defaultValues })

  const stateContext = createFormControllerContext<T>()

  useImperativeHandle(
    ref,
    () => {
      return {
        setValue(
          name: Path<T>,
          value: PathValue<T, Path<T>>,
          options?:
            | Partial<{
                shouldValidate: boolean
                shouldDirty: boolean
                shouldTouch: boolean
              }>
            | undefined
        ) {
          form.setValue(name, value, options)
        },
        reset() {
          form.reset()
        },
        clearErrors(
          name?:
            | `root.${string}`
            | 'root'
            | Path<T>
            | Path<T>[]
            | readonly Path<T>[]
            | undefined
        ) {
          form.clearErrors(name)
        },
        setFocus(name: Path<T>, options?: Partial<{}> | undefined) {
          form.setFocus(name, options)
        },
        setError(
          name: `root.${string}` | 'root' | Path<T>,
          error: ErrorOption,
          options?: { shouldFocus: boolean } | undefined
        ) {
          form.setError(name, error, options)
        },
        getValues: () => form.getValues(),
        formState: form.formState,
        trigger: (
          name?: Path<T> | Path<T>[] | readonly Path<T>[] | undefined,
          options?:
            | Partial<{
                shouldFocus: boolean
              }>
            | undefined
        ) => form.trigger(name, options),
        handleSubmit: (
          onValid: SubmitHandler<T>,
          onInvalid?: SubmitErrorHandler<T> | undefined
        ) => form.handleSubmit(onValid, onInvalid),
      }
    },
    [form]
  )

  return (
    <stateContext.Provider value={form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>{children}</form>
    </stateContext.Provider>
  )
}

const FormController = forwardRef(FormControllerComponent) as <
  T extends FieldValues
>(
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  props: Props<T> & { ref?: ForwardedRef<FormControllerRef<T>> }
) => ReturnType<typeof FormControllerComponent>

export { FormController }
