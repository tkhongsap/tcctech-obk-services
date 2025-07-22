import { Box, Modal, HStack } from '@chakra-ui/react'
import RoundedButton from '@components/button/rounded'
import Heading from '@components/typography/heading'
import GenericModal from '@components/common/modal'
import { useState } from 'react'
import { useNavigation, useResource } from '@refinedev/core'
import includes from 'lodash/includes'

export default function UpsertPane(props: any) {
  const resources = useResource()
  const { id } = resources
  const { list } = useNavigation()
  const {
    submitLabel,
    deleteLabel = 'Delete',
    cancelLabel = 'Cancel changes',
    submitMsg = 'Are you sure you want to publish changes?',
    deleteMsg = 'Are you sure you want to delete this?',
    types = ['submit', 'delete', 'cancel'],
    onSubmit,
    onCancel,
    onDelete,
    onCancelChanges = () => list(resources?.identifier || ''),
  } = props
  const handleSubmit = async () => {
    if (onSubmit) onSubmit()
    toggleConfirmModal()
  }
  const handleClose = async () => {
    if (onCancel) onCancel()
    toggleConfirmModal()
  }

  const handleDelete = async () => {
    if (onDelete) await onDelete()
    toggleConfirmModal()
  }

  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
  })

  const toggleConfirmModal = (type = '') => {
    setModal((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      type,
    }))
  }

  return (
    <Box>
      <HStack spacing='20px'>
        {includes(types, 'submit') && (
          <RoundedButton
            bg='primaryBlue'
            color='white'
            hoverOpacity={1}
            onClick={() => toggleConfirmModal('publish')}
          >
            {submitLabel
              ? submitLabel
              : id
              ? 'Update'
              : `Create New ${resources?.resource?.meta?.label}`}
          </RoundedButton>
        )}

        {includes(types, 'delete') && id && (
          <RoundedButton
            bg='transparent'
            color='thunderbird'
            border='1px solid'
            borderColor='thunderbird'
            hoverOpacity={0}
            onClick={() => toggleConfirmModal('delete')}
          >
            {deleteLabel}
          </RoundedButton>
        )}
        {includes(types, 'cancel') && (
          <Box
            bg='transparent'
            color='primaryBlue'
            cursor='pointer'
            onClick={onCancelChanges}
          >
            {cancelLabel}
          </Box>
        )}
      </HStack>

      <Modal isOpen={modal?.isOpen} onClose={toggleConfirmModal} isCentered>
        <GenericModal>
          <div className='tw-p-[32px]'>
            {modal?.type === 'publish' && (
              <Box>
                <Heading as='h3' color='astronaut'>
                  {submitMsg}
                </Heading>
                <HStack w='100%' pt='16px' spacing='8px' justifyContent='start'>
                  <RoundedButton
                    onClick={handleSubmit}
                    bg='primaryBlue'
                    color='white'
                    hoverOpacity={1}
                  >
                    Publish
                  </RoundedButton>
                  <RoundedButton
                    onClick={handleClose}
                    border='1px solid'
                    borderColor='primaryBlue'
                    bg='white'
                    color='primaryBlue'
                  >
                    Cancel
                  </RoundedButton>
                </HStack>
              </Box>
            )}
            {modal?.type === 'delete' && (
              <Box>
                <Heading as='h3' color='astronaut'>
                  {deleteMsg}
                </Heading>
                <HStack w='100%' pt='16px' spacing='8px' justifyContent='start'>
                  <RoundedButton
                    onClick={handleDelete}
                    bg='thunderbird'
                    color='white'
                    hoverOpacity={1}
                  >
                    Delete
                  </RoundedButton>
                  <RoundedButton
                    onClick={handleClose}
                    border='1px solid'
                    borderColor='primaryBlue'
                    bg='white'
                    color='primaryBlue'
                  >
                    Cancel
                  </RoundedButton>
                </HStack>
              </Box>
            )}
          </div>
        </GenericModal>
      </Modal>
    </Box>
  )
}
