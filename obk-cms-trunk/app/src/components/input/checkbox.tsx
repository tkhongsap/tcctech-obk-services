import { Checkbox, Box } from '@chakra-ui/react'
import CheckboxIcon from './checkbox-icon'
import styled from 'styled-components'

const StyledContainer = styled(Box)`
  .chakra-checkbox__control {
    color: none !important;
    background: none !important;
    border: none !important;
    width: 25px;
    height: 25px;
  }

  checkbox {
    border: none !important;
  }
`

export default function InputCheckbox(props: any) {
  const { register = {} } = props
  return (
    <StyledContainer>
      <Checkbox
        alignItems='flex-start'
        icon={<CheckboxIcon />}
        {...register}
        {...props}
      >
        {props?.children}
      </Checkbox>
    </StyledContainer>
  )
}
