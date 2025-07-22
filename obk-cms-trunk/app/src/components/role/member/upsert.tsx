import {
  Box,
  HStack,
  // Checkbox,
  CheckboxGroup,
  Stack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import InputText from '@components/label-input/text'
import InputSelect from '@components/label-input/select'
import UpsertPane from '@components/action-pane/upsert'
import LabelValue from '@components/forms/utils/label-field'
import TagInput from '@components/label-input/tags-input'
import SectionBlock from '@components/display/section-block'
import { FormProvider } from 'react-hook-form'
import Heading from '@components/typography/heading'
import Checkbox from '@components/input/checkbox'
import { useResource } from '@refinedev/core'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import { useState } from 'react'

const permissionChildItems = [
  {
    label: 'Super Admin',
    value: 'Super Admin',
  },
  {
    label: 'General Admin',
    value: 'General Admin',
  },
  {
    label: 'Opperation Admin',
    value: 'Opperation Admin',
  },
  {
    label: 'General Staff',
    value: 'General Staff',
  },
]

const permissionItems = [
  {
    label: 'General Operation',
    key: 'generalOperation',
    items: permissionChildItems,
  },
  {
    label: 'Art and Culture',
    key: 'artCulture',
    items: permissionChildItems,
  },
  {
    label: 'Retail',
    key: 'retail',
    items: permissionChildItems,
  },
  {
    label: 'Retail2',
    key: 'retail2',
    items: permissionChildItems,
  },
]

const MemberUpsert = (props: any) => {
  const { form } = props
  const resources = useResource()
  const [filteredOptions, setFilteredOptions] = useState([])
  const showAll = filteredOptions.length === 0
  const mode = resources?.id ? 'edit' : 'create'
  const ActionUpsertPane = () => {
    let submitLabel
    const deleteLabel = 'Remove member'
    if (mode === 'create') {
      submitLabel = 'Assign member'
    }
    if (mode === 'edit') {
      submitLabel = 'Save changes'
    }

    return (
      <UpsertPane submitLabel={submitLabel || ''} deleteLabel={deleteLabel} />
    )
  }

  const filterOptions = map(permissionItems, (item) => item.label)

  const permissionList = map(
    filter(
      permissionItems,
      (item: any) =>
        showAll ||
        find(filteredOptions, (_item: any) => _item.label === item.label)
    ),
    (item: any) => {
      return (
        <Box key={item.key}>
          <LabelValue label={item?.label}>
            <Box>
              <CheckboxGroup>
                <Stack>
                  {map(item?.items || [], (childItem, key) => {
                    return (
                      <Checkbox
                        value={childItem.value}
                        key={`${item.key}-${key}`}
                      >
                        {childItem.label}
                      </Checkbox>
                    )
                  })}
                </Stack>
              </CheckboxGroup>
            </Box>
          </LabelValue>
        </Box>
      )
    }
  )

  return (
    <Box>
      <FormProvider {...form}>
        <Box justifyContent='space-between' display={{ md: 'flex' }}>
          <Box flex={1}>
            <SectionBlock>
              <Box
                fontSize='14px'
                fontWeight={500}
                lineHeight='24px'
                color='astronaut'
              >
                <HStack justifyContent='space-between' alignItems='center'>
                  <Heading as='h3' color='biscay'>
                    Details
                  </Heading>
                  <ActionUpsertPane />
                </HStack>
                <VStack spacing='32px' w='100%' alignItems='flex-start'>
                  <SimpleGrid spacing='24px' columns={3} w='100%'>
                    <Box>
                      <InputText label='Assigned ID' />
                    </Box>

                    <Box>
                      <InputSelect label='Status' />
                    </Box>
                  </SimpleGrid>

                  <SimpleGrid spacing='24px' columns={3} w='100%'>
                    <Box>
                      <InputText label="Member's Email" />
                    </Box>
                    <Box>
                      <InputText label="Member's ID" />
                    </Box>
                    <Box>
                      <InputText label="Member's Name" />
                    </Box>
                  </SimpleGrid>

                  <Box w='100%'>
                    <Heading as='h3'>Assigned Role</Heading>
                    <Box pt='22px'>
                      <TagInput
                        options={filterOptions}
                        creatable={false}
                        setFilteredOptions={setFilteredOptions}
                      />
                    </Box>
                  </Box>
                </VStack>

                <Box pt='24px'>
                  <SimpleGrid
                    columns={3}
                    spacing='24px'
                    alignItems='flex-start'
                    flexWrap='wrap'
                  >
                    {permissionList}
                  </SimpleGrid>
                </Box>
              </Box>
            </SectionBlock>
          </Box>
        </Box>
      </FormProvider>

      <Box pt='24px'>
        <ActionUpsertPane />
      </Box>
    </Box>
  )
}

export default MemberUpsert
