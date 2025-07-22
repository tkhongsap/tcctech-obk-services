import {components} from './openapi_interfaces';
export type schemas = components['schemas'];

export type ProviderType = schemas['Provider'];
export type Setting = schemas['Setting'];
export type Identity = schemas['LoginAuthRequestBody']['identity'];
export type Gender = schemas['Profile']['gender'];
export type IdentitiesData = schemas['IdentitiesData'];
