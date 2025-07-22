'use client'
import {
  AppMenuItem,
  ChildContainerProps,
  LayoutConfig,
  LayoutContextProps,
  LayoutState,
} from '@src/types'
import { useDebounce } from 'primereact/hooks'
import React, { useState, createContext, useContext, ReactNode } from 'react'

const LayoutContext = createContext({} as LayoutContextProps)

export const useLayoutContext = () => useContext(LayoutContext)

export const LayoutProvider = ({ children }: ChildContainerProps) => {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
  })

  const [layoutState, setLayoutState] = useState<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  })

  const [currentMenuItem, debouncedCurrentMenuItem, setCurrentMenuItem] =
    useDebounce<AppMenuItem | undefined>(undefined, 100)
  const [menuName, setMenuName] = useState<string>('')
  const [menuAction, setMenuAction] = useState<ReactNode>(null)

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState: any) => ({
        ...prevLayoutState,
        overlayMenuActive: !prevLayoutState.overlayMenuActive,
      }))
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState: any) => ({
        ...prevLayoutState,
        staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
      }))
    } else {
      setLayoutState((prevLayoutState: any) => ({
        ...prevLayoutState,
        staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive,
      }))
    }
  }

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState: any) => ({
      ...prevLayoutState,
      profileSidebarVisible: !prevLayoutState.profileSidebarVisible,
    }))
  }

  const isOverlay = () => {
    return layoutConfig.menuMode === 'overlay'
  }

  const isDesktop = () => {
    return window.innerWidth > 991
  }

  const value: LayoutContextProps = {
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar,
    currentMenuItem,
    debouncedCurrentMenuItem,
    setCurrentMenuItem,
    menuName,
    setMenuName,
    menuAction,
    setMenuAction,
  }

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}
