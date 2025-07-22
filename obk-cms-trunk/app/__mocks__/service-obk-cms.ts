import { http, HttpHandler, HttpResponse } from 'msw'
import deepmerge from 'deepmerge'
import { generateApiURL } from '../__tests__/test-helper'
import { defaultMenuItems, ITestMenuModel } from './data-menu-items'

const mockPostMenuItemsApiHandler = (data?: TestDeepPartial<ITestMenuModel>) =>
  http.post(generateApiURL('/v1/Menu/'), () => {
    return HttpResponse.json({
      data: deepmerge({ ...defaultMenuItems }, { ...data }),
    })
  })

export const obkCmsServiceHandlers: HttpHandler[] = [
  mockPostMenuItemsApiHandler(),
]
