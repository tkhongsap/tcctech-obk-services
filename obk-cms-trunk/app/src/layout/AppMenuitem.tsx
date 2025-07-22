'use client'
import Link from 'next/link'
import { Ripple } from 'primereact/ripple'
import { classNames } from 'primereact/utils'
import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useMenuContext } from './context/menucontext'
import { AppMenuItemProps } from '@src/types'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLayoutContext } from './context/layoutcontext'
import { useRouter } from 'next/router'
import { AppMenuItem } from './menu'

const AppMenuitem = (props: AppMenuItemProps) => {
  const rawPathname = usePathname()
  const router = useRouter()
  const { id } = router.query
  const pathname = rawPathname
    ? rawPathname
        .split('/')
        .map((x, i) => (x === id ? `{slug${i}}` : x))
        .join('/')
    : ''
  const searchParams = useSearchParams()
  const { activeMenu, setActiveMenu } = useMenuContext()
  const { currentMenuItem, setCurrentMenuItem } = useLayoutContext()
  const item = new AppMenuItem(props.item!)
  const key = props.parentKey
    ? props.parentKey + '/' + item!.id
    : String(item!.id)
  const active =
    activeMenu === key ||
    activeMenu.startsWith(key + '/') ||
    activeMenu?.split('/').includes(item!.id)
  const replaceSlugWithPrefix = (x: string, i: number) =>
    x.startsWith(':') ? `{slug${i}}` : x
  const isActiveRoute =
    (item!.to && pathname === item!.to) ||
    (item!.to &&
      pathname === item!.to?.split('/').map(replaceSlugWithPrefix).join('/')) ||
    activeMenu?.split('/').includes(item!.id)
  const onRouteChange = (url: string) => {
    if (
      (item!.to && item!.to === url) ||
      (item!.to &&
        pathname === item!.to?.split('/').map(replaceSlugWithPrefix).join('/'))
    ) {
      setActiveMenu(key)
      setCurrentMenuItem(item)
    }
  }

  const isChildActiveRoute = () => {
    return currentMenuItem?.parentsId?.includes(item.id)
  }

  useEffect(() => {
    onRouteChange(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  const itemClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    //avoid processing disabled items
    if (item!.disabled) {
      event.preventDefault()
      return
    }

    //execute command
    if (item!.command) {
      item!.command({ originalEvent: event, item: item })
    }

    // toggle active state
    if (item!.items && item?.items.some((x) => x.visible))
      setActiveMenu(active ? (props.parentKey as string) : key)
    else setActiveMenu(key)
  }

  const subMenu = item!.items && item!.visible !== false && (
    <CSSTransition
      timeout={{ enter: 1000, exit: 450 }}
      classNames='layout-submenu'
      in={props.root ? true : active}
      key={item!.id}
    >
      <ul>
        {item!.items.map((child, i) => {
          return (
            <AppMenuitem
              item={child}
              index={i}
              className={child.badgeClass}
              parentKey={key}
              key={i}
            />
          )
        })}
      </ul>
    </CSSTransition>
  )

  return (
    <li
      className={classNames({
        'layout-root-menuitem': props.root,
        'active-menuitem': active,
      })}
    >
      {props.root &&
        item!.visible !== false &&
        (item!.label ?? (
          <div className='layout-menuitem-root-text'>{item!.label}</div>
        ))}
      {(!item!.to || (item!.items && item!.items?.some((x) => x.visible))) &&
      item!.visible !== false ? (
        <a
          href={item!.url}
          onClick={(e) => itemClick(e)}
          className={classNames(item!.class, 'p-ripple', {
            'active-route': isChildActiveRoute(),
          })}
          tabIndex={0}
        >
          {item?.iconSvg && <item.iconSvg className='mr-2' />}
          {item?.icon && (
            <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
          )}
          <span className='layout-menuitem-text'>{item!.label}</span>
          {item!.items && item!.items.some((x) => x.visible) && (
            <i className='pi pi-fw pi-angle-down layout-submenu-toggler'></i>
          )}
          <Ripple />
        </a>
      ) : null}

      {item!.to &&
      (!item!.items || item?.items.every((x) => !x.visible)) &&
      item!.visible !== false ? (
        <Link
          href={item!.to}
          replace={item!.replaceUrl}
          onClick={(e) => itemClick(e)}
          className={classNames(item!.class, 'p-ripple', {
            'active-route': isActiveRoute,
          })}
          tabIndex={0}
        >
          {item?.iconSvg && <item.iconSvg className='mr-2' fill={'none'} />}
          {item?.icon && (
            <i className={classNames('layout-menuitem-icon', item!.icon)}></i>
          )}
          <span className='layout-menuitem-text'>{item!.label}</span>
          {item!.items && item!.items.some((x) => x.visible) && (
            <i className='pi pi-fw pi-angle-down layout-submenu-toggler'></i>
          )}
          <Ripple />
        </Link>
      ) : null}

      {subMenu}
    </li>
  )
}

export default AppMenuitem
