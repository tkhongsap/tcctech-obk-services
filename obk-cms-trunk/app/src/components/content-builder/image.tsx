import { Box } from '@chakra-ui/react'
import InputText from '@components/label-input/text'
import InputUpload from '@components/input/upload'
import { useFormContext } from 'react-hook-form'

export default function ImageBlock(props: any) {
  const { dataKey } = props
  const formCtx = useFormContext()
  const { register } = formCtx
  return (
    <Box>
      <Box>
        <InputText
          {...props}
          label='Image (Size recommend 16:9)'
          register={register(`${dataKey}.url`)}
        />
      </Box>
      <Box pt='24px'>
        <InputUpload />
      </Box>
    </Box>
  )
}
