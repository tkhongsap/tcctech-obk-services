import { usePermissions } from '@refinedev/core'
import { IPrivilegeItem } from '@src/services/role/model'
import React, { useContext } from 'react'

type PermissionContextDefualt = {
  checkAccess: (code: string) => boolean
}

const PermissionContext = React.createContext<PermissionContextDefualt>({
  checkAccess: () => false,
})

export function usePermission() {
  return useContext(PermissionContext)
}

type Props = {
  children: React.ReactNode
}

export default function PermissionContextProvider(props: Props) {
  const { data } = usePermissions<IPrivilegeItem[]>()

  function checkAccess(code: string) {
    if (data) {
      console.log(
        code,
        data.some((x) => x.code === code)
      )
      return data.some((x) => x.code === code)
    }
    return false
  }

  const value = {
    checkAccess,
  }

  return (
    <PermissionContext.Provider value={value}>
      {props.children}
    </PermissionContext.Provider>
  )
}
