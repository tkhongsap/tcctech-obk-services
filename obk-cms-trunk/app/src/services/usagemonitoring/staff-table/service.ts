import { DataTableStateEvent } from 'primereact/datatable'
import { httpClient } from '../../http-client'
import {
  IFilterStaffTableRegister,
  IGetStaffTableRegisterRecord,
  IStaffRolesList,
} from './model'
import qs from 'qs'
import * as excelJs from 'exceljs'

class StaffTableRegisterService {
  async getAll(
    filter?: IFilterStaffTableRegister,

    pagination?: DataTableStateEvent
  ): Promise<IGetStaffTableRegisterRecord> {
    const res = await httpClient.get<IGetStaffTableRegisterRecord>(
      `/api/v1/usageMonitoring/Staff`,
      {
        params: { ...filter, ...pagination },
        paramsSerializer: (params) => qs.stringify(params),
      }
    )
    return res.data
  }

  async getStaffRolesList() {
    const res = await httpClient.get<IStaffRolesList>(
      `/api/v1/usageMonitoring/Roster`
    )
    return res.data
  }

  createUser(detail: any) {
    return httpClient.post(`/api/v1/usageMonitoring/Staff/upsert`, detail)
  }

  async export() {
    try {
      const staffRolesData = await this.getStaffRolesList()

      const wb = new excelJs.Workbook()

      const staffSheet = wb.addWorksheet('Staff Data')

      staffSheet.addRow([
        'Staff Name*',
        'Email*',
        'Component*',
        'Position',
        'Company',
        'MustUseOpsApp*',
      ])

      staffSheet.columns.map((col) => (col.width = 18))

      const masterDataSheet = wb.addWorksheet('Master Data')
      staffRolesData.data.forEach((role: any) => {
        masterDataSheet.addRow([`${role.component} | ${role.locationCode}`])
      })

      // @ts-ignore
      staffSheet.dataValidations.add('C2:C99', {
        type: 'list',
        allowBlank: false,
        formulae: [`='Master Data'!$A$1:$A$${staffRolesData.data.length}`],
      })
      // @ts-ignore
      staffSheet.dataValidations.add('F2:G99', {
        type: 'list',
        allowBlank: false,
        formulae: ['"true, false"'],
      })
      // การตั้งค่าให้แต่ละเซลล์จัดรูปแบบ
      staffSheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.font = { name: 'Inter', size: 8 }
          cell.alignment = { horizontal: 'center' }
        })
      })

      // @ts-ignore
      staffSheet.dataValidations.add('G2:G99', {
        type: 'list',
        allowBlank: false,
        formulae: ['"true, false"'],
      })
      // สร้างไฟล์ Excel และดาวน์โหลด
      const excelBlob = await wb.xlsx.writeBuffer()
      const excelUrl = URL.createObjectURL(
        new Blob([excelBlob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      )

      const link = document.createElement('a')
      link.href = excelUrl
      link.download = `Staff_Data_Template_${new Date().toLocaleDateString()}.xlsx`
      document.body.appendChild(link)
      link.click()

      URL.revokeObjectURL(excelUrl)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error while exporting Excel:', error)
    }
  }

  editAction(detail: any) {
    return httpClient.put(`/api/v1/Action`, detail)
  }

  deleteAction(actionId: string) {
    return httpClient.delete(`/api/v1/Action/${actionId}`)
  }

  async exportStaff() {
    try {
      // ดึงข้อมูลพนักงานจาก API
      const staffData = await this.getAll()

      // สร้างไฟล์ Excel ใหม่
      const wb = new excelJs.Workbook()
      const staffSheet = wb.addWorksheet('Staff Data')

      // กำหนดชื่อคอลัมน์ในแผ่นงาน
      staffSheet.addRow([
        'Staff Name*',
        'Email*',
        'Component*',
        'Position',
        'Company',
        'MustUseOpsApp*',
      ])

      staffSheet.columns.map((col) => (col.width = 18)) // ตั้งความกว้างของคอลัมน์

      // เพิ่มข้อมูลพนักงานที่ดึงมา
      staffData.data.forEach((staff: any) => {
        staffSheet.addRow([
          staff.staffName,
          staff.email,
          staff.component,
          staff.position,
          staff.company,
          staff.mustUseOpsApp,
        ])
      })
      staffSheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.font = { name: 'Inter', size: 8 }
          cell.alignment = { horizontal: 'center' }
        })
      })

      // สร้างไฟล์ Excel และดาวน์โหลด
      const excelBlob = await wb.xlsx.writeBuffer()
      const excelUrl = URL.createObjectURL(
        new Blob([excelBlob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      )

      // ตั้งชื่อไฟล์ Excel พร้อมวันที่และเวลา
      const fileName = `Staff_Data_${new Date().getDate()}.${
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

      // ลบ URL และลบลิงก์ออกจากหน้าหลังดาวน์โหลดเสร็จ
      URL.revokeObjectURL(excelUrl)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error while exporting Excel:', error)
    }
  }
}

export const staffTableregisterService = new StaffTableRegisterService()
