import SectionBlock from '@components/display/section-block'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
} from '@chakra-ui/react'
import Heading from '@components/typography/heading'
import { FormProvider } from 'react-hook-form'
import map from 'lodash/map'
import InputTextarea from '@components/label-input/textarea'
import UpsertPane from '@components/action-pane/upsert'

const tabProps = {
  color: 'rockBlue',
  fontSize: { md: '20px' },
  fontWeight: 700,
  _selected: {
    color: 'astronaut',
    borderColor: 'astronaut',
  },
}

const tabItems = [
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'th',
    label: 'Thai',
  },
  {
    key: 'cn',
    label: 'Chinese',
  },
]

const AboutUsUpsert = (props: any) => {
  const { form } = props

  const {
    // refineCore: { onFinish, formLoading, queryResult },
    register,
    handleSubmit,
    watch,
    // formState: { errors },
  } = form
  watch()

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    const key = item.key
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <VStack spacing='32px' w='100%'>
          <Box w='100%'>
            <InputTextarea
              label='Content'
              register={register(`${key}.content`)}
            />
          </Box>
        </VStack>
      </TabPanel>
    )
  })

  const onSubmit = (data: any) => {
    console.log('onSubmit', data)
  }

  const onCancel = () => console.log('onCancel')

  return (
    <Box>
      <FormProvider {...form}>
        <Box justifyContent='space-between' display={{ md: 'flex' }}>
          <Box flex={1}>
            <SectionBlock>
              <Box>
                <HStack justifyContent='space-between' alignItems='center'>
                  <Heading as='h3' color='biscay'>
                    Details
                  </Heading>

                  {/* <ActionPane /> */}
                  <UpsertPane onSubmit={onSubmit} onCancel={onCancel} />
                </HStack>

                <VStack
                  spacing='32px'
                  w='100%'
                  alignItems='flex-start'
                  pt='32px'
                >
                  <Box w='100%'>
                    <Tabs isFitted>
                      <TabList>{tabList}</TabList>
                      <TabPanels>{tabPanelList}</TabPanels>
                    </Tabs>
                  </Box>
                </VStack>
              </Box>
            </SectionBlock>

            <Box pt='24px'>
              <UpsertPane
                onSubmit={handleSubmit(onSubmit)}
                onCancel={onCancel}
              />
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Box>
  )
}

export default AboutUsUpsert
