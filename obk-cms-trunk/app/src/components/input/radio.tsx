import { Radio, Box } from '@chakra-ui/react'
import styled from 'styled-components'

const StyledContainer = styled(Box)`
  .chakra-checkbox__control {
    color: none !important;
    background: none !important;
    border: none !important;
  }
`

export default function InputRadio(props: any) {
  const { register } = props
  return (
    <StyledContainer>
      <Radio {...register} {...props}>
        {props?.children}
      </Radio>
    </StyledContainer>
  )
}
