import {components} from './openapi_interfaces';
export type schemas = components['schemas'];
export type MessageData = schemas['GetMessageData'];
export type Content = schemas['MessageData'];
export type notificationData = components['schemas']['FineAllMessageData'];
