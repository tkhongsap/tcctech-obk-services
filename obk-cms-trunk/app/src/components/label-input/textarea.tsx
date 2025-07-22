import { Box } from '@chakra-ui/react'
import Textarea from '@components/input/textarea'

export default function InputTextarea(props: any) {
  const { label, onChange, register = {}, bg = 'white' } = props
  const handleOnchange = (e: any) => {
    if (onChange) onChange(e.target.value)
  }

  return (
    <Box>
      <Box color='astronaut' fontSize='14px' fontWeight={500}>
        {label}
      </Box>
      <Box pt='12px'>
        <Textarea register={register} onChange={handleOnchange} bg={bg} />
      </Box>
    </Box>
  )
}
