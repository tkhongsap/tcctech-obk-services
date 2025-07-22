import { Box, HStack, VStack, Collapse } from '@chakra-ui/react'
import map from 'lodash/map'
import includes from 'lodash/includes'
import InputSelect from '@components/label-input/select'
import LabelValue from '@components/display/label-value'
import SvgArrowDown from '@assets/svg/arrow-down.svg'
import { useState } from 'react'
import SectionBlock from '@components/display/section-block'
import { FormProvider } from 'react-hook-form'
import Heading from '@components/typography/heading'
import UpsertPane from '@components/action-pane/upsert'
import TagInput from '@components/label-input/tags-input'
import InputCheckbox from '@components/input/checkbox'

const defaultOpen = false

const tmpChildItems = [
  {
    label: 'View A section',
    value: 'sectionA',
  },
  {
    label: 'View B section',
    value: 'sectionB',
  },
  {
    label: 'View C section',
    value: 'sectionC',
  },
  {
    label: 'View D section',
    value: 'sectionD',
  },
  {
    label: 'View E section',
    value: 'sectionE',
  },
]

const tmpItems = [
  {
    label: 'Home Content',
    key: 'homeContent',
    items: tmpChildItems,
    open: true,
  },
  {
    label: 'B Content',
    key: 'bContent',
    items: tmpChildItems,
    open: defaultOpen,
  },
  {
    label: 'C Content',
    key: 'cContent',
    items: tmpChildItems,
    open: defaultOpen,
  },
]

const RoleUpsert = (props: any) => {
  const { form } = props
  const { register, getValues, setValue, watch } = form
  watch(['privileges'])
  const privileges = getValues('privileges')
  const [privilegeItems, setPrivilegeItems] = useState(tmpItems)
  const ActionUpsertPane = () => <UpsertPane types={['submit', 'cancel']} />
  const list = map(privilegeItems, (item, key) => {
    const open = item?.open
    const handleOpen = () => {
      setPrivilegeItems((prev: any) => {
        prev[key].open = !prev[key].open
        return prev
      })
    }

    const checkAll = (e: any) => {
      const { checked } = e.target
      setValue(
        `privileges.${item.key}`,
        checked ? map(item?.items || [], (childItem) => childItem.value) : []
      )
      if (checked && !open) handleOpen()
    }

    const scopes = privileges?.[item.key] || []
    const isIndeterminate =
      scopes.length > 0 && scopes.length < item?.items?.length

    return (
      <Box key={item.key} w='100%'>
        <HStack justifyContent='space-between'>
          <HStack onClick={handleOpen} cursor='pointer'>
            <Box>
              <SvgArrowDown />
            </Box>
            <Box pl='10px' fontWeight={700}>
              {item.label}
            </Box>
          </HStack>
          <Box>
            <InputCheckbox
              onChange={checkAll}
              isIndeterminate={isIndeterminate}
            >
              Select All
            </InputCheckbox>
          </Box>
        </HStack>
        <Collapse in={open}>
          <VStack spacing='14px' pt='20px'>
            {map(item?.items || [], (childItem, checkboxKey) => {
              return (
                <Box w='100%' key={`${item.key}-${checkboxKey}`}>
                  <InputCheckbox
                    register={register(`privileges.${item.key}`)}
                    value={childItem?.value}
                    isChecked={includes(scopes, childItem.value)}
                  >
                    {childItem.label}:{childItem?.value}
                  </InputCheckbox>
                </Box>
              )
            })}
          </VStack>
        </Collapse>
      </Box>
    )
  })
  return (
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

              <Box>
                <InputSelect label='Team' />
              </Box>
              <Box pt='32px'>
                <InputSelect label='Role Name' />
              </Box>

              <Box pt='32px'>
                <LabelValue label='Privilege'>
                  <TagInput hasIcon={false} />
                </LabelValue>
              </Box>

              <VStack pt='32px' spacing='32px' alignItems='flex-start' w='100%'>
                {list}
              </VStack>
            </Box>
          </SectionBlock>
        </Box>
      </Box>

      <Box pt='24px'>
        <ActionUpsertPane />
      </Box>
    </FormProvider>
  )
}

export default RoleUpsert
