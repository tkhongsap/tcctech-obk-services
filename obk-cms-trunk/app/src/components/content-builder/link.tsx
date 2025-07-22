import { Box } from '@chakra-ui/react'
import InputText from '@components/label-input/text'
import { useFormContext } from 'react-hook-form'

export default function LinkBlock(props: any) {
  const { dataKey } = props
  const formCtx = useFormContext()
  const { register } = formCtx
  return (
    <Box>
      <Box>
        <InputText
          {...props}
          label='Message'
          register={register(`${dataKey}.message`)}
        />
      </Box>
      <Box pt='16px'>
        <InputText
          {...props}
          label='Link URL'
          register={register(`${dataKey}.link`)}
        />
      </Box>
    </Box>
  )
}
