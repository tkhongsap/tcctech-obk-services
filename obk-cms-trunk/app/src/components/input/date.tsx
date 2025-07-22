import { Input } from '@chakra-ui/react'

export default function InputDate(props: any) {
  const { register, error, type = 'datetime-local' } = props
  return (
    <Input
      size='md'
      borderRadius='8px'
      type={type}
      border='1px solid'
      borderColor={error ? '#CD1A1A' : '#E2E8F0'}
      {...register}
      {...props}
    />
  )
}
