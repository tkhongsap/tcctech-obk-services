import { Box } from '@chakra-ui/react'

const SectionBlock = (props: any) => {
  const { children } = props
  const defaultStyles = {
    background: 'alabaster',
    borderRadius: '10px',
    padding: '40px',
    w: '100%',
  }
  return (
    <Box {...defaultStyles} {...props}>
      {children}
    </Box>
  )
}

export default SectionBlock
