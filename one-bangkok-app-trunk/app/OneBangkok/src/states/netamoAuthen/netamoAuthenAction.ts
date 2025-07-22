import AsyncStorage from '@react-native-async-storage/async-storage';
import netamoAuthenState, { NetamoAuthState } from './netamoAuthenState';

const tokenKey = 'netamo.token'

const getPersistState = async (): Promise<NetamoAuthState | null> => {
    const item = await AsyncStorage.getItem(tokenKey)
    if (item === null) return null
    const { token, expiresIn } = JSON.parse(item) as NetamoAuthState
    // update hook state
    netamoAuthenState.token.set(token)
    netamoAuthenState.expiresIn.set(expiresIn)
    return { token, expiresIn }
}

const netamoAuthenAction = {
    storeToken: async ({ token, expiresIn }: NetamoAuthState) => {
        netamoAuthenState.token.set(token)
        netamoAuthenState.expiresIn.set(expiresIn)
        await AsyncStorage.setItem(tokenKey, JSON.stringify({ token, expiresIn }))
    },
    getToken: async (): Promise<string | null> => {
        if (netamoAuthenState.token.value) return netamoAuthenState.token.value
        const persistState = await getPersistState()
        if (persistState) return persistState.token
        return null
    },
    removeToken: () => {
        netamoAuthenState.token.set(null)
        netamoAuthenState.expiresIn.set(0)
        AsyncStorage.removeItem(tokenKey)
    },
    validToken: async (): Promise<boolean> => {
        const now = Date.now()
        if (netamoAuthenState.token.value) return netamoAuthenState.expiresIn.value > now
        const persistState = await getPersistState()
        if (persistState) return persistState.expiresIn > now
        return false
    }
}

export default netamoAuthenAction