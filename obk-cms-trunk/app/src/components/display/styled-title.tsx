import { Box } from '@chakra-ui/react'
import styled from 'styled-components'

const StyledElement = styled(Box)`
  color: ${(props) => props.theme.colors.biscay};
  font-size: 34px;
  font-weight: 700;
  line-height: 42px;
`

const StyledTitle = (props: any) => {
  const { children } = props
  return <StyledElement>{children}</StyledElement>
}

export default StyledTitle
