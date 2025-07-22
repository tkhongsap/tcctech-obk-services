/* eslint-disable unused-imports/no-unused-vars-ts */
import React from 'react'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { KeyValue } from '@src/types/key-value'
import { whatHappeningService } from '@src/services/what-happening/service'
import WhatsHappeningUpsert from '@components/what-happening/what-happening-upsert'
import { WhatHappening } from '@src/services/what-happening/model'

type Props = {
  tags: KeyValue[]
  categories: KeyValue[]
}

export default function WhatsHappeningCreate(props: Props) {
  const { tags, categories } = props
  const formData = new WhatHappening(undefined)

  return (
    <>
      <WhatsHappeningUpsert
        formData={formData}
        categories={categories}
        tags={tags}
        mode='DRAFT'
      />
    </>
  )
}
WhatsHappeningCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const tagsPromise = whatHappeningService.getTags()
    const categoriesPromise = whatHappeningService
      .getCategoryWhatHappening()
      .then((res) => {
        const categories = res.map((x) => {
          return { name: x.title, value: x.id } as KeyValue
        })

        return categories
      })

    const res = await Promise.all([tagsPromise, categoriesPromise])
    const tags = res[0]
    const categories = res[1]

    ctx.props = { ...ctx.props, tags, categories }
    return ctx
  },
  {},
  {
    redirectPath: '/what-happening',
    accessPage: PCODE.VIEWWHATHAPPENING,
  }
)
