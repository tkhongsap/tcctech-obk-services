/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEventListener, useUnmountEffect } from 'primereact/hooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { classNames } from 'primereact/utils'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'
import { useLayoutContext } from './context/layoutcontext'
import {
  ChildContainerProps,
  LayoutState,
  AppTopbarRef,
  AppMenuItem,
} from '@src/types'
import { usePathname, useSearchParams } from 'next/navigation'
import AppHeader from './AppHeader'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { menuService } from '@src/services/menu/service'
import { getCookie } from 'cookies-next'
import { MID } from '@src/authProvider/constants'

const Layout = ({ children }: ChildContainerProps) => {
  const { layoutConfig, layoutState, setLayoutState } = useLayoutContext()
  const topbarRef = useRef<AppTopbarRef>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: 'click',
      listener: (event) => {
        const isOutsideClicked = !(
          sidebarRef.current?.isSameNode(event.target as Node) ||
          sidebarRef.current?.contains(event.target as Node) ||
          topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
          topbarRef.current?.menubutton?.contains(event.target as Node)
        )

        if (isOutsideClicked) {
          hideMenu()
        }
      },
    })

  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    hideMenu()
    hideProfileMenu()
  }, [pathname, searchParams])

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: 'click',
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
        topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.isSameNode(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
      )

      if (isOutsideClicked) {
        hideProfileMenu()
      }
    },
  })

  const hideMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }))
    unbindMenuOutsideClickListener()
    unblockBodyScroll()
  }

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }))
    unbindProfileMenuOutsideClickListener()
  }

  const blockBodyScroll = (): void => {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll')
    } else {
      document.body.className += ' blocked-scroll'
    }
  }

  const unblockBodyScroll = (): void => {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll')
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      )
    }
  }

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener()
    }

    layoutState.staticMenuMobileActive && blockBodyScroll()
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive])

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener()
    }
  }, [layoutState.profileSidebarVisible])

  const [menuItems, setMenuItem] = useState<AppMenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  const [userId, setUserId] = useState<string>(() => getCookie(MID) || '')

  const fetchMenuData = useCallback(() => {
    menuService
      .getMenu()
      .then((res) => {
        setMenuItem(res?.data?.items || [])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchMenuData()
  }, [])

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener()
    unbindProfileMenuOutsideClickListener()
  })

  const containerClass = classNames('layout-wrapper', {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive':
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive,
    'p-input-filled': layoutConfig.inputStyle === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple,
  })

  return (
    <React.Fragment>
      <div className={containerClass}>
        <AppTopbar ref={topbarRef} />
        <div ref={sidebarRef} className='layout-sidebar'>
          <AppSidebar menuItems={menuItems} loading={loading} userId={userId} />
        </div>
        <div className='layout-main-container'>
          <div className='layout-main mb-5'>
            <AppHeader />
            {children}
          </div>
        </div>
        <ConfirmDialog />
        <div className='layout-mask'></div>
      </div>
    </React.Fragment>
  )
}

export default Layout
