import { http, HttpHandler, HttpResponse } from 'msw'
import deepmerge from 'deepmerge'
import { generateApiURL } from '../__tests__/test-helper'
import { defaultProgramDetailData } from './data-program-detail'
import { IProgram } from '@src/services/art-and-culture/model'

export const NO_PROGRAM_ID = '888'

const mockGetProgramDetailApiHandler = (data?: TestDeepPartial<IProgram>) =>
  http.get(generateApiURL('/art-culture/programs/:programId'), (ctx) => {
    const { programId } = ctx.params
    if (programId === NO_PROGRAM_ID) {
      return HttpResponse.json(
        {
          message: 'Program not found',
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      data: deepmerge(
        { ...defaultProgramDetailData, id: Number(programId) },
        { ...data }
      ),
    })
  })

export const artCServiceProgramHandlers: HttpHandler[] = [
  mockGetProgramDetailApiHandler(),
]
