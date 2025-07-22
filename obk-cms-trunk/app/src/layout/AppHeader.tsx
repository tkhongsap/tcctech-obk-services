'use client'
import React, { useEffect, useState } from 'react'
import { useLayoutContext } from './context/layoutcontext'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'

const AppHeader = () => {
  const pathname = usePathname()
  const router = useRouter()
  const {
    currentMenuItem,
    debouncedCurrentMenuItem,
    menuName,
    setMenuName,
    menuAction,
    setMenuAction,
  } = useLayoutContext()
  const breadcrumb = currentMenuItem?.breadcrumb?.map((x) => {
    return { label: x }
  })

  const isShowBackBtn =
    pathname &&
    (pathname.includes('/show') ||
      pathname.includes('/create') ||
      pathname.includes('/edit') ||
      pathname.includes('/staff-by-componant') ||
      pathname.includes('/all-staff'))

  const [menuState, setMenuState] = useState<number>(0)
  const [isFirst, setIsFirst] = useState<boolean>(true)

  useEffect(() => {
    setMenuAction(null)
    setMenuState(() => 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!isFirst) {
      setMenuState((pre) => pre + 1)
    }
    setIsFirst(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuName])

  useEffect(() => {
    if (currentMenuItem && menuState == 0) {
      setMenuName(currentMenuItem?.header ?? '')
      setMenuState(() => 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCurrentMenuItem, setMenuName])

  const getBreadcrumb = () => {
    if (isShowBackBtn) {
      return (
        <a
          className='text-sm font-medium cursor-pointer'
          style={{ color: '#707EAE' }}
          onClick={() => router.back()}
        >
          &#60; Back
        </a>
      )
    }
    return (
      breadcrumb &&
      breadcrumb.length > 0 &&
      breadcrumb.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <span className='text-sm font-medium' style={{ color: '#707EAE' }}>
              {item.label}
            </span>
            {i != breadcrumb.length - 1 && (
              <span
                className='text-sm font-medium'
                style={{ color: '#707EAE' }}
              >
                {' '}
                /{' '}
              </span>
            )}
          </React.Fragment>
        )
      })
    )
  }

  return (
    <>
      {getBreadcrumb()}
      {(menuName || menuAction) && (
        <div className='flex flex-wrap flex-column md:flex-row align-items-center justify-content-between mb-5'>
          {menuName && (
            <div className='flex align-items-center'>
              <h2
                className='text-4xl font-bold text-primary-900'
                style={{ color: '#2B3674', fontSize: '34px' }}
              >
                {menuName}
              </h2>
            </div>
          )}
          <div className='flex align-items-center justify-contents-end'>
            {menuAction && menuAction}
          </div>
        </div>
      )}
    </>
  )
}

export default AppHeader
