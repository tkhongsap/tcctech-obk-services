import AsyncStorage from '@react-native-async-storage/async-storage';
import {failedLiveChatsState, TSendFailedMessage} from './liveChatState';

type TFailedLiveChatStorage = {
  chats: TSendFailedMessage[];
};

const FAILED_LIVE_CHAT_KEY = 'FAILED_LIVE_CHAT_KEY';

const getFailedLiveChatsStorage = async () => {
  const response = await AsyncStorage.getItem(FAILED_LIVE_CHAT_KEY);
  if (!response) return [];
  const {chats} = JSON.parse(response) as TFailedLiveChatStorage;
  return chats;
};
const setFailedLiveChatsStorage = async ({chats}: TFailedLiveChatStorage) => {
  await AsyncStorage.setItem(FAILED_LIVE_CHAT_KEY, JSON.stringify({chats}));
};

const liveChatAction = {
  getFailedLiveChats: async (): Promise<TSendFailedMessage[]> => {
    const chatsState = failedLiveChatsState.value;
    if (chatsState) return chatsState as TSendFailedMessage[];

    const chatsStorage = await getFailedLiveChatsStorage();
    failedLiveChatsState.set(chatsStorage);
    return chatsStorage;
  },
  setFailedLiveChats: async (chats: TSendFailedMessage[]) => {
    failedLiveChatsState.set(chats);
    await setFailedLiveChatsStorage({chats});
  },
};

export default liveChatAction;
