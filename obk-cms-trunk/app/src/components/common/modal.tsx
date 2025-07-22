import { Box, ModalOverlay, ModalContent } from '@chakra-ui/react'

export default function GenericModal(props: any) {
  const { children } = props
  return (
    <Box>
      <ModalOverlay />
      <ModalContent borderRadius='20px' maxWidth='80vw' width='auto'>
        {children}
      </ModalContent>
    </Box>
  )
}
