import { Stack, Box, Radio, RadioGroup } from '@chakra-ui/react'
import map from 'lodash/map'

export default function InputRadioGroup(props: any) {
  const { label, items = [] } = props

  return (
    <Box>
      {label && (
        <Box color='astronaut' fontSize='14px' fontWeight={500}>
          {label}
        </Box>
      )}
      <Box pt='12px'>
        <RadioGroup value={'1'}>
          <Stack spacing={[1, 5]}>
            {map(items, (item, key) => (
              <Radio key={key} value={item.value} alignItems='flex-start'>
                <Box>{item.label}</Box>
                {item.description && (
                  <Box
                    pt='8px'
                    color='kimberly'
                    fontSize={14}
                    lineHeight='24px'
                  >
                    {item.description}
                  </Box>
                )}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
    </Box>
  )
}
