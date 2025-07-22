import { Box } from '@chakra-ui/react'
import InputText from '@components/label-input/text'
import { useFormContext } from 'react-hook-form'

export default function VideoBlock(props: any) {
  const { dataKey } = props
  const formCtx = useFormContext()
  const { register } = formCtx
  return (
    <Box>
      <Box>
        <InputText
          {...props}
          label='Title'
          register={register(`${dataKey}.title`)}
        />
      </Box>
      <Box pt='16px'>
        <InputText
          {...props}
          label='Video URL'
          register={register(`${dataKey}.url`)}
        />
      </Box>
    </Box>
  )
}
