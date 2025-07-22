import React, { Dispatch, SetStateAction, ReactNode } from 'react'

/* Breadcrumb Types */
export interface AppBreadcrumbProps {
  className?: string
}

export interface Breadcrumb {
  labels?: string[]
  to?: string
}

export interface BreadcrumbItem {
  label: string
  to?: string
  items?: BreadcrumbItem[]
}

/* Context Types */
export type LayoutState = {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  profileSidebarVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
}

export type LayoutConfig = {
  ripple: boolean
  inputStyle: string
  menuMode: string
  colorScheme: string
  theme: string
  scale: number
}

export interface LayoutContextProps {
  layoutConfig: LayoutConfig
  setLayoutConfig: Dispatch<SetStateAction<LayoutConfig>>
  layoutState: LayoutState
  setLayoutState: Dispatch<SetStateAction<LayoutState>>
  onMenuToggle: () => void
  showProfileSidebar: () => void
  currentMenuItem: IAppMenuItem | undefined
  debouncedCurrentMenuItem: IAppMenuItem | undefined
  setCurrentMenuItem: Dispatch<SetStateAction<IAppMenuItem | undefined>>
  menuName: string
  setMenuName: Dispatch<string>
  menuAction: ReactNode
  setMenuAction: Dispatch<ReactNode>
}

export interface MenuContextProps {
  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
}

/* AppConfig Types */
export interface AppConfigProps {
  simple?: boolean
}

/* AppTopbar Types */
export type NodeRef = MutableRefObject<ReactNode>
export interface AppTopbarRef {
  menubutton?: HTMLButtonElement | null
  topbarmenu?: HTMLDivElement | null
  topbarmenubutton?: HTMLButtonElement | null
}

/* AppMenu Types */
type CommandProps = {
  originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  item: MenuModelItem
}

export interface MenuProps {
  model: MenuModel[]
}

export interface MenuModel {
  id: string
  parentId?: string
  parentsId?: string[]
  label: string
  header?: string
  icon?: string
  iconName?: string
  items?: MenuModel[]
  to?: string
  url?: string
  seperator?: boolean
  type?: string
}

export interface IAppMenuItem extends MenuModel {
  items?: IAppMenuItem[]
  badge?: 'UPDATED' | 'NEW'
  badgeClass?: string
  class?: string
  preventExact?: boolean
  visible?: boolean
  disabled?: boolean
  replaceUrl?: boolean
  breadcrumb?: string[]
  breadcrumbData?: string
  privilegeCode?: string
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  command?: ({ originalEvent, item }: CommandProps) => void
}

export interface AppMenuItemProps {
  item?: IAppMenuItem
  parentKey?: string
  index?: number
  root?: boolean
  className?: string
}
