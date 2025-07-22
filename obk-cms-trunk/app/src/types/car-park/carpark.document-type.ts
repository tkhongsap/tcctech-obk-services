import { ConfigDocsTypeResponse } from 'ob-parking-sdk/dist/api'

export type DocumentTypeSchema = Omit<ConfigDocsTypeResponse, 'id'>
