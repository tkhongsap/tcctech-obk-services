import {hookstate} from '@hookstate/core';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {Message} from '~/features/residential/components/LiveChatMessages';
import * as ImagePicker from 'react-native-image-picker';

export type TRawFailedMessage = {
  rawData?: {
    doc?: DocumentPickerResponse;
    image?: ImagePicker.Asset;
  };
};
export type TSendFailedMessage = Message & TRawFailedMessage;
const failedLiveChatsState = hookstate<TSendFailedMessage[] | null>(null);

export {failedLiveChatsState};
