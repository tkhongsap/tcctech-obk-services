'use client'

import { Box, VStack } from '@chakra-ui/react'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { DndProvider } from 'react-dnd'
import DndWrapper from '../../content-builder/dnd-wrapper'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useCallback } from 'react'
import InputText from '@components/label-input/text'
import Heading from '@components/typography/heading'
import RoundedButton from '@components/button/rounded'

import { useFormContext, useFieldArray, FormProvider } from 'react-hook-form'
import { LOCALE_KEY } from '@src/data/constants/locale'
import RichText from '@components/input/rich-text'
import LikePanel from '@components/likePanel'
import SvgHamburger from '@assets/svg/hamburger.svg'
import SvgClose from '@assets/svg/close.svg'

export default function ContentList(props: any) {
  const { dataKey, locale, addabled = true, minimized = false } = props

  const formData = useFormContext()
  const { control, register, setValue, watch } = formData
  const { fields, append, swap, remove } = useFieldArray({
    name: dataKey,
    control,
  })

  // make sure at least one question
  if (isEmpty(fields)) append({})

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      swap(hoverIndex, dragIndex)
    },
    [swap]
  )

  const blockList = map(fields, (item: any, key: number) => {
    const removeBlock = () => {
      remove(key)
    }

    register(`${dataKey}.${key}.answer`)

    const onEditAnswer = (editorState: any) => {
      setValue(`${dataKey}.${key}.answer`, editorState)
    }

    const answerValue = watch(`${dataKey}.${key}.answer`)

    return (
      <DndWrapper
        key={item.id}
        index={key}
        id={key}
        moveCard={moveCard}
        padding={minimized ? '0px' : '24px'}
        border='none'
        bg={minimized ? 'transparent' : '#F6F6F6'}
      >
        <div className='tw-flex tw-space-x-6'>
          {fields.length > 1 && <SvgHamburger className='mt-2' />}
          <Box w='100%'>
            {!minimized && (
              <>
                <Heading as='h3' color='astronaut' mb='24px'>
                  Question {key + 1}
                </Heading>
                <LikePanel like={0} dislike={0} />
              </>
            )}

            <VStack w='100%' spacing='22px' pt={minimized ? '0px' : '24px'}>
              {!minimized && (
                <Box w='100%'>
                  <InputText
                    label={`Question (${
                      LOCALE_KEY[locale as keyof typeof LOCALE_KEY]
                    })`}
                    register={register(`${dataKey}.${key}.question`)}
                    bg='transparent'
                  />
                </Box>
              )}

              <Box w='100%'>
                {typeof document !== 'undefined' && (
                  <RichText
                    className='custome-editor'
                    label={
                      minimized
                        ? ''
                        : `Answer (${
                            LOCALE_KEY[locale as keyof typeof LOCALE_KEY]
                          })`
                    }
                    value={answerValue}
                    onChange={onEditAnswer}
                    theme='snow'
                  />
                )}
              </Box>
            </VStack>
          </Box>
          {fields.length > 1 && (
            <SvgClose
              className='tw-mt-2 tw-w-5 tw-h-5 svg-fill-red tw-cursor-pointer'
              onClick={removeBlock}
            />
          )}
        </div>
      </DndWrapper>
    )
  })

  const onCreateBlock = () => {
    append({})
  }

  return (
    <FormProvider {...formData}>
      <VStack w='100%' spacing='32px' alignItems='flex-start'>
        <DndProvider backend={HTML5Backend}>
          <VStack spacing='32px' w='100%'>
            {blockList}
          </VStack>
        </DndProvider>
        {addabled && (
          <Box w='100%'>
            <RoundedButton
              color='primaryBlue'
              bg='transaprent'
              border='1px solid'
              onClick={onCreateBlock}
              w='100%'
            >
              + Add new question
            </RoundedButton>
          </Box>
        )}
      </VStack>
    </FormProvider>
  )
}
