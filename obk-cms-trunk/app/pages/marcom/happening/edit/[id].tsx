import withGenericServer from '@hocs/server/generic'
import { HeroData } from '@src/services/marcom/hero-banner/model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PCODE } from '@src/data/constants/privilege'
import { Box } from '@chakra-ui/react'
import Upsert from '@components/marcom/happening/upsert'
import { happeningService } from '@src/services/marcom/what-happening/service'

const EditHappenning = ({ initialData }: { initialData: any }) => {
  const defaultValue: any = new HeroData(undefined)
  const form = useForm({
    defaultValues: defaultValue,
  })

  useEffect(() => {
    if (initialData) {
      form.setValue('status', initialData.status ? '1' : '0')
      form.setValue('relate', initialData.isShowRelate)
      form.setValue('tag', initialData.tag)

      form.setValue('title_en', initialData.detail.en.title)
      form.setValue('title_th', initialData.detail.th.title)
      form.setValue('title_cn', initialData.detail.cn.title)
      form.setValue('introduce_en', initialData.detail.en.introduce)
      form.setValue('introduce_th', initialData.detail.th.introduce)
      form.setValue('introduce_cn', initialData.detail.cn.introduce)
      ;['en', 'th', 'cn'].forEach((lang) => {
        if (initialData.detail[lang].cms.length > 0) {
          const content = initialData.detail[lang].cms.map((f: any) => ({
            answer: f.text,
            type: f.contentType,
            fileName: f.fileName,
            imageURL: f.imageURL,
            originalFileName: f.originalFileName,
            youtube: f.youtubeURL,
          }))
          form.setValue(`${lang}_contents`, content)
        }
      })
    }
  }, [initialData])

  return (
    <Box maxW='inherit' pb='60px'>
      <Upsert
        formData={form}
        defaultValue={defaultValue}
        formType='edit'
        contentData={initialData}
      />
    </Box>
  )
}

export default EditHappenning

EditHappenning.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query

    let initialData: any = null

    if (id && typeof id === 'string') {
      initialData = await happeningService
        .get(id)
        .then((res) => res.data)
        .catch((err) => {
          console.log('Fetch happening detail error: ', err)
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
    redirectPath: '/marcom/happening',
    accessPage: PCODE.EDITHAPPENNING,
  }
)
