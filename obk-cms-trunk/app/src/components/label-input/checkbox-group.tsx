import { Stack, Box, CheckboxGroup } from '@chakra-ui/react'
import map from 'lodash/map'
import Checkbox from '@components/input/checkbox'

export default function InputCheckboxGroup(props: any) {
  const { label, items = [] } = props

  return (
    <Box>
      {label && (
        <Box color='astronaut' fontSize='14px' fontWeight={500}>
          {label}
        </Box>
      )}
      <Box pt='12px'>
        <CheckboxGroup>
          <Stack spacing={[1, 5]} direction={['column', 'row']}>
            {map(items, (item, key) => (
              <Checkbox key={key} value={item.value}>
                {item.label}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </Box>
    </Box>
  )
}
