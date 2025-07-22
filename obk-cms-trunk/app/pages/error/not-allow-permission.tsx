import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import withSigin from '@hocs/withSigin'
import { useRouter } from 'next/router'
import { Box, Button } from '@chakra-ui/react'
const NotAllowPermission: any = withSigin(() => {
  const router = useRouter()

  const onGoToDeshboard = () => {
    router.push({
      pathname: '/',
    })
  }
  return (
    <Box>
      <Box
        fontSize={20}
        fontWeight={700}
        lineHeight='56px'
        color='astronaut'
        pt='117px'
      >
        Sorry You Can not Access This Page , Please Contect Admin!
      </Box>
      <Button
        bg='primaryBlue'
        color='white'
        variant='brand'
        width='100%'
        type='button'
        onClick={onGoToDeshboard}
      >
        Back To Dashboard
      </Button>
    </Box>
  )
})

NotAllowPermission.noLayout = true

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const translateProps = await serverSideTranslations(context.locale ?? 'en', [
    'common',
  ])

  return {
    props: {
      ...translateProps,
    },
  }
}

export default NotAllowPermission
