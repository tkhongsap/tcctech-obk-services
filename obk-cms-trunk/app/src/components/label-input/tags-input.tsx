import React, { useRef } from 'react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteTag,
  AutoCompleteList,
  AutoCompleteItem,
  AutoCompleteCreatable,
} from '@choc-ui/chakra-autocomplete'
import { InputGroup, InputLeftElement, Stack } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import styled from 'styled-components'
import { useState } from 'react'
import map from 'lodash/map'
import trim from 'lodash/trim'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import find from 'lodash/find'

const StyledInputGroup = styled(InputGroup)`
  .chakra-wrap {
    border: 1px solid ${(props) => props.theme.colors.rockBlue};
  }
`

const StyledAutoCompleteInput = styled(AutoCompleteInput)`
  input {
    padding-left: 0;
  }
`

export default function TagInput(props: any) {
  const {
    options = [],
    hasIcon = true,
    creatable = true,
    multiple = true,
    setFilteredOptions,
  } = props
  const ref = useRef() as any
  const [localTags, setLocalTags] = useState([]) as any
  const bg = 'white'
  const onRemove = (val: string) => {
    ref.current?.removeItem(val)
  }

  const onChange = (vals: any) => {
    const newTags = map(
      compact(vals.map((val: string) => trim(val))),
      (val: any) => ({
        label: val,
        onRemove: () => onRemove(val),
      })
    )
    setLocalTags(newTags)
    if (setFilteredOptions) setFilteredOptions(newTags)
  }
  return (
    <Stack direction='column'>
      <AutoComplete
        multiple={multiple}
        rollNavigation
        openOnFocus
        creatable={creatable}
        onChange={onChange}
        ref={ref}
      >
        <StyledInputGroup>
          {hasIcon && (
            <InputLeftElement
              pointerEvents='none'
              color='inherit'
              fontSize='1.2em'
              height='calc(var(--input-height) - 3px)'
            >
              <Search2Icon width='12px' />
            </InputLeftElement>
          )}
          <StyledAutoCompleteInput
            variant='filled'
            placeholder='Search'
            bg={bg}
            _hover={{ bg }}
            fontSize='15px'
            lineHeight='22px'
            {...(hasIcon && { pl: '40px' })}
          >
            {map(localTags, (tag: any, tid) => (
              <AutoCompleteTag
                bg='selago'
                color='primaryBlue'
                key={tid}
                label={tag.label}
                onRemove={tag.onRemove}
                disabled={tag.label === 'japan'}
              />
            ))}
          </StyledAutoCompleteInput>
        </StyledInputGroup>

        <AutoCompleteList>
          {map(
            filter(
              options,
              (option) => !find(localTags, (tag) => tag.label === option)
            ),
            (option: any, oid: number) => (
              <AutoCompleteItem
                key={`option-${oid}`}
                value={option}
                textTransform='capitalize'
              >
                {option}
              </AutoCompleteItem>
            )
          )}
          {creatable && <AutoCompleteCreatable />}
        </AutoCompleteList>
      </AutoComplete>
    </Stack>
  )
}
