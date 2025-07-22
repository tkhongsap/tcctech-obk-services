/* eslint-disable @next/next/no-img-element */

import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { AppTopbarRef } from '@src/types'
import { useLayoutContext } from './context/layoutcontext'

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutState, onMenuToggle } = useLayoutContext()
  const menubuttonRef = useRef(null)
  const topbarmenuRef = useRef(null)
  const topbarmenubuttonRef = useRef(null)

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }))

  return (
    <button
      ref={menubuttonRef}
      type='button'
      className={
        'p-link obk-layout-topbar-button obk-layout-menu-button-' +
        (layoutState.staticMenuDesktopInactive ? 'inactive' : 'active')
      }
      onClick={onMenuToggle}
    >
      <i className='pi pi-bars' />
    </button>
  )
})

AppTopbar.displayName = 'AppTopbar'

export default AppTopbar
