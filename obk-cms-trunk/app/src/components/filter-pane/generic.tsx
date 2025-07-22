import {
  Box,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  SimpleGrid,
  // Input,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import Input from '@components/input/text'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import omitBy from 'lodash/omitBy'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import defaultsDeep from 'lodash/defaultsDeep'
import InputDate from '@components/input/date'
import DropdownField from '@components/forms/components/dropdown-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'

const defaultFilter = {
  search: {
    value: '',
  },
  role: {
    value: '',
  },
  company: {
    value: '',
  },
  status: {
    value: '',
  },
}

export const GenericFilterPane = (props: any) => {
  const { onFilter, searchable = true, customFilter } = props
  const mergeFilter = customFilter && {
    ...Object.fromEntries(
      customFilter?.map((el: any) => [el.field, { value: '' }])
    ),
  }
  const initialFilter = {
    ...defaultFilter,
    ...mergeFilter,
  }
  const [filter, setFilter] = useState(initialFilter)
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
      query: { ...router?.query, ...dispatchFilterItems },
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
    setFilter((prev: any) => {
      const newValue = defaultsDeep({ [e.target.id]: { value } }, prev)
      dispatchFilter(newValue)
      return newValue
    })
  }

  const getFilter = (filters: any) => {
    switch (filters.type) {
      case 'date':
        return (
          <div key={filters.field}>
            <InputDate
              type='date'
              placeholder={filters.placeholder}
              onChange={onChange}
              name={filters.field}
            />
          </div>
        )
      default:
        return (
          <div key={filters.field}>
            <DropdownField
              placeholder={filters.placeholder}
              onChange={onChange}
              name={filters.field}
              optionLabel='name'
              optionValue='value'
              options={filters.options}
              className='tw-border tw-border-[#A3AED0] tw-flex-1 tw-mr-2 last:tw-mr-0'
            >
              {/* {filters.options.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
            </DropdownField>
          </div>
        )
    }
  }

  const formRef = useRef<FormControllerRef<any>>(null)

  return (
    <HStack
      spacing='12px'
      w='full'
      justifyContent='flex-end'
      className='generic-filters'
    >
      <FormController ref={formRef} defualtValue={{}} onSubmit={() => {}}>
        <SimpleGrid
          columns={customFilter?.length + (searchable ? 1 : 0)}
          spacingX='8px'
        >
          {searchable && (
            <div className='tw-flex tw-items-center'>
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
                  borderColor='#F4F7FE'
                  placeholder='Search name, email, company'
                  name='search'
                  bg='#F4F7FE'
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
                  value={filter.search.value}
                />
              </InputGroup>
            </div>
          )}
          {customFilter ? (
            customFilter.map((filters: any) => getFilter(filters))
          ) : (
            <>
              <Box>
                <Select placeholder='Role' onChange={onChange} name='role'>
                  <option>all</option>
                  <option>b</option>
                  <option>c</option>
                </Select>
              </Box>
              <Box>
                <Select
                  placeholder='Company'
                  onChange={onChange}
                  name='company'
                >
                  <option>all</option>
                  <option>b</option>
                  <option>c</option>
                </Select>
              </Box>
              <Box>
                <Select placeholder='Status' onChange={onChange} name='status'>
                  <option>all</option>
                  <option>b</option>
                  <option>c</option>
                </Select>
              </Box>
            </>
          )}
        </SimpleGrid>
      </FormController>
    </HStack>
  )
}

export default GenericFilterPane
