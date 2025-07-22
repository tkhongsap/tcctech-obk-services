import { Select } from '@chakra-ui/react'

export default function InputSelect(props: any) {
  const { register = {}, bg = 'white', isInvalid, error } = props
  return (
    <Select
      bg={bg}
      borderColor={error ? '#CD1A1A' : 'rockBlue'}
      {...props}
      {...register}
      isInvalid={isInvalid}
    >
      {props.children}
    </Select>
  )
}
