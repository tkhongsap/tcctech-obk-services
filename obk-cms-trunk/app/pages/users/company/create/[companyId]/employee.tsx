import { Box, HStack } from '@chakra-ui/react'
import SectionBlock from '@components/display/section-block'
import StyledSubtitle from '@components/display/styled-subtitle'
import InputText from '@components/label-input/text'
import InputSelect from '@components/label-input/select'
import withGenericServer from '@hocs/server/generic'

export default function CreateEmployee() {
  return (
    <Box maxW='inherit'>
      <Box
        fontSize='34px'
        fontWeight='bold'
        lineHeight='42px'
        color='astronaut'
      >
        Add new employee
      </Box>

      <Box pt='60px'>
        <HStack spacing='30px' alignItems='flex-start'>
          <Box flex='0 0 30%'>
            <SectionBlock>
              <StyledSubtitle>Company information</StyledSubtitle>
              <Box pt='32px'>
                <InputText label='Company name' />
              </Box>
              <Box pt='32px'>
                <InputSelect label='Building' />
              </Box>
              <Box pt='32px'>
                <InputSelect label='Floor' />
              </Box>
            </SectionBlock>
          </Box>

          <Box flex={1}>
            <SectionBlock>
              <StyledSubtitle>Employee</StyledSubtitle>
            </SectionBlock>
          </Box>
        </HStack>
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
