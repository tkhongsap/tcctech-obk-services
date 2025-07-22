import SvgUser from '@assets/svg/user.svg'
import SvgDashboard from '@assets/svg/icon-menu-home.svg'
import SvgContent from '@assets/svg/content.svg'
import SvgLegal from '@assets/svg/legal.svg'
import SvgRole from '@assets/svg/role.svg'
import SvgBell from '@assets/svg/bell.svg'
import SvgSupport from '@assets/svg/support.svg'
import SvgLogout from '@assets/svg/logout.svg'
import SvgBuilding from '@assets/svg/building.svg'
import SvgApp from '@assets/svg/app.svg'
import SvgAir from '@assets/svg/air.svg'
import SvgTicket from '@assets/svg/ticket.svg'
import SvgCar from '@assets/svg/car.svg'
import SvgControl from '@assets/svg/control.svg'
import SvgPage from '@assets/svg/page.svg'
import SvgRetail from '@assets/svg/retail.svg'
import SvgLeaf from '@assets/svg/leaf.svg'
import SvgAnnouncement from '@assets/svg/announcement.svg'
import SvgOffice from '@assets/svg/office.svg'
import SvgOfficeBlock from '@assets/svg/office-block.svg'

import { CommandProps, IAppMenuItem } from '@src/types/layout'

const MenusIcon = new Map([
  ['SvgUser', SvgUser],
  ['SvgDashboard', SvgDashboard],
  ['SvgContent', SvgContent],
  ['SvgBuilding', SvgBuilding],
  ['SvgLegal', SvgLegal],
  ['SvgRole', SvgRole],
  ['SvgBell', SvgBell],
  ['SvgSupport', SvgSupport],
  ['SvgApp', SvgApp],
  ['SvgAir', SvgAir],
  ['SvgTicket', SvgTicket],
  ['SvgCar', SvgCar],
  ['SvgControl', SvgControl],
  ['SvgPage', SvgPage],
  ['SvgRetail', SvgRetail],
  ['SvgLogout', SvgLogout],
  ['SvgSustainability', SvgLeaf],
  ['SvgAnnouncement', SvgAnnouncement],
  ['SvgOffice', SvgOffice],
  ['SvgOfficeBlock', SvgOfficeBlock],
])

const getMenuIcon = (iconName: string) => {
  return MenusIcon.get(iconName)
}

export class AppMenuItem implements IAppMenuItem {
  id: string
  parentId?: string
  parentsId?: string[]
  label: string
  header?: string
  icon?: string
  iconSvg: any
  to?: string
  url?: string
  seperator?: boolean
  type?: string
  items?: IAppMenuItem[]
  badge?: 'UPDATED' | 'NEW'
  badgeClass?: string
  class?: string
  preventExact?: boolean
  visible?: boolean
  disabled?: boolean
  replaceUrl?: boolean
  breadcrumb?: string[]
  privilegeCode?: string
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  command?: ({ originalEvent, item }: CommandProps) => void

  constructor(data: IAppMenuItem) {
    this.id = data.id
    this.parentId = data.parentId
    this.parentsId = data.parentsId
    this.label = data.label
    this.header = data.header
    this.icon = data.icon
    this.iconSvg = getMenuIcon(data.iconName ?? '')
    this.items = data.items
    this.to = data.to
    this.url = data.url
    this.seperator = data.seperator
    this.type = data.type
    this.items = data.items
    this.badge = data.badge
    this.badgeClass = data.badgeClass
    this.class = data.class
    this.preventExact = data.preventExact
    this.visible = data.visible
    this.disabled = data.disabled
    this.replaceUrl = data.replaceUrl
    this.breadcrumb = JSON.parse(data.breadcrumbData ?? '[]')
    this.privilegeCode = data.privilegeCode
    this.command = data.command
  }
}
