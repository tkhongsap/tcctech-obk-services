import { Box } from '@chakra-ui/react'
import styled from 'styled-components'

const StyledElement = styled(Box)`
  color: ${(props) => props.theme.colors.biscay};
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

const StyledSubtitle = (props: any) => {
  const { children } = props
  return <StyledElement {...props}>{children}</StyledElement>
}

export default StyledSubtitle
