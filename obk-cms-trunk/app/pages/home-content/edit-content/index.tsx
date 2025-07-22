import React from 'react'
import withGenericServer from '@hocs/server/generic'
import HomeContent from '@components/homecontent/home-content'
import { homeContentService } from '@src/services/homecontent/history/service'
import { ILastVersion } from '@src/services/homecontent/history/model'
import { PCODE } from '@src/data/constants/privilege'
type Props = {
  lastVersion?: ILastVersion
}
export default function EditContent(props: Props) {
  return <HomeContent data={undefined} lastVersion={props.lastVersion} />
}

EditContent.activePrime = true

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    const versions = await homeContentService.getLastVersion()
    let lastversion = versions.data
    ctx.props = { ...ctx.props, lastVersion: lastversion }
    return ctx
  },
  {},
  {
    redirectPath: '/homecontent/edit-content',
    accessPage: PCODE.VIEWHOMECONTENTOFFICE,
  }
)
