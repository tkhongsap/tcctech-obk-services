import { Input } from '@chakra-ui/react'

export default function InputText(props: any) {
  const { register = {}, bg = 'white', error = false } = props
  return (
    <Input
      size='md'
      borderRadius='8px'
      type='text'
      border='1px solid'
      borderColor={error ? '#CD1A1A' : 'rockBlue'}
      bg={bg}
      {...props}
      {...register}
    />
  )
}
