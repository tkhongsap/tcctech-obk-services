import { Box } from '@chakra-ui/react'
import { rgba } from 'polished'

export default function InputTag(props: any) {
  const {
    color,
    children,
    bg,
    fontSize = '14px',
    fontWeight = 500,
    lineHeight = '24px',
    borderRadius = '8px',
    display = 'inline-block',
    letterSpacing = '-0.14px',
  } = props
  return (
    <Box
      fontSize={fontSize}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      display={display}
      letterSpacing={letterSpacing}
      color={color}
      borderRadius={borderRadius}
      bg={bg ? bg : rgba(color, 0.1)}
      whiteSpace='nowrap'
    >
      {children}
    </Box>
  )
}
