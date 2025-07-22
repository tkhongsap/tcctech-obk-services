import React from 'react'
import withGenericServer from '@hocs/server/generic'
import HomeContent from '@components/homecontent/home-content'
import { homeContentService } from '@src/services/homecontent/history/service'
import {
  IHomeContentData,
  ILastVersion,
} from '@src/services/homecontent/history/model'
import { PCODE } from '@src/data/constants/privilege'

type Props = {
  data: IHomeContentData
}

export default function EditContent(props: Props) {
  const { data } = props
  const lastVersion: ILastVersion = {
    updatedBy: data.updatedByName ?? '',
    updatedDateDisplay: data.updatedDateDisplay ?? '',
  }
  return <HomeContent data={data} lastVersion={lastVersion} />
}

EditContent.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const { id } = ctx.props.query
    const res = await homeContentService.get(id)
    const data = res.data
    ctx.props = { ...ctx.props, data }
    return ctx
  },
  {
    redirectPath: '/homecontent/version-history/show',
    accessPage: PCODE.VIEWHOMECONTENTOFFICE,
  }
)
