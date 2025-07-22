import { httpClient } from '../../http-client'
import {
  IFilterRosterStaff,
  IGetRosterStaff,
  IOpsAppRoleList,
  IEditRoleUser,
} from './model'
import qs from 'qs'
import * as excelJs from 'exceljs'

class RosterStaffService {
  async getAll(filter?: IFilterRosterStaff): Promise<IGetRosterStaff[]> {
    console.log('getdata---->', filter)
    const res = await httpClient.get<IGetRosterStaff[]>(
      `/api/v1/usageMonitoring/Roster/Staff`,
      {
        params: { ...filter },
        paramsSerializer: (params) => qs.stringify(params),
      }
    )
    return res.data
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetRosterStaff>(`/api/v1/Member/${id}`)
    return res.data
  }
  async getByIdMemberSOC(roid: string) {
    const res = await httpClient.get<IGetRosterStaff>(
      `/api/v1/usageMonitoring/Roster/${roid}`
    )
    return res.data
  }
  async getUserDesignations(mid: string) {
    const res = await httpClient.get(
      `/api/v1/operation/mobile/userDesignations/${mid}`
    )
    return res.data
  }

  async getOpsAppRoleList() {
    const res = await httpClient.get<IOpsAppRoleList[]>(
      `/api/v1/operation/mobile/masterdata/Locations?types=1`
    )
    return res.data
  }

  createUser(detail: any) {
    return httpClient.post(`/api/v1/usageMonitoring/Roster/upsert`, detail)
  }

  editRoleUser(detail: IEditRoleUser) {
    return httpClient.post(`/api/v1/usageMonitoring/Roster/upsert`, detail)
  }

  async getFunctionRoles() {
    const res = await httpClient.get(
      '/api/v1/operation/mobile/masterdata/functionRoles'
    )
    return res.data
  }

  async getLocations() {
    const res = await httpClient.get(
      '/api/v1/operation/mobile/masterdata/Locations?types=1'
    )
    return res.data
  }
  deleteAction(id: string) {
    return httpClient.delete(`/api/v1/usageMonitoring/Roster/${id}`)
  }

  async export() {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const component = urlParams.get('component')

      const filter = component ? { Component: component } : {}

      const staffData = await this.getAll(filter)

      const wb = new excelJs.Workbook()
      const staffSheet = wb.addWorksheet('Staff Data')

      staffSheet.addRow([
        'Email',
        'Staff Name',
        'Component',
        'MustUseOpsApp',
        'LoginToDay',
      ])

      staffSheet.columns.map((col) => (col.width = 18))

      staffData.forEach((staff: any) => {
        staffSheet.addRow([
          staff.email,
          staff.staffName,
          staff.component,
          staff.mustUseOpsApp,
          staff.loginToDay,
        ])
      })

      staffSheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.font = { name: 'Inter', size: 8 }
          cell.alignment = { horizontal: 'center' }
        })
      })

      const excelBlob = await wb.xlsx.writeBuffer()
      const excelUrl = URL.createObjectURL(
        new Blob([excelBlob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      )

      const fileName = `RosterStaff_Data_${new Date().getDate()}.${
        new Date().getMonth() + 1
      }.${new Date().getFullYear()} | Time : ${new Date()
        .toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(/:/g, '.')}.xlsx`
      const link = document.createElement('a')
      link.href = excelUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      URL.revokeObjectURL(excelUrl)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error while exporting Excel:', error)
    }
  }
}

export const rosterStaffService = new RosterStaffService()
