import { Box } from '@chakra-ui/react'

const StyledC1 = (props: any) => {
  const { children, as } = props
  let predefinedProps = {}
  switch (as) {
    case 'medium':
      predefinedProps = {
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '16px',
      }
      break
    default:
      predefinedProps = {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
      }
      break
  }

  return (
    <Box {...predefinedProps} {...props}>
      {children}
    </Box>
  )
}

export default StyledC1
