import { dmSans } from '@fonts'
import InputText from '@components/label-input/text'
import InputTextarea from '@components/label-input/textarea'
import InputSelect from '@components/label-input/select'
import InputCheckboxGroup from '@components/label-input/checkbox-group'
import InputDate from '@components/label-input/date'
import { Box, HStack, VStack } from '@chakra-ui/react'
import Tag from '@components/tag'
import ListPagination from '@components/list/pagination'
import TagInput from '@components/label-input/tags-input'

import withGenericServer from '@hocs/server/generic'

import Heading from '@components/typography/heading'
import B1 from '@components/typography/b1'
import B2 from '@components/typography/b2'
import C1 from '@components/typography/c1'

import { useForm, FormProvider } from 'react-hook-form'

export default function StyledGuide() {
  const form = useForm({})
  return (
    <FormProvider {...form}>
      <Box maxW='inherit' pb='60px' className={dmSans.className}>
        <Box
          fontSize='34px'
          fontWeight={700}
          lineHeight='42px'
          px={{ _: '15px', md: 0 }}
        >
          Style Guide
        </Box>

        <Box
          borderRadius={{ md: 10 }}
          bg='white'
          p={{ md: '30px' }}
          mt={{ _: '20px', md: '60px' }}
        >
          <VStack spacing='100px' w='100%' alignItems='flex-start'>
            <Box>
              <Box>
                <Heading>Typography</Heading>
              </Box>
              <Box px='15px' pt='20px'>
                <VStack spacing='10px' alignItems='flex-start'>
                  <Box>
                    <u>
                      <Heading as='h2'>Heading</Heading>
                    </u>
                    <VStack spacing='10px' alignItems='flex-start'>
                      <Heading as='h1'>H1: The heart of Bangkok</Heading>
                      <Heading as='h2'>H2: The heart of Bangkok</Heading>
                      <Heading as='h3'>H3: The heart of Bangkok</Heading>
                      <Heading as='h4'>H4: The heart of Bangkok</Heading>
                    </VStack>
                  </Box>

                  <Box>
                    <u>
                      <Heading as='h2'>Body 1</Heading>
                    </u>
                    <VStack spacing='10px' alignItems='flex-start'>
                      <B1>regular: The heart of Bangkok</B1>
                      <B1 as='medium'>medium: The heart of Bangkok</B1>
                      <B1 as='bold'>bold: The heart of Bangkok</B1>
                    </VStack>
                  </Box>

                  <Box>
                    <u>
                      <Heading as='h2'>Body 2</Heading>
                    </u>
                    <VStack spacing='10px' alignItems='flex-start'>
                      <B2>regular: The heart of Bangkok</B2>
                      <B2 as='medium'>medium: The heart of Bangkok</B2>
                      <B2 as='bold'>bold: The heart of Bangkok</B2>
                    </VStack>
                  </Box>

                  <Box>
                    <u>
                      <Heading as='h2'>Caption 1</Heading>
                    </u>
                    <VStack spacing='10px' alignItems='flex-start'>
                      <C1>regular: The heart of Bangkok</C1>
                      <C1 as='medium'>medium: The heart of Bangkok</C1>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </Box>

            <Box>
              <Box>
                <Heading>Inputs</Heading>
              </Box>
              <Box px='15px' pt='20px'>
                <Box>
                  <Box width='400px' maxW='100%'>
                    <InputText label='Title' value='' />
                  </Box>
                </Box>

                <Box pt='20px'>
                  <Box width='400px' maxW='100%'>
                    <InputTextarea label='Description' value='' />
                  </Box>
                </Box>

                <Box pt='20px'>
                  <Box width='400px' maxW='100%'>
                    <InputSelect
                      label='Dropdown'
                      value=''
                      items={[
                        { label: 'label 1', value: 'value 1' },
                        { label: 'label 2', value: 'value 2' },
                      ]}
                    />
                  </Box>
                </Box>

                <Box pt='20px'>
                  <Box width='400px' maxW='100%'>
                    <InputCheckboxGroup
                      label='Checkbox'
                      items={[
                        { label: 'Everyone', value: 'everyone' },
                        { label: 'Shopper (2,000)', value: 'shopper' },
                      ]}
                    />
                  </Box>
                </Box>

                <Box pt='20px'>
                  <Box width='400px' maxW='100%'>
                    <InputDate label='Date' value='' />
                  </Box>
                </Box>

                <Box pt='20px'>
                  <TagInput options={[]} />
                </Box>
              </Box>
            </Box>

            <Box>
              <Box>
                <Heading>Tags</Heading>
              </Box>
              <Box px='15px' pt='20px'>
                <HStack spacing={5} flexWrap='wrap'>
                  <Tag color='#E0AF00'>
                    <Box px='8px'>Waiting for approval</Box>
                  </Tag>
                  <Tag color='#CD1A1A'>
                    <Box px='8px'>Rejected</Box>
                  </Tag>
                  <Tag color='#4318FF'>
                    <Box px='8px'>Approved (Sent)</Box>
                  </Tag>
                  <Tag color='#59B413'>
                    <Box px='8px'>Approved (Scheduled)</Box>
                  </Tag>
                </HStack>
              </Box>
            </Box>

            <Box>
              <Box>
                <Heading>Pagination</Heading>
              </Box>
              <Box px='15px' pt='20px'>
                <Box>
                  <ListPagination currentPage={4} totalPage={100} />
                </Box>
              </Box>
            </Box>
          </VStack>
        </Box>
      </Box>
    </FormProvider>
  )
}
export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    return ctx
  },
  {
    redirectPath: '/roles/member',
  }
)
