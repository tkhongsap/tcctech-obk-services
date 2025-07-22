import { Box, VStack, Flex } from '@chakra-ui/react'
import map from 'lodash/map'
import find from 'lodash/find'
import ParagraphBlock from './paragraph'
import LinkBlock from './link'
import ImageBlock from './image'
import VideoBlock from './video'
import InputSelect from '@components/label-input/select'
import SvgDragIcon from '@assets/svg/drag-icon.svg'
import SvgCloseIcon from '@assets/svg/close.svg'
import { DndProvider } from 'react-dnd'
import DndWrapper from './dnd-wrapper'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useCallback } from 'react'

import { useFormContext, useFieldArray, FormProvider } from 'react-hook-form'

const types = [
  {
    label: 'Paragraph',
    type: 'paragraph',
    component: ParagraphBlock,
  },
  {
    label: 'Hyperlink',
    type: 'link',
    component: LinkBlock,
  },
  {
    label: 'Image',
    type: 'image',
    component: ImageBlock,
  },
  {
    label: 'Video',
    type: 'video',
    component: VideoBlock,
  },
]

export default function ContentList(props: any) {
  const { dataKey } = props

  const formData = useFormContext()
  const { control } = formData
  const { fields, append, swap, remove, update } = useFieldArray({
    name: dataKey,
    control,
  })

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      swap(hoverIndex, dragIndex)
    },
    [swap]
  )

  const blockList = map(fields, (item: any, key: number) => {
    const type = find(types, { type: item?.type })
    const BlockComponent = type?.component as any
    const removeBlock = () => {
      remove(key)
    }
    return (
      <DndWrapper key={item.id} index={key} id={key} moveCard={moveCard}>
        <Flex
          key={key}
          bg='selago'
          width='100%'
          p='20px 16px'
          alignItems='top'
          w='100%'
          justifyContent='space-between'
        >
          <Box>
            <SvgDragIcon />
          </Box>

          <Box flex={1} px='20px'>
            <Box
              fontSize='16px'
              fontWeight={700}
              lineHeight='100%'
              color='bayofMany'
            >
              Block {key + 2}
            </Box>
            <Box pt='16px'>
              <InputSelect
                label='Basic block'
                items={map(types, (type) => ({
                  label: type.label,
                  value: type.type,
                }))}
                placeholder={undefined}
                defaultValue={item?.type}
                onChange={(e: any) => {
                  // const newBlockItems = cloneDeep(blockItems)
                  // newBlockItems[key].type = e.target.value
                  // setBlockItems(newBlockItems)
                  update(key, {
                    type: e.target.value,
                  })
                }}
              />
            </Box>
            <Box pt='16px'>
              <BlockComponent dataKey={`${dataKey}.[${key}]`} />
            </Box>
          </Box>

          <Box onClick={removeBlock}>
            <SvgCloseIcon />
          </Box>
        </Flex>
      </DndWrapper>
    )
  })

  const onCreateBlock = () => {
    append({
      type: 'paragraph',
    })
  }

  return (
    <FormProvider {...formData}>
      <Box>
        {/* {JSON.stringify(blockItems)} */}
        <DndProvider backend={HTML5Backend}>
          <VStack spacing='32px'>{blockList}</VStack>
        </DndProvider>
        <Box fontSize='14px' fontWeight={500} lineHeight='24px' pt='32px'>
          <Box
            color='primaryBlue'
            py='12px'
            border='1px solid'
            borderColor='primaryBlue'
            textAlign='center'
            cursor='pointer'
            borderRadius='8px'
            onClick={onCreateBlock}
          >
            + Add a block
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}
