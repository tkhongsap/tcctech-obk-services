import { Box } from '@chakra-ui/react'

const StyledB2 = (props: any) => {
  const { children, as } = props
  let predefinedProps = {}
  switch (as) {
    case 'medium':
      predefinedProps = {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '-0.01em',
      }
      break
    case 'bold':
      predefinedProps = {
        fontSize: '14px',
        fontWeight: 700,
        lineHeight: '24px',
        letterSpacing: '-0.01em',
      }
      break
    default:
      predefinedProps = {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '-0.01em',
      }
      break
  }

  return (
    <Box {...predefinedProps} {...props}>
      {children}
    </Box>
  )
}

export default StyledB2
