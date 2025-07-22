import { Box } from '@chakra-ui/react'
import InputTextarea from '@components/label-input/textarea'
import { useFormContext } from 'react-hook-form'

export default function ParagraphBlock(props: any) {
  const { dataKey } = props
  const formCtx = useFormContext()
  const { register } = formCtx
  // const onChange = (value: string) => {
  //   formCtx.setValue(dataKey, value)
  // }

  return (
    <Box>
      <InputTextarea
        {...props}
        label='Paragraph'
        register={register(`${dataKey}.content`)}
        // onChange={onChange}
      />
    </Box>
  )
}
