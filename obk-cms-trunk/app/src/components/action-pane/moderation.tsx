import { Box, Button } from '@chakra-ui/react'

export default function ModerationPane() {
  const onSubmit = () => console.log('onSubmit')
  const onDraft = () => console.log('onDraft')
  const onCancel = () => console.log('onCancel')
  return (
    <Box display='flex' alignItems='center'>
      <Box pr='24px'>
        <Button
          bg='primaryBlue'
          color='white'
          variant='brand'
          onClick={onSubmit}
        >
          Submit for Approval
        </Button>
      </Box>

      <Box px='24px'>
        <Button
          color='primaryBlue'
          variant='outline'
          colorScheme='primaryBlue'
          onClick={onDraft}
        >
          Save Draft
        </Button>
      </Box>

      <Box pl='24px'>
        <Button variant='link' color='primaryBlue' onClick={onCancel}>
          Cancel changes
        </Button>
      </Box>
    </Box>
  )
}
