import { Box } from '@chakra-ui/react'
import styled from 'styled-components'

const StyledElement = styled(Box)`
  color: ${(props) => props.theme.colors.kimberly};
  font-size: 12px;
  line-height: 16px;
`

const StyledRemark = (props: any) => {
  const { children } = props
  return <StyledElement {...props}>{children}</StyledElement>
}

export default StyledRemark
