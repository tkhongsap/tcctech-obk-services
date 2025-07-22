import React from 'react'
import { useSelect } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  CheckboxGroup,
} from '@chakra-ui/react'
import map from 'lodash/map'
import InputText from '@components/label-input/text'
import InputTextarea from '@components/label-input/textarea'
import InputSelect from '@components/label-input/select'
import InputDate from '@components/label-input/date'
import InputTags from '@components/label-input/tags-input'
import ContentBuilder from '@components/content-builder'
import EditActionPane from '@components/action-pane/moderation'
import Divider from '@components/common/divider'
import Checkbox from '@components/input/checkbox'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'

export default function EditUser() {
  const defaultValues: any = {
    en: { title: 'en title', image: 'en image', message: 'en msg' },
    th: { title: 'th title', image: 'th image', message: 'th msg' },
    cn: { title: 'cn title', image: 'cn image', message: 'cn msg' },
    category: {
      id: 1,
    },
  }

  const {
    refineCore: { queryResult },
    register,
    setValue,
  } = useForm({
    defaultValues,
  })

  const blogPostsData = queryResult?.data?.data

  const { options: categoryOptions } = useSelect({
    resource: 'categories',
    defaultValue: blogPostsData?.category?.id,
  })

  React.useEffect(() => {
    setValue('category.id', blogPostsData?.category?.id)
  }, [categoryOptions, setValue, blogPostsData])

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

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    return (
      <TabPanel key={item.key} pt='40px' px='0'>
        <Box>
          <InputText label='Title' register={register(`${item.key}.title`)} />
        </Box>
        <Box pt='32px'>
          <InputText
            label='Image (Size recommend 16:9)'
            register={register(`${item.key}.image`)}
          />
        </Box>
        <Box pt='32px'>
          <Box
            fontSize='16px'
            fontWeight={700}
            lineHeight='26px'
            color='bayofMany'
          >
            Block 1
          </Box>
          <Box pt='8px'>
            <InputTextarea
              label='Message'
              register={register(`${item.key}.message`)}
            />
          </Box>
        </Box>

        <Box pt='32px'>
          <ContentBuilder />
        </Box>
      </TabPanel>
    )
  })

  return (
    <Box maxW='inherit'>
      <Box
        justifyContent='space-between'
        mt={{ _: '20px', md: '42px' }}
        display={{ md: 'flex' }}
      >
        <Box flex={1}>
          <Box
            borderRadius={{ md: 10 }}
            bg='white'
            p={{ _: '15px', md: '30px' }}
          >
            <Box>
              <Box
                display={{ _: 'block', md: 'flex' }}
                alignItems='center'
                justifyContent='space-between'
              >
                <Box
                  fontSize='24px'
                  fontWeight={700}
                  lineHeight='32px'
                  color='astronaut'
                >
                  Notification details
                </Box>

                {/* <Box>
                  <EditActionPane />
                </Box> */}
              </Box>

              <Box pt={{ _: '20px', md: '52px' }}>
                <Tabs isFitted>
                  <TabList>{tabList}</TabList>
                  <TabPanels>{tabPanelList}</TabPanels>
                </Tabs>
              </Box>

              {/* <Box pt='32px'>
                <InputSelect label='Push Type' />
              </Box>

              <Box pt='32px'>
                <InputCheckboxGroup
                  label='Segmental / Target group'
                  items={[
                    { label: 'Everyone', value: 'everyone' },
                    { label: 'Shopper (2,000)', value: 'shopper' },
                  ]}
                />
              </Box>

              <Box pt='32px'>
                <InputDate label='Push date' />
              </Box> */}

              <Box pt='32px'>
                <InputTags label='Tags' />
              </Box>

              <Box pt='32px'>
                <Box fontSize={16} lineHeight='26px'>
                  <Box fontWeight={700}>For the button section</Box>
                  <Box pt='8px' color='codGray'>
                    Feel free to leave the button empty if you dont have a
                    specific destination for the notification. However, if you
                    do, please entering the link url of you destination
                  </Box>
                </Box>
                <Box pt='32px'>
                  <Box>
                    <Box pt='12px'>
                      <RadioGroup>
                        <Stack spacing={[1, 5]}>
                          <Box>
                            <Radio value='1' alignItems='flex-start'>
                              <Box>Proceed without a button</Box>
                            </Radio>
                          </Box>
                          <Box>
                            <Radio value='2' alignItems='flex-start'>
                              <Box>Button with a link URL</Box>

                              <Box
                                pt='8px'
                                color='kimberly'
                                fontSize={14}
                                lineHeight='24px'
                              >
                                For this option, you can specify an external
                                link or URL to which the notification will
                                direct users. Please provide the complete URL
                                for directing users to external websites,
                                landing pages, or resources.
                              </Box>
                            </Radio>
                          </Box>

                          <Box>
                            <Box pt='24px'>
                              <InputText label='Button name (English)' />
                            </Box>

                            <Box pt='24px'>
                              <InputText label='Button link URL' />
                            </Box>
                          </Box>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box>Enable push notification</Box>
              <Box>Please select your preference for push notifications</Box>
              <Box pt='32px'>
                <Box>
                  <Box pt='12px'>
                    <RadioGroup>
                      <Stack spacing={[1, 5]}>
                        <Box>
                          <Radio value='1' alignItems='flex-start'>
                            <Box>
                              No, I don’t want to send push notification for
                              this message.{' '}
                            </Box>
                          </Radio>
                        </Box>
                        <Box>
                          <Radio value='2' alignItems='flex-start'>
                            <Box>
                              Yes, I want to send push notifications along with
                              the in-app notification
                            </Box>

                            <Box
                              pt='8px'
                              color='kimberly'
                              fontSize={14}
                              lineHeight='24px'
                            >
                              Please provide the information for push
                              notification
                            </Box>
                          </Radio>
                        </Box>

                        <Box>
                          <Box pt='24px'>
                            <InputText label='Title (English)' />
                          </Box>

                          <Box pt='24px'>
                            <InputText label='Text (English)' />
                          </Box>
                        </Box>
                      </Stack>
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box pt='40px'>
            <EditActionPane />
          </Box>
        </Box>

        <Box flex='0 0 calc(20vw - 20px)' ml={{ md: '20px' }}>
          <Box
            borderRadius={{ md: 10 }}
            p={{ md: '30px' }}
            bg='white'
            mt={{ _: '20px', md: 0 }}
          >
            <Box>Notification schedule</Box>

            <Box pt='32px'>
              <InputText label='Notification ID' />
            </Box>
            <Box pt='32px'>
              <InputText label='Notification category' />
            </Box>
            <Box pt='32px'>
              <InputDate label='Scheduled date' />
            </Box>
          </Box>

          <Box
            borderRadius={{ md: 10 }}
            p={{ md: '30px' }}
            bg='white'
            mt='20px'
          >
            <Box>Target audience</Box>
            <Box pt='32px'>
              <CheckboxGroup>
                <Stack spacing={[1, 5]}>
                  <Box>
                    <Checkbox
                      value='1'
                      alignItems='flex-start'
                      fontSize='14px'
                      lineHeight='24px'
                    >
                      <Box fontWeight={700} color='bayofMany'>
                        All
                      </Box>
                      <Box color='kimberly'>
                        All users who have the One Bangkok application.
                      </Box>
                    </Checkbox>
                  </Box>

                  <Box>
                    <Checkbox value='2' alignItems='flex-start'>
                      <Box
                        fontSize='14px'
                        fontWeight={700}
                        lineHeight='24px'
                        color='bayofMany'
                      >
                        Shoppers
                      </Box>
                    </Checkbox>

                    <Box pt='24px' pl='24px'>
                      <InputSelect label='Member status' />
                    </Box>
                  </Box>

                  <Box>
                    <Checkbox value='3' alignItems='flex-start'>
                      <Box
                        fontSize='14px'
                        fontWeight={700}
                        lineHeight='24px'
                        color='bayofMany'
                      >
                        Office workers
                      </Box>
                    </Checkbox>

                    <Box pt='24px' pl='24px'>
                      <RadioGroup>
                        <Stack spacing={[1, 5]}>
                          <Box>
                            <Radio value='1' alignItems='flex-start'>
                              <Box>All office workers</Box>
                            </Radio>
                          </Box>
                          <Box>
                            <Radio value='2' alignItems='flex-start'>
                              <Box>Specify by building</Box>
                            </Radio>

                            <Box pt='24px' pl='24px'>
                              <InputSelect label='Buildings' />
                            </Box>
                          </Box>

                          <Box>
                            <Radio value='2' alignItems='flex-start'>
                              <Box>Specify by building</Box>
                            </Radio>

                            <Box pt='24px' pl='24px'>
                              <InputSelect label='Company' />
                            </Box>
                          </Box>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </Box>
                </Stack>
              </CheckboxGroup>
            </Box>
          </Box>

          <Box
            borderRadius={{ md: 10 }}
            p={{ md: '30px' }}
            bg='white'
            mt='20px'
          >
            <Box>3rd Notification schedule</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    ctx.props = { ...ctx.props }
    return ctx
  },
  {},
  {
    redirectPath: '/roles/member',
    accessPage: PCODE.EDITUSERDETAILS,
  }
)
