import withGenericServer from '@hocs/server/generic'
import { HeroData } from '@src/services/marcom/hero-banner/model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PCODE } from '@src/data/constants/privilege'
import { Box } from '@chakra-ui/react'
import Upsert from '@components/marcom/hero/upsert'
import { heroService } from '@src/services/marcom/hero-banner/service'

const EditHeroBanner = ({ initialData }: { initialData: any }) => {
  const defaultValue: any = new HeroData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })

  useEffect(() => {
    if (initialData) {
      form.setValue('status', initialData.status ? '1' : '0')
      form.setValue('relate', initialData.isShowRelatedLink)
      form.setValue('banner', initialData.bannerName)

      form.setValue('title_en', initialData.detail.en.title)
      form.setValue('title_th', initialData.detail.th.title)
      form.setValue('title_cn', initialData.detail.cn.title)

      if (initialData.detail.en.cms.length > 0) {
        const contentEn = initialData.detail.en.cms.map((f: any) => {
          return {
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }
        })
        form.setValue('en_contents', contentEn)
      }

      if (initialData.detail.th.cms.length > 0) {
        const contentTh = initialData.detail.th.cms.map((f: any) => {
          return {
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }
        })
        form.setValue('th_contents', contentTh)
      }

      if (initialData.detail.cn.cms.length > 0) {
        const contentCn = initialData.detail.cn.cms.map((f: any) => {
          return {
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }
        })
        form.setValue('cn_contents', contentCn)
      }
    }
  }, [initialData])

  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert
        formData={form}
        defaultValue={defaultValue}
        formType='edit'
        bannerData={initialData}
      />
    </Box>
  )
}

export default EditHeroBanner

EditHeroBanner.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query

    let initialData: any = null

    if (id && typeof id === 'string') {
      initialData = await heroService
        .getBanner(id)
        .then((res) => res.data)
        .catch((err) => {
          console.log('Fetch banner detail error: ', err)
          return null // Handle error appropriately
        })
    }

    return {
      props: {
        initialData,
      },
    }
  },
  {},
  {
    redirectPath: '/marcom/hero',
    accessPage: PCODE.EDITHERO,
  }
)
