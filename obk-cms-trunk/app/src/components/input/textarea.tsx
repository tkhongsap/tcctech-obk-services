import { Textarea } from '@chakra-ui/react'

export default function InputTextarea(props: any) {
  const { register = {}, bg } = props
  return (
    <Textarea
      size='md'
      borderRadius='8px'
      borderColor='rockBlue'
      rows={5}
      bg={bg}
      {...register}
      {...props}
    />
  )
}
