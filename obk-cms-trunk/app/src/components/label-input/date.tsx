import { Box } from '@chakra-ui/react'
import Date from '@components/input/date'
import { ChangeEvent } from 'react'

export default function InputDate(props: any) {
  const { label, onChange, register = {} } = props
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value)
  }

  return (
    <Box>
      <Box color='astronaut' fontSize='14px' fontWeight={500}>
        {label}
      </Box>
      <Box pt='12px'>
        <Date onChange={handleOnchange} register={register} {...props} />
      </Box>
    </Box>
  )
}
