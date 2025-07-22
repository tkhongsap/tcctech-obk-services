import { Box } from '@chakra-ui/react'

const SectionTitle = (props: any) => {
  const { children } = props
  return (
    <Box
      fontSize='34px'
      fontWeight={700}
      lineHeight='42px'
      px={{ _: '15px', md: 0 }}
      color='astronaut'
    >
      {children}
    </Box>
  )
}

export default SectionTitle
