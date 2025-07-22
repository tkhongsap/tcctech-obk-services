import { Box } from '@chakra-ui/react'

const DisplayLabelValue = (props: any) => {
  const { label, children, pt = '8px', titleSm = false, colorLabel } = props
  return (
    <Box fontSize='16px' lineHeight='26px' color='codGray2' w='100%'>
      <Box
        fontWeight={700}
        color={colorLabel ?? 'bayofMany'}
        fontSize={titleSm ? '14px' : '16px'}
      >
        {label}
      </Box>
      <Box pt={pt}>{children}</Box>
    </Box>
  )
}

export default DisplayLabelValue
