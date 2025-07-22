import { Box } from '@chakra-ui/react'
import Input from '@components/input/text'
import { ChangeEvent } from 'react'

export default function InputText(props: any) {
  const {
    label,
    onChange,
    value = '',
    register = {},
    bg,
    disabled,
    isInvalid,
    placeholder,
    error = false,
  } = props
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value)
  }

  return (
    <Box>
      <Box color='astronaut' fontSize='14px' fontWeight={500}>
        {label}
      </Box>
      <Box pt='12px'>
        <Input
          onChange={handleOnchange}
          defaultValue={value}
          register={register}
          bg={bg}
          disabled={disabled}
          isInvalid={isInvalid}
          placeholder={placeholder}
          error={error}
        />
      </Box>
    </Box>
  )
}
