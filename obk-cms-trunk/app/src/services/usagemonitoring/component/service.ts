import { httpClient } from '../../http-client'
import {
  IFilterComponentRegister,
  IGetComponentRegister,
  IComponentRoleList,
} from './model'
import qs from 'qs'
import * as excelJs from 'exceljs'

class ComponentRegisterService {
  async getAll(
    filter?: IFilterComponentRegister
  ): Promise<IGetComponentRegister> {
    const res = await httpClient.get<IGetComponentRegister>(
      `/api/v1/usageMonitoring/Staff/Component`,
      {
        params: { ...filter },
        paramsSerializer: (params) => qs.stringify(params),
      }
    )
    return res.data
  }

  async getById(id: string) {
    const res = await httpClient.get<IGetComponentRegister>(
      `/api/v1/Member/${id}`
    )
    return res.data
  }
  async getByIdMemberSOC(roid: string) {
    const res = await httpClient.get<IGetComponentRegister>(
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

  async getComponentRoleList() {
    const res = await httpClient.get<IComponentRoleList[]>(
      `/api/v1/operation/mobile/masterdata/Locations?types=1`
    )
    return res.data
  }

  createUser(detail: any) {
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
      const staffData = await this.getAll()
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

      if (Array.isArray(staffData)) {
        staffData.forEach((staff: IGetComponentRegister) => {
          staffSheet.addRow([
            staff.email,
            staff.staffName,
            staff.component,
            staff.mustUseOpsApp,
            staff.loginToDay,
          ])
        })
      } else {
      }

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

      const fileName = `Component_Data_${new Date().getDate()}.${
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

export const componentregisterService = new ComponentRegisterService()
