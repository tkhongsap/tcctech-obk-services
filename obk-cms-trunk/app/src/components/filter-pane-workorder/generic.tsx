import {
  Box,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  // Input,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import Input from '@components/input/text'
import { useRouter } from 'next/router'
import { useState } from 'react'
import omitBy from 'lodash/omitBy'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import defaultsDeep from 'lodash/defaultsDeep'

const defaultFilter = {
  title: {
    value: '',
    operator: '_like',
  },
  type_of_issue: {
    value: '',
  },
  location: {
    value: '',
  },
}

export const GenericFilterPane = (props: any) => {
  const [filter, setFilter] = useState(defaultFilter)
  const { onFilter } = props
  const router = useRouter()

  const dispatchFilter = (filterItems: any) => {
    const validFilterItems = omitBy(filterItems, (value) => !value?.value)
    const dispatchFilterItems = reduce(
      validFilterItems,
      (result: any, filterValue: any, filterKey: any) => {
        const key = filterValue?.operator
          ? `${filterKey}${filterValue.operator}`
          : filterKey
        result[key] = filterValue?.value || ''
        return result
      },
      {}
    )

    router.push({
      pathname: router.pathname,
      query: dispatchFilterItems,
    })

    if (onFilter) {
      onFilter(
        map(validFilterItems, (item, key) => {
          return {
            field: item?.operator ? `${key}${item.operator}` : key,
            operator: 'eq',
            value: item.value,
          }
        })
      )
    }
  }

  const handleKeyDown = (e: any) => {
    const code = e?.code || ''
    const value = e?.target?.value || ''
    if (code === 'Enter') {
      setFilter((prev: any) => {
        const newValue = defaultsDeep({ [e.target.name]: { value } }, prev)
        dispatchFilter(newValue)
        return newValue
      })
    }
  }

  const onChange = async (e: any) => {
    const value = e?.target?.value || ''
    setFilter((prev) => {
      // const newValue = { ...prev, [e.target.name]: { value } }
      const newValue = defaultsDeep({ [e.target.name]: { value } }, prev)
      dispatchFilter(newValue)
      return newValue
    })
  }
  return (
    <HStack spacing='12px'>
      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <Search2Icon color='gray.300' />
          </InputLeftElement>
          <Input
            pl='40px'
            size='md'
            borderRadius='8px'
            type='text'
            border='1px solid'
            borderColor='rockBlue'
            placeholder='ID,Title'
            name='title'
            onKeyDown={handleKeyDown}
            onChange={(e: any) => {
              setFilter((prev: any) => {
                const newValue = defaultsDeep(
                  { [e.target.name]: { value: e?.target?.value ?? '' } },
                  prev
                )
                return newValue
              })
            }}
            value={filter.title.value}
          />
        </InputGroup>
      </Box>

      <Box>
        <Select
          placeholder='Work order type'
          onChange={onChange}
          name='work_order_type'
        >
          <option>all</option>
          <option>b</option>
          <option>c</option>
        </Select>
      </Box>
      <Box>
        <Select placeholder='Location' onChange={onChange} name='location'>
          <option>all</option>
          <option>b</option>
          <option>c</option>
        </Select>
      </Box>
    </HStack>
  )
}

export default GenericFilterPane
