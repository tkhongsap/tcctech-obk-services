import { hookstate, useHookstate } from '@hookstate/core';

export type ResidentialAuthState = {
    token: string | null
    expiresIn: number
}

const residentialAuthenState = hookstate<ResidentialAuthState>({
    token: null,
    expiresIn: 0
})

export const residentialAuthenUseState = () => useHookstate(residentialAuthenState)

export default residentialAuthenState