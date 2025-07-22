import React from 'react'
import withGenericServer from '@hocs/server/generic'
import LabelField from '@components/forms/utils/label-field'
import Heading from '@components/typography/heading'
import { memberService } from '@src/services/member/service'
import { IPersonalInfo } from '@src/services/member/model'
import { useRouter } from 'next/router'

type Props = {
  personalInfo: IPersonalInfo
}

export default function PersonalInfo(props: Props) {
  const router = useRouter()
  const data = props.personalInfo
  if (!data) {
    router.replace('/login')
  }
  return (
    <div className='line-height-3 pb-6 text-sm line-height-3'>
      <div className='grid gap-5 mt-4'>
        <div className='col py-0'>
          <div className='card'>
            <div>
              <Heading as='h1' color='biscay'>
                {data.name}
              </Heading>
              <div className='font-medium text-base pt-1'>
                Member since: {data.createdDateDisplay}
              </div>
            </div>
          </div>

          <div className='card col'>
            <div>
              <Heading as='h2' color='biscay'>
                Email
              </Heading>
              <div className='pt-4'>
                <div>
                  <span className='font-medium text-base'>{data.email}</span>
                  <div className='text-xs line-height-1 text-gray-500'>
                    default
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='card col flex-1'>
          <div>
            <Heading as='h2' color='biscay'>
              Role and permission
            </Heading>
            <>
              {data.roles.map((role, i) => {
                return (
                  <div className='grid text-base font-medium' key={i}>
                    <LabelField className='col' label='Role'>
                      {role.roleName}
                    </LabelField>
                    <LabelField className='col' label='Permission'>
                      <ul>
                        {role.privilegeItems?.map((privilege, j) => (
                          <li key={j}>
                            <span>{privilege.name}</span>
                          </li>
                        ))}
                      </ul>
                    </LabelField>
                  </div>
                )
              })}
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = withGenericServer(
  async (ctx: any) => {
    if (ctx.props.userId) {
      const res = await memberService.getByKeycloakId(ctx.props.userId)
      const personalInfo = res.data
      ctx.props = { ...ctx.props, personalInfo }
    }
    return ctx
  },
  {
    redirectPath: '/',
  }
)
