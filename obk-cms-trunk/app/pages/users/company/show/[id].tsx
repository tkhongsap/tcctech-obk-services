import React from 'react'
import { useTranslate } from '@refinedev/core'
import Tag from '@components/tag'
import LabelValue from '@components/display/label-value'
import styled from 'styled-components'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  SimpleGrid,
  Button,
  Flex,
} from '@chakra-ui/react'

import { useState } from 'react'
import GenericFilterPane from '@components/filter-pane/generic'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import Table from '@components/list/table'
import StyledTitle from '@components/display/styled-title'
import StyledSubtitle from '@components/display/styled-subtitle'
import SectionBlock from '@components/display/section-block'
import StyledRemarks from '@components/display/styled-remark'
import withGenericServer from '@hocs/server/generic'

const StyledButton = styled(Button)`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
`

const tabProps = {
  color: 'rockBlue',
  fontSize: { md: '20px' },
  fontWeight: 700,
  _selected: {
    color: 'astronaut',
    borderColor: 'astronaut',
  },
}

export default function UserShow() {
  const translate = useTranslate()
  const [tabIndex, setTabIndex] = useState(0)

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: translate('blog_posts.fields.id'),
        // className: 'col-sticky-start',
      },
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
      },
      {
        id: 'status',
        // accessorKey: 'content',
        header: 'status',
        cell: function render({}) {
          return (
            <Box>
              <HStack spacing={5} flexWrap='wrap'>
                <Tag color='#59B413'>
                  <Box px='8px'>Active</Box>
                </Tag>
                <Tag color='#CD1A1A'>
                  <Box px='8px'>Suspend</Box>
                </Tag>
              </HStack>
            </Box>
          )
        },
      },
    ],
    [translate]
  )

  const tableProps = useTable({
    columns,
    refineCoreProps: {
      resource: 'users',
    },
  })

  const {
    refineCore: {
      tableQueryResult: { isLoading: tableIsLoading },
    },
  } = tableProps

  return (
    <Box maxW='inherit'>
      <Box
        fontSize='34px'
        fontWeight='bold'
        lineHeight='42px'
        color='astronaut'
      >
        User Information
      </Box>

      <Box py='60px'>
        <SectionBlock>
          <StyledTitle>Jasmine Smith</StyledTitle>
          <Box pt='4px' fontSize='14px' lineHeight='24px' color='codGray'>
            Member since: 25 December 2022
          </Box>
          <Box pt='24px'>
            <SimpleGrid columns={3} spacingY='24px'>
              <Box flex={1}>
                <LabelValue label='Status'>
                  <Tag color='#59B413'>
                    <Box p='2px 8px'>Active</Box>
                  </Tag>
                </LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='User ID'>000028</LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Role'>Office worker</LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Company name'>Xi - Xian Group</LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Building'>Signature Tower</LabelValue>
              </Box>
              <Box flex={1}>
                <LabelValue label='Floor'>24</LabelValue>
              </Box>
            </SimpleGrid>
          </Box>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <Tabs isFitted onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab {...tabProps}>Account</Tab>
              <Tab {...tabProps}>Security</Tab>
              <Tab {...tabProps}>Activity</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {tabIndex === 0 && (
                  <Box pt='32px'>
                    <StyledSubtitle>Personal information</StyledSubtitle>
                    <Box pt='32px'>
                      <LabelValue label='Name'>Jasmine Smith</LabelValue>
                    </Box>
                    <Box pt='32px'>
                      <LabelValue label='Date of birth'>
                        14 January 1990
                      </LabelValue>
                    </Box>
                    <Box pt='32px'>
                      <LabelValue label='Gender'>Prefer not to say</LabelValue>
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel>
                {tabIndex === 0 && (
                  <Box pt='32px'>
                    <StyledSubtitle>Sign-in method</StyledSubtitle>
                    <Box pt='32px'>
                      <LabelValue label='Current sign-in method'>
                        Email
                      </LabelValue>
                    </Box>
                    <Box pt='32px'>
                      <LabelValue label='Current username'>
                        joe.sutti@gmail.com
                      </LabelValue>
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel>
                {tabIndex === 2 && (
                  <Box>
                    <HStack justifyContent='space-between'>
                      <Box fontSize='24px' fontWeight={700} lineHeight='32px'>
                        Account activity
                      </Box>
                      <Box>
                        <GenericFilterPane />
                      </Box>
                    </HStack>

                    <Box>
                      <Box
                        maxH={{ _: '50vh', md: '80vh' }}
                        overflow='auto'
                        mt='38px'
                      >
                        {tableIsLoading ? (
                          'Loading...'
                        ) : (
                          <Table columns={columns} tableProps={tableProps} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </SectionBlock>

        <HStack pt='24px' spacing='24px'>
          <SectionBlock flex={1}>
            <StyledSubtitle>Email</StyledSubtitle>
            <Box pt='32px'>
              <LabelValue label='Default email'>joe.sutti@gmail.com</LabelValue>
            </Box>
            <Box
              pt='32px'
              display='flex'
              justifyContent='space-between'
              alignItems='flex-end'
            >
              <Box>
                <LabelValue label='2nd email'>joe.sutti@gmail.com</LabelValue>
                <StyledRemarks>Connect with Google</StyledRemarks>
              </Box>
              <Box>
                <StyledButton
                  color='primaryBlue'
                  borderColor='primaryBlue'
                  variant='outline'
                >
                  Edit
                </StyledButton>
              </Box>
            </Box>
            <Box
              pt='32px'
              display='flex'
              justifyContent='space-between'
              alignItems='flex-end'
            >
              <Box>
                <LabelValue label='3rd email'>-</LabelValue>
              </Box>
              <StyledButton
                color='primaryBlue'
                borderColor='primaryBlue'
                variant='outline'
              >
                Add
              </StyledButton>
            </Box>
          </SectionBlock>

          <SectionBlock flex={1}>
            <StyledSubtitle>Phone number</StyledSubtitle>
            <Box pt='32px'>
              <LabelValue label='Default phone'>+66 123 456 789</LabelValue>
            </Box>
            <Box
              pt='32px'
              display='flex'
              justifyContent='space-between'
              alignItems='flex-end'
            >
              <Box>
                <LabelValue label='2nd phone'>+66 123 456 789</LabelValue>
                <StyledRemarks>Connect with Google</StyledRemarks>
              </Box>
              <Box>
                <StyledButton
                  color='primaryBlue'
                  borderColor='primaryBlue'
                  variant='outline'
                >
                  Edit
                </StyledButton>
              </Box>
            </Box>
            <Box
              pt='32px'
              display='flex'
              justifyContent='space-between'
              alignItems='flex-end'
            >
              <Box>
                <LabelValue label='3rd phone'>-</LabelValue>
              </Box>
              <Box>
                <StyledButton
                  color='primaryBlue'
                  borderColor='primaryBlue'
                  variant='outline'
                >
                  Add
                </StyledButton>
              </Box>
            </Box>
          </SectionBlock>
        </HStack>

        <SectionBlock mt='24px'>
          <StyledSubtitle>Single Sign-On (SSO)</StyledSubtitle>
          <Flex pt='32px' justifyContent='space-between'>
            <Box>
              <LabelValue label='Microsoft'>-</LabelValue>
            </Box>
            <Box>
              <StyledButton
                color='primaryBlue'
                borderColor='primaryBlue'
                variant='outline'
              >
                Edit
              </StyledButton>
            </Box>
          </Flex>

          <Flex pt='32px' justifyContent='space-between'>
            <Box>
              <LabelValue label='Google'>xxx@gmail.com</LabelValue>
            </Box>
            <Box>
              <StyledButton
                color='primaryBlue'
                borderColor='primaryBlue'
                variant='outline'
              >
                Edit
              </StyledButton>
            </Box>
          </Flex>

          <Flex pt='32px' justifyContent='space-between'>
            <Box>
              <LabelValue label='Apple'>-</LabelValue>
            </Box>
            <Box>
              <StyledButton
                color='primaryBlue'
                borderColor='primaryBlue'
                variant='outline'
              >
                Edit
              </StyledButton>
            </Box>
          </Flex>

          <Box py='32px' width='100%'>
            <Box bg='rockBlue' height='1px' />
          </Box>

          <HStack spacing='24px'>
            <Box>
              <StyledButton bg='thunderbird' color='white'>
                Suspend
              </StyledButton>
            </Box>
            <Box>
              <StyledButton
                color='thunderbird'
                borderColor='thunderbird'
                variant='outline'
              >
                Delete This Account
              </StyledButton>
            </Box>
          </HStack>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <StyledSubtitle>Password</StyledSubtitle>
          <Flex pt='32px' justifyContent='space-between'>
            <Box>
              <LabelValue label='Current password'>*******</LabelValue>
            </Box>
            <Box>
              <StyledButton
                color='primaryBlue'
                borderColor='primaryBlue'
                variant='outline'
              >
                Edit
              </StyledButton>
            </Box>
          </Flex>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <StyledSubtitle>Two-Factor Authentication (2FA)</StyledSubtitle>
          <Box pt='4px' fontSize='14px' lineHeight='24px' color='codGray'>
            Enhance your account security by enabling Two-Factor Authentication
            (2FA), which adds an extra layer of protection to your account
          </Box>

          <Box pt='32px'>
            <LabelValue label='Status'>
              <Tag color='#59B413'>
                <Box px='8px'>Enable 2FA</Box>
              </Tag>
            </LabelValue>
          </Box>

          <Box pt='32px'>
            <LabelValue label='Recovery email'>joe.sutti@gmail.com</LabelValue>
          </Box>

          <Box pt='32px'>
            <LabelValue label='Recovery phone number'>
              +66 123 456 789
            </LabelValue>
          </Box>
        </SectionBlock>

        <SectionBlock mt='24px'>
          <StyledSubtitle>Account</StyledSubtitle>
          <Box pt='32px'>
            Are you sure you want to suspend or delete this account ?
          </Box>
          <Box py='32px' width='100%'>
            <Box bg='rockBlue' height='1px' />
          </Box>
          <HStack spacing='24px'>
            <Box>
              <StyledButton bg='thunderbird' color='white'>
                Suspend
              </StyledButton>
            </Box>
            <Box>
              <StyledButton
                color='thunderbird'
                borderColor='thunderbird'
                variant='outline'
              >
                Delete This Account
              </StyledButton>
            </Box>
          </HStack>
        </SectionBlock>
      </Box>
    </Box>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/users/company',
  }
)
