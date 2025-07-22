import { Box } from '@chakra-ui/react'
import map from 'lodash/map'
import Select from '@components/input/select'

export default function InputSelect(props: any) {
  const {
    label,
    onChange,
    defaultValue,
    register = {},
    items = [
      {
        label: 'Option 1',
        value: 'option1',
      },
      {
        label: 'Option 2',
        value: 'option2',
      },
      {
        label: 'Option 3',
        value: 'option3',
      },
    ],
    error = false,
  } = props
  const handleOnchange = (e: any) => {
    if (onChange) onChange(e)
  }

  const listItems = map(items, (item) => (
    <option value={item.value} key={item.value}>
      {item.label}
    </option>
  ))

  return (
    <Box>
      <Box color='astronaut' fontSize='14px' fontWeight={500}>
        {label}
      </Box>
      <Box pt='12px'>
        <Select
          placeholder='Select option'
          defaultValue={defaultValue}
          onChange={handleOnchange}
          register={register}
          error={error}
          {...props}
        >
          {listItems}
        </Select>
      </Box>
    </Box>
  )
}
