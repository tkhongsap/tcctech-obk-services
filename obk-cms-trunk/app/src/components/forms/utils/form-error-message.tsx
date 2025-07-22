import { FieldErrors } from 'react-hook-form'

export const getFormErrorMessage = (name: string, errors: FieldErrors<any>) => {
  const getMessage = () => {
    let obj: any = errors
    name.split('.').forEach((key) => {
      if (obj) {
        obj = obj[key]
      }
    })
    return obj?.message
  }

  return getMessage() ? (
    <small className='p-error'> {getMessage()}</small>
  ) : (
    <small className='p-error hidden'>&nbsp;</small>
  )
}
