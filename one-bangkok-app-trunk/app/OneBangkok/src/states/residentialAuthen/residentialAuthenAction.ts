import AsyncStorage from '@react-native-async-storage/async-storage';
import residentialAuthenState, { ResidentialAuthState } from './residentialAuthenState';

const tokenKey = 'residential.token'

const getPersistState = async (): Promise<ResidentialAuthState | null> => {
    const item = await AsyncStorage.getItem(tokenKey)
    if (item === null) return null
    const { token, expiresIn } = JSON.parse(item) as ResidentialAuthState
    // update hook state
    residentialAuthenState.token.set(token)
    residentialAuthenState.expiresIn.set(expiresIn)
    return { token, expiresIn }
}

const residentialAuthenAction = {
    storeToken: async ({ token, expiresIn }: ResidentialAuthState) => {
        residentialAuthenState.token.set(token)
        residentialAuthenState.expiresIn.set(expiresIn)
        await AsyncStorage.setItem(tokenKey, JSON.stringify({ token, expiresIn }))
    },
    getToken: async (): Promise<string | null> => {
        if (residentialAuthenState.token.value) return residentialAuthenState.token.value
        const persistState = await getPersistState()
        if (persistState) return persistState.token
        return null
    },
    removeToken: () => {
        residentialAuthenState.token.set(null)
        residentialAuthenState.expiresIn.set(0)
        AsyncStorage.removeItem(tokenKey)
    },
    validToken: async (): Promise<boolean> => {
        const now = Date.now()
        if (residentialAuthenState.token.value) return residentialAuthenState.expiresIn.value > now
        const persistState = await getPersistState()
        if (persistState) return persistState.expiresIn > now
        return false
    }
}

export default residentialAuthenAction