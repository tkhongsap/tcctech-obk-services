import { RegisterOptions } from 'react-hook-form'

export interface IFieldInput {
  name: string
  label?: string
  placeholder?: string
  disabled?: boolean
  /**
   * @remarks
   * Default required label relate to rules.required
   */
  showRequiredLabel?: boolean
  rules?:
    | Omit<
        RegisterOptions<any, 'fromFeeedbackId'>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined
  helperText?: string
}
