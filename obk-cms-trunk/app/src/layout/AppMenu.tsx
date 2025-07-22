import React, { useCallback, useEffect, useState } from 'react'
import AppMenuitem from './AppMenuitem'
import { MenuProvider } from './context/menucontext'
import { AppMenuItem } from '@src/types'
import { version } from '../../package.json'
import SvgObLogoMenu from '@assets/svg/ob-logo-menu.svg'
import { useLogout } from '@refinedev/core'
import { KeyValue } from '@src/types/key-value'
import { Dropdown } from 'primereact/dropdown'
import { menuService } from '@src/services/menu/service'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import { CSID } from '@src/authProvider/constants'

type Props = {
  menuItems: AppMenuItem[]
  loading: boolean
  userId: string
}

const AppMenu = (props: Props) => {
  const { mutate: logout } = useLogout()
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [tenantDropdown, setTenantDropdown] = useState<KeyValue[]>([])
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  const [isInitialTenantSet, setIsInitialTenantSet] = useState(false)

  const fetchTenantData = useCallback(() => {
    if (!props.userId) return

    menuService.getCliteSiteById(props.userId).then((res) => {
      if (Array.isArray(res.data)) {
        const tenantData = res.data.map((tenant) => ({
          name: tenant.name,
          value: tenant.csid,
        }))

        setTenantDropdown(tenantData)

        const DEFAULT_TENANT_ID = '3075169a-bb4c-463f-a602-dac99228ceac'
        const cookieTenant = getCookie(CSID)
        const isInitialized = getCookie('CSID_INITIALIZED')

        let selected: string | null = null

        if (!isInitialized) {
          const defaultTenant = tenantData.find(
            (t) => t.value === DEFAULT_TENANT_ID
          )

          if (defaultTenant) {
            selected = defaultTenant.value
          } else if (tenantData.length > 0) {
            selected = tenantData[0].value
          }

          if (selected) {
            setCookie(CSID, selected, { maxAge: 60 * 60, path: '/' })
            setCookie('CSID_INITIALIZED', 'true', {
              maxAge: 60 * 60 * 24 * 30,
              path: '/',
            })
          }
        } else {
          const match = tenantData.find((t) => t.value === cookieTenant)
          selected = match?.value ?? tenantData[0]?.value ?? null
        }

        setSelectedTenant(selected)
        setIsInitialTenantSet(true)
      } else {
        console.error('Unexpected API Response:', res.data)
      }
    })
  }, [props.userId])

  const onClientSiteChange = (csid: string) => {
    setCookie(CSID, csid, { maxAge: 60 * 60, path: '/' })
    setSelectedTenant(csid)
    window.location.reload()
  }

  useEffect(() => {
    fetchTenantData()
  }, [fetchTenantData])

  const logoutMenu: AppMenuItem = {
    id: '99',
    label: '',
    to: '',
    items: [
      {
        id: 'logout',
        label: 'Logout',
        header: 'Logout',
        iconName: 'SvgLogout',
        command: () => {
          deleteCookie(CSID, { path: '/' })
          deleteCookie('CSID_INITIALIZED', { path: '/' })

          logout()
        },
      },
    ],
  }

  return (
    <MenuProvider>
      <div className='border-bottom-1 border-gray-400 pb-3 mb-3'>
        <SvgObLogoMenu width={192} />
      </div>
      <div
        className='flex flex-column justify-content-between'
        style={{ marginBottom: '75px' }}
      >
        {props.loading ? (
          <></>
        ) : (
          <>
            <div>
              <Dropdown
                name='tenantId'
                value={selectedTenant}
                onChange={(e) => onClientSiteChange(e.value)}
                options={tenantDropdown}
                optionLabel='name'
                optionValue='value'
                className='w-full'
                placeholder='Select Tenant'
                disabled={tenantDropdown.length === 0}
              />
            </div>
            <hr className='my-3 border-gray-300' />
            <ul className='layout-menu'>
              {props.menuItems.map((item, i) => {
                return !item?.seperator ? (
                  <AppMenuitem item={item} root={true} index={i} key={i} />
                ) : (
                  <li className='menu-separator'></li>
                )
              })}
            </ul>
          </>
        )}
      </div>
      <div
        className='fixed bg-white bottom-0 logout-menu-wrapper'
        style={{ paddingBottom: '25px', width: '250px' }}
      >
        <ul className='layout-menu logout-menu '>
          <AppMenuitem key={99} root={true} item={logoutMenu} />
          <div className='text-xs'>
            v{process.env.REACT_APP_VERSION ?? version}
          </div>
        </ul>
      </div>
    </MenuProvider>
  )
}

export default AppMenu
