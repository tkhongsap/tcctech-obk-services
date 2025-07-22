import { Box } from '@chakra-ui/react'

const StyledB1 = (props: any) => {
  const { children, as } = props
  let predefinedProps = {}
  switch (as) {
    case 'medium':
      predefinedProps = {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '32px',
        letterSpacing: '-0.01em',
      }
      break
    case 'bold':
      predefinedProps = {
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: '32px',
        letterSpacing: '-0.01em',
      }
      break
    default:
      predefinedProps = {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '26px',
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

export default StyledB1
