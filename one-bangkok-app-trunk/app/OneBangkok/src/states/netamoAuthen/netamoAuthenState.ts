import { hookstate, useHookstate } from '@hookstate/core';

export type NetamoAuthState = {
    token: string | null
    expiresIn: number
}

const netamoAuthenState = hookstate<NetamoAuthState>({
    token: null,
    expiresIn: 0
})

export const netamoAuthenUseState = () => useHookstate(netamoAuthenState)

export default netamoAuthenState