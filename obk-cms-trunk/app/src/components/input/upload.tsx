import { ReactNode, useRef } from 'react'
import { Box, InputGroup, HStack, Center } from '@chakra-ui/react'
import { useForm, UseFormRegisterReturn } from 'react-hook-form'
import SvgUpload from '@assets/svg/upload.svg'
import SvgClose from '@assets/svg/close.svg'
import map from 'lodash/map'

type FileUploadProps = {
  register: UseFormRegisterReturn
  accept?: string
  multiple?: boolean
  children?: ReactNode
}

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, multiple, children } = props
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...rest } = register as any

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={'file'}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e)
          inputRef.current = e
        }}
      />
      <>{children}</>
    </InputGroup>
  )
}

type FormValues = {
  file_: FileList
}

export default function InputUpload() {
  const { register } = useForm<FormValues>()

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return 'Files is required'
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024)
      const MAX_FILE_SIZE = 10
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb'
      }
    }
    return true
  }

  const preview = true

  return (
    <Box>
      {preview && (
        <Box pb='24px'>
          <HStack spacing='24px' flexWrap='wrap'>
            {map(new Array(4), (item, key) => {
              return (
                <Box
                  bg='black'
                  flex='0 0 calc(50% - 12px)'
                  height='200px'
                  position='relative'
                  key={`preview-${key}`}
                >
                  <Center
                    position='absolute'
                    top='12px'
                    right='12px'
                    cursor='pointer'
                    w='36px'
                    h='36px'
                    bg='white'
                    borderRadius='100%'
                  >
                    <SvgClose />
                  </Center>
                </Box>
              )
            })}
          </HStack>
        </Box>
      )}
      <FileUpload
        accept={'image/*'}
        multiple
        register={register('file_', { validate: validateFiles })}
      >
        <HStack
          color='primaryBlue'
          border='1px solid'
          borderColor='primaryBlue'
          borderRadius='8px'
          py='12px'
          width='100%'
          justifyContent='center'
          spacing='10px'
          fontSize='14px'
          fontWeight={500}
          lineHeight='24px'
          alignItems='center'
        >
          <Box>
            <SvgUpload />
          </Box>
          <Box>Upload image</Box>
        </HStack>
      </FileUpload>
    </Box>
  )
}
