import { IInputErrors } from '@src/services/art-and-culture/model'

export const isStringEmpty = (str: string) => {
  return str === ''
}

export const mappingValidateErrorMessage = (
  initErrorValues: IInputErrors,
  validationResult: any
): IInputErrors => {
  const resultErrorValues = initErrorValues
  validationResult.forEach(
    async ({ path, message }: { path: string; message: string }) => {
      resultErrorValues[path] = { status: true, message }
    }
  )

  return resultErrorValues
}

export const isObjectDeepEqual = <T extends { [key: string]: any }>(
  object1: T,
  object2: T
) => {
  const objKeys1 = Object.keys(object1)
  const objKeys2 = Object.keys(object2)

  if (objKeys1.length !== objKeys2.length) return false

  for (var key of objKeys1) {
    const value1 = object1[key]
    const value2 = object2[key]

    const isObjects = isObject(value1) && isObject(value2)

    if (
      (isObjects && !isObjectDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false
    }
  }
  return true
}

export const isObject = <T extends { [key: string]: any }>(object: T) => {
  return object != null && typeof object === 'object'
}
