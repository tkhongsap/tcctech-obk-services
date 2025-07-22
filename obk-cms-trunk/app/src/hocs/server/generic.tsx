import merge from 'lodash/merge'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { authProvider } from 'src/authProvider'
import { decodeKeyCloakToken, getCookieCSID } from '@src/utils/decode'
import { memberService } from '@src/services/member/service'
import { setCSID } from '../../services/http-client'

const withGenericServer = (
  gssp: any,
  assignOpts = {},
  defaultOpts = {
    redirectPath: '/',
    accessPage: '',
  }
) => {
  return async (ctx: any) => {
    const opts = merge({}, defaultOpts, assignOpts)
    const translateProps = await serverSideTranslations(ctx.locale ?? 'en', [
      'common',
    ])
    const { authenticated, redirectTo } = await authProvider.check(ctx)
    const newCtx: any = {
      props: {
        ...translateProps,
        query: ctx.query,
        userId: null,
      },
      // authenticated,
    }
    if (!authenticated) {
      newCtx.redirect = {
        destination: `${redirectTo}?to=${encodeURIComponent(
          opts?.redirectPath
        )}`,
        permanent: false,
      }
    } else {
      newCtx.props.userId = decodeKeyCloakToken(ctx)
      const csid = getCookieCSID(ctx) ?? ''
      setCSID(csid)
      const member = await memberService.getByKeycloakId(newCtx.props.userId)
      const privilegeItems: string[] = member.data.roles
        .flatMap((rs) => rs.privilegeItems)
        .map((item) => item?.code) as string[]
      const canAccess = privilegeItems.some(
        (x) => x && x === defaultOpts.accessPage
      )
      if (defaultOpts.accessPage !== '' && !canAccess) {
        newCtx.redirect = {
          destination: '/error/not-allow-permission',
          permanent: false,
        }
      }
      newCtx.props.can = privilegeItems
      // const { can } = await accessControlProvider.can({
      //   resource: 'categories',
      //   action: 'list',
      // })
      // if (!can) {
      //   newCtx.res = ctx.res
      //   newCtx.res.statusCode = 403
      //   newCtx.res.end()
      // }
    }

    return await gssp(newCtx)
  }
}

export default withGenericServer
