/* eslint-disable unused-imports/no-unused-vars-ts */
import React from 'react'
import withGenericServer from '@hocs/server/generic'
import { PCODE } from '@src/data/constants/privilege'
import { KeyValue } from '@src/types/key-value'
import { whatHappeningService } from '@src/services/what-happening/service'
import WhatsHappeningUpsert from '@components/what-happening/what-happening-upsert'
import { WhatHappening } from '@src/services/what-happening/model'

type Props = {
  id: string
  data: any
  tags: KeyValue[]
  categories: KeyValue[]
}

export default function WhatsHappeningCreate(props: Props) {
  const { id, data, tags, categories } = props
  const formData = new WhatHappening(data.body)

  return (
    <WhatsHappeningUpsert
      id={id}
      formData={formData}
      categories={categories}
      tags={tags}
      mode={data.published ? 'PUBLISH' : 'DRAFT'}
    />
  )
}
WhatsHappeningCreate.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const dataPromise = await whatHappeningService
      .getById(id)
      .then((res) => res)
    const tagsPromise = whatHappeningService.getTags()
    const categoriesPromise = whatHappeningService
      .getCategoryWhatHappening()
      .then((res) => {
        const categories = res.map((x) => {
          return { name: x.title, value: x.id } as KeyValue
        })

        return categories
      })

    const res = await Promise.all([dataPromise, tagsPromise, categoriesPromise])
    const data = res[0]
    const tags = res[1]
    const categories = res[2]

    ctx.props = { ...ctx.props, id, data, tags, categories }
    return ctx
  },
  {},
  {
    redirectPath: '/what-happening',
    accessPage: PCODE.VIEWWHATHAPPENING,
  }
)
