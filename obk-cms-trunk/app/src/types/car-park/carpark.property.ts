import { PropertiesResponse } from 'ob-parking-sdk/dist/api'

export type PropertySchema = Omit<PropertiesResponse, 'id'>
