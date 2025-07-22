import { AppMenuItem } from '@src/types'
import { httpClient } from '../http-client'
import { getCookie } from 'cookies-next'
import { CSID } from '@src/authProvider/constants'

class MenuService {
  getMenu() {
    const csid = getCookie(CSID)?.toString() ?? '' // ดึงค่า csid จาก cookie

    return httpClient.post<{ items: AppMenuItem[] }>(
      '/api/v1/Menu/',
      {},
      {
        headers: {
          'x-client-site-id': csid, // Replace with actual client site ID value
        },
      }
    )
  }

  getCliteSiteById(id: string) {
    return httpClient.get(
      `/api/v1/operation/mobile/masterdata/ClientSiteByMID?mid=${id}`
    )
  }
}

export const menuService = new MenuService()
