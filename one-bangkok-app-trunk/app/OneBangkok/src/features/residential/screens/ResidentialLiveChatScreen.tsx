import {
  Dimensions,
  NativeScrollEvent,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Keyboard,
  RefreshControl,
  KeyboardAvoidingView,
  Alert,
  FlatList,
  ViewToken,
  Linking,
} from 'react-native';
import {ScreenContainer} from '../components';
import {Icon, Spacing, Text} from '~/components/atoms';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Header} from '../components/Header';
import authenState from '~/states/authen/authenState';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {
  failedLiveChatMessages,
  liveChatAccessToken,
  Tenant,
} from '~/states/residentialTenant/residentialTenantState';
import {TextInput} from '../components/AddToMicro/TextInput';
import {modalActions} from '../components/ResidentialModal';
import ConfirmDeleteLiveChatMessageModal from '../components/ConfirmDeleteLiveChatMessageModal';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import Config from 'react-native-config';
import LiveChatAttachPhotoModal from '../components/LiveChatAttachPhotoModal';
import * as ImagePicker from 'react-native-image-picker';
import LiveChatMessages, {
  EntityType,
  Message,
  MessageState,
} from '../components/LiveChatMessages';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LiveChatRetryModal from '../components/LiveChatRetryModal';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {uuidv4} from 'react-native-compressor';
import {logScreenView} from '~/utils/logGA';

type Channel =
  | 'client/init-chat-with-concierge'
  | 'client/get-chat-session'
  | 'client/ping-on-chat-session'
  | `client/get-chat-messages?${string}`
  | 'client/send-message'
  | `chat-message-${string}`
  | 'client/delete-message'
  | 'client/end-chat-with-concierge'
  | 'client/update-message-seen-at'
  | 'client/get-unread-msg-count'
  | `chat-session-update-${string}`
  | 'chat-message-delete';

type ResidentialProfile = {
  firstName: string;
  lastName: string;
  gender: string;
  idcard: string;
  passport: string;
  note: string;
  cardNumber: string;
  isActive: boolean;
  emails: {email: string; isActive: boolean}[];
  phones: {
    countryCode: string;
    phoneNumber: string;
    isActive: boolean;
  }[];
};
type PropertyOwnerProfile = {
  firstName: string;
  lastName: string;
  isActive: boolean;
};
type Paginate = {
  per_page: number;
  offset: number;
  page: number;
};
type ChatSession = {
  id: string;
  orgId: string;
  chatSessionId: string;
  chatInitiatedByEntityType: EntityType;
  chatInitiatedByEntityId: string;
  lastPingedByChatInitiator: string;
  chatJoinedByEntityType: EntityType;
  chatJoinedByEntityId: string;
  lastPingedByChatJoiner: string;
  isSessionClosed: boolean;
};
type Connection = {
  id: string;
  connectionId: string;
  entityType: string;
  entityId: string;
  deviceId: string;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
  orgId: string;
};
type InitChatResponseBody = {
  chatSessionId: string;
  chatSession: ChatSession;
  connection: Connection;
  tenant: Tenant & {
    residentProfile: ResidentialProfile;
    propertyOwnerProfile: PropertyOwnerProfile;
  };
};
type GetChatResponseBody = {
  chatSessionId: string;
  chatSession: ChatSession;
  connection: Connection;
  tenant: Tenant & {
    residentProfile: ResidentialProfile;
    propertyOwnerProfile: PropertyOwnerProfile;
  };
};
type ChatMessagesResponseBody = {
  messages: Message[];
  paginate: Paginate;
};
type NewChatMessageResponseBody = {
  chatSessionId: string;
  chatMessage: Message;
};
type NewBackedChatMessageResponse = {
  actions: [];
  channel: Channel;
  payload: {
    chatSessionId: string;
    chatMessage: Message;
  };
  receiverId: string;
  receiverType: EntityType;
  senderId: string;
  senderType: EntityType;
  socketMessageId: string;
};
type GetUnreadMessageCountResponseBody = {
  unreadMsgCount: number;
};
type DeleteMessageResponseBody = {
  messageId: string;
};
type SendToWs = {
  channel: Channel;
  body: {[key: string]: any};
};
type GetMessages = {
  chatSessionId: string;
  page: number;
  limit: number;
};
type TSendImage = {
  image: ImagePicker.Asset;
  metadata: any;
  retryRemain: number;
};
type TSendFile = {
  doc: DocumentPickerResponse;
  metadata: any;
  retryRemain: number;
};
type ImageDimension = {
  width: number;
  height: number;
};
type TSendText = {
  message: Message;
  retryRemain: number;
};
type FailedMessage = Message & {
  image: ImagePicker.Asset;
  doc: DocumentPickerResponse;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialLiveChatScreen'
>;

const defaultPaginate: Paginate = {
  per_page: 10,
  offset: 0,
  page: 1,
};

const wsUri = Config.LIVE_CHAT_URL;
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const UPLOAD_FILE_MAX_SIZE = 83886080; // byte => (80 mb)
const UPLOAD_FILE_MAX_SIZE_MB = 80; // byte => (80 mb)
const RETRY_SEND_MESSAGE_MAX = 1;
const MAX_FILE_SELECTED = 20;
const INPUT_BOX_MAX_HEIGHT = 205.8;
const INPUT_BOX_MAX_LINE = 9;

const ResidentialLiveChatScreen = ({
  route: {
    params: {conciergeAvatar},
  },
}: Props) => {
  const navigation = useNavigation();
  const deviceId = authenState.deviceId.value;
  const ws = useRef<WebSocket>();
  const pingChatSessionIntervalRef = useRef<number>();
  const scrollViewRef = useRef<FlatList>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatSessionId, setChatSessionId] = useState<string>();
  const [chatSession, setChatSession] = useState<ChatSession>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [paginate, setPaginate] = useState<Paginate>(defaultPaginate);
  const [currentPaginateItemLength, setCurrentPaginateItemLength] =
    useState<number>(defaultPaginate.per_page);
  const [residentProfile, setResidentProfile] = useState<ResidentialProfile>();
  const [newMessage, setNewMessage] = useState<string>();
  const [isLoadingPrevMessages, setIsLoadingPrevMessages] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentViewItemIndex, setCurrentViewItemIndex] = useState(0);
  let retryConnectWSRemain = 2;

  const gapBetweenKeyboardAndMessage = useMemo(() => {
    if (currentViewItemIndex !== messages.length - 1) return 0;
    const gapPerLineMsg = Math.floor(
      INPUT_BOX_MAX_HEIGHT / (INPUT_BOX_MAX_LINE + 5),
    );
    const lineMsgCount = newMessage?.split('\n').length ?? 0;
    const gap =
      gapPerLineMsg *
      (lineMsgCount > INPUT_BOX_MAX_LINE ? INPUT_BOX_MAX_LINE : lineMsgCount);
    if (!isKeyboardVisible) return gap;
    return screenHeight / 2.5 + gap;
  }, [newMessage, isKeyboardVisible, currentViewItemIndex]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (chatSessionId) endChatSession(chatSessionId);
      if (ws.current) ws.current.close();
      if (pingChatSessionIntervalRef.current) {
        clearInterval(pingChatSessionIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chatSessionId) {
      if (ws.current) ws.current.onmessage = handleOnMessage;
      pingChatSessionIntervalRef.current = setInterval(() => {
        pingChatSession(chatSessionId);
      }, 30000);
    }
  }, [chatSessionId]);

  useEffect(() => {
    if (isPickingImage) {
      setTimeout(() => handleImagePicker(), 400);
    }
  }, [isPickingImage]);

  useEffect(() => {
    if (isTakingPhoto) {
      setTimeout(() => handleTakingPhoto(), 400);
    }
  }, [isTakingPhoto]);

  useEffect(() => {
    logScreenView('ResidentialLiveChatScreen');
  }, []);

  const onPressBack = () => {
    storeSendingOrFailedMessages();
    chatSessionId && endChatSession(chatSessionId);
    navigation.goBack();
  };

  const storeSendingOrFailedMessages = () => {
    try {
      const sendingOrFailedMessages = messages.filter(
        msg =>
          msg.state === MessageState.SENDING ||
          msg.state === MessageState.FAILED,
      );
      const failedMessages = sendingOrFailedMessages.map(msg => ({
        ...msg,
        state: MessageState.FAILED,
      }));
      if (failedMessages.length > 0) {
        failedLiveChatMessages.set(
          failedMessages.map(msg => JSON.stringify(msg)),
        );
      }
    } catch (error) {}
  };

  const getAccessToken = async () => {
    if (
      liveChatAccessToken.value !== null &&
      residentialTenantAction.validLiveChatAccessToken()
    ) {
      return liveChatAccessToken.value.accessToken;
    }
    const {data} = await serviceMindService.liveChatToken();
    liveChatAccessToken.set(data);
    return data.accessToken;
  };

  const connectWebSocket = async () => {
    try {
      const accessToken = await getAccessToken();
      const uri = `${wsUri}?Auth=${accessToken}&deviceId=${deviceId}`;
      console.log(`<== [CONNECTING]\t| ${new Date()}`);
      ws.current = new WebSocket(uri);
      ws.current.onopen = handleOnOpen;
      ws.current.onmessage = handleOnMessage;
      ws.current.onerror = handleOnError;
      ws.current.onclose = handleOnClose;
    } catch (error) {
      console.log('ERROR => ', error);
      if (!authenState.token.value) {
        navigation.reset({routes: [{name: 'SignInScreen'}]});
      } else {
        navigateToErrorScreen();
      }
    }
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'residentialHomeScreen',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('ResidentialHomeScreen'),
    });
  };

  const sendToWs = ({channel, body}: SendToWs) => {
    console.log(`<== [SEND]\t| ${new Date()} | Channel: ${channel}`);
    ws.current?.send(
      JSON.stringify({
        action: 'api',
        data: {
          route: channel,
          body,
        },
      }),
    );
  };

  const handleOnOpen = async () => {
    console.log(`==> [CONNECTED]\t| ${new Date()}`);
    setIsConnected(true);
    const oldChatSessionId =
      await residentialTenantAction.getLiveChatSessionId();

    if (oldChatSessionId) {
      console.log('### --> Use old session');
      getOldChatSession(oldChatSessionId);
    } else {
      console.log('### --> Create new session');
      initNewChatSession();
    }
  };

  const handleOnMessage = (event: WebSocketMessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log(
        `==> [RECEIVE]\t| ${new Date()} | Channel: ${data.channel} | Status: ${
          data.status
        }`,
      );

      const channel = data.channel as Channel;
      if (channel === 'client/init-chat-with-concierge') {
        handleInitChatSessionResp(data.body);
      } else if (channel === 'client/send-message') {
        handleNewMessageResp(data.body);
      } else if (channel === 'client/get-chat-session') {
        handleGetOldChatSessionResp(data.body);
      } else if (channel.includes('client/get-chat-messages?')) {
        handleGetMessagesResp(data.body);
      } else if (channel === 'client/delete-message') {
        handleUnsentMessageResp(data.body);
      } else if (channel === 'client/end-chat-with-concierge') {
        console.log('client/end-chat-with-concierge => ', data.body);
      } else if (channel === `chat-message-${chatSessionId}`) {
        console.log(`chat-message-${chatSessionId} => `, data);
        const resp = data as NewBackedChatMessageResponse;
        if (resp.senderType === 'BACKEND_USER') {
          handleNewChatMessageFromBackend(resp.payload.chatMessage);
        }
      } else if (channel === 'client/get-unread-msg-count') {
        handleGetUnreadMessageCountResp(data.body);
      } else if (channel === `chat-session-update-${chatSessionId}`) {
        console.log(`chat-session-update-${chatSessionId} => `, data.body);
      } else if (channel === 'chat-message-delete') {
        const id = data.payload.messageId;
        console.log('chat-message-delete => ', data.payload.messageId);
        handleBackedDeleteMessage(typeof id === 'number' ? id.toString() : id);
      }
    } catch (error) {
      chatSessionId && endChatSession(chatSessionId);
      navigateToErrorScreen();
    }
  };

  const handleOnError = (event: WebSocketErrorEvent) => {
    console.log(`==> [ERROR]\t| ${new Date()} | ${JSON.stringify(event)}`);
    retryConnectWSRemain--;
    if (retryConnectWSRemain >= 1) {
      connectWebSocket();
    } else {
      navigateToErrorScreen();
    }
  };

  const handleOnClose = (event: WebSocketCloseEvent) => {
    console.log(`==> [CLOSED]\t| ${new Date()} | ${JSON.stringify(event)}`);
  };

  const initNewChatSession = () => {
    sendToWs({
      channel: 'client/init-chat-with-concierge',
      body: {newSession: true},
    });
  };

  const handleInitChatSessionResp = (data: InitChatResponseBody) => {
    setChatSessionId(data.chatSessionId);
    setResidentProfile(data.tenant.residentProfile);
    setChatSession(data.chatSession);
    getMessages({
      chatSessionId: data.chatSessionId,
      page: paginate.page,
      limit: paginate.per_page,
    });
    residentialTenantAction.setLiveChatSessionId(data.chatSessionId);
  };

  const getOldChatSession = (chatSessionId: string) => {
    sendToWs({
      channel: 'client/get-chat-session',
      body: {
        chatSessionId,
      },
    });
  };

  const handleGetOldChatSessionResp = (data: GetChatResponseBody) => {
    if (!data.chatSession.isSessionClosed) {
      continueWithOldChatSession(data.chatSessionId);
    } else {
      initNewChatSession();
    }
  };

  const continueWithOldChatSession = (chatSessionId: string) => {
    sendToWs({
      channel: 'client/init-chat-with-concierge',
      body: {
        newSession: false,
        chatSessionId,
      },
    });
  };

  const pingChatSession = (chatSessionId: string) => {
    sendToWs({channel: 'client/ping-on-chat-session', body: {chatSessionId}});
  };

  const handleBackedDeleteMessage = (messageId: string) => {
    setMessages(prev => {
      const updatedMessages = [...prev];
      const index = updatedMessages.findIndex(
        e => e.id === messageId && e.senderEntityType === 'BACKEND_USER',
      );
      if (index === -1) return updatedMessages;
      return updatedMessages.filter(e => e.id !== messageId);
    });
  };

  const handleNewMessageResp = async (data: NewChatMessageResponseBody) => {
    const message = data.chatMessage;
    let imageHeight = 0;
    let imageWidth = 0;
    if (message.contentType === 'IMAGE') {
      if (message?.metadata?.width && message?.metadata?.height) {
        imageWidth = message.metadata.width;
        imageHeight = message.metadata.height;
      } else {
        const {width, height} = await getImageDimension(message.messageContent);
        imageWidth = width;
        imageHeight = height;
      }
    }

    setMessages(prev => {
      const preSentMessageIndex = prev.findIndex(
        msg => msg.metadata?.key === message.metadata?.key,
      );
      const newMessages = [...prev];
      if (preSentMessageIndex !== -1) {
        // update pre sent message
        newMessages[preSentMessageIndex] = {
          ...newMessages[preSentMessageIndex],
          ...message,
          imageHeight,
          imageWidth,
          state: undefined,
          messageContent:
            message.contentType === 'FILE'
              ? message.messageContent
              : newMessages[preSentMessageIndex].messageContent,
        };
      } else {
        newMessages.push({...message, imageHeight, imageWidth});
      }
      return newMessages;
    });
    setTimeout(() => scrollToEnd(), 500);
  };

  const getMessages = ({chatSessionId, page, limit}: GetMessages) => {
    sendToWs({
      channel: `client/get-chat-messages?page=${page}&limit=${limit}`,
      body: {chatSessionId},
    });
  };

  const handleGetMessagesResp = async ({
    messages,
    paginate,
  }: ChatMessagesResponseBody) => {
    // get unread messages and update
    const unreadMessages = messages.filter(e => isUnreadMessage(e));
    const now = Date.now().toString();
    // update state
    messages = await Promise.all(
      messages.map(async e => {
        if (e.contentType === 'IMAGE') {
          if (e.senderEntityType === 'TENANT') {
            e.imageWidth = e.metadata.width;
            e.imageHeight = e.metadata.height;
          } else {
            const {width, height} = await getImageDimension(e.messageContent);
            e.imageWidth = width;
            e.imageHeight = height;
          }
        } else if (e.contentType === 'FILE') {
          if (e.senderEntityType === 'BACKEND_USER') {
            const fileSize = await getFileUrlStat(e.messageContent);
            const filename = e.metadata.file.name;
            e.metadata = {
              ...e.metadata,
              filename,
              fileSize,
            };
          }
        }
        if (isUnreadMessage(e)) e.seenAt = now;
        return e;
      }),
    );
    // add failed messages
    const failedMessages = failedLiveChatMessages.value;
    if (failedMessages !== null) {
      messages = messages.concat(failedMessages.map(msg => JSON.parse(msg)));
      failedLiveChatMessages.set(null);
    }

    setMessages(prev => uniqueMessages(messages.concat(prev)));
    setPaginate(paginate);
    setCurrentPaginateItemLength(messages.length);

    // update to db
    markAsSeenMessages(unreadMessages);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const uniqueMessages = (messages: Message[]) => {
    const uniqueIds = Array.from(new Set(messages.map(msg => msg.id)).values());
    return uniqueIds
      .map(id => messages.find(msg => msg.id === id))
      .filter(msg => msg !== undefined);
  };

  const isUnreadMessage = (message: Message) => {
    return (
      message.senderEntityType === 'BACKEND_USER' && message.seenAt === null
    );
  };

  const endChatSession = (chatSessionId: string) => {
    sendToWs({
      channel: 'client/end-chat-with-concierge',
      body: {chatSessionId},
    });
    residentialTenantAction.removeLiveChatSessionId();
  };

  const validNewMessage = useMemo(() => {
    return newMessage !== undefined && newMessage.trim().length !== 0;
  }, [newMessage]);

  const onSendNewMessage = () => {
    try {
      if (!validNewMessage) return;

      const metadata = {
        messageUid: uuidv4(),
        key: `TEXT_${Date.now()}`,
      };
      const messageContent = newMessage ?? '';
      preAddSentMessage({
        messageContent,
        contentType: 'TEXT',
        metadata,
      });
      const retryRemain = RETRY_SEND_MESSAGE_MAX;
      sendText({messageContent, metadata, retryRemain});
    } catch (error) {
    } finally {
      setNewMessage(undefined);
      Keyboard.dismiss();
    }
  };

  const sendText = ({
    messageContent,
    metadata,
    retryRemain,
  }: {
    messageContent: string;
    metadata: any;
    retryRemain: number;
  }) => {
    try {
      sendToWs({
        channel: 'client/send-message',
        body: {
          chatSessionId,
          contentType: 'TEXT',
          messageContent,
          metadata,
        },
      });
    } catch (error) {
      if (retryRemain > 0) {
        retryRemain -= 1;
        sendText({messageContent, metadata, retryRemain});
      } else {
        setMessageToFailedState(metadata.key);
      }
    }
  };

  const retrySendText = ({message, retryRemain}: TSendText) => {
    try {
      const {messageContent, metadata} = message;
      sendToWs({
        channel: 'client/send-message',
        body: {
          chatSessionId,
          contentType: 'TEXT',
          messageContent,
          metadata,
        },
      });
    } catch (error) {
      if (retryRemain > 0) {
        retryRemain -= 1;
        retrySendText({message, retryRemain});
      } else {
        setMessageToFailedState(message.metadata.key);
      }
    }
  };

  const handleNewChatMessageFromBackend = async (message: Message) => {
    if (message.contentType === 'IMAGE') {
      const {width, height} = await getImageDimension(message.messageContent);
      message.imageWidth = width;
      message.imageHeight = height;
    } else if (message.contentType === 'FILE') {
      const fileSize = await getFileUrlStat(message.messageContent);
      const filename = message.metadata.file.name;
      message.metadata = {
        ...message.metadata,
        filename,
        fileSize,
      };
    }
    let existMessage: Message | undefined = undefined;
    setMessages(prev => {
      existMessage = prev.find(e => e.id === message.id);
      if (existMessage) return prev;
      return sortMessageBySentAt([...prev, message]);
    });
    if (!existMessage) {
      markAsSeen(message.id);
      setTimeout(() => {
        scrollToEnd();
      }, 400);
    }
  };

  const getFileUrlStat = async (url: string) => {
    try {
      const resp = await ReactNativeBlobUtil.config({fileCache: true}).fetch(
        'GET',
        url,
      );
      return parseInt(resp.respInfo.headers['Content-Length']);
    } catch (error) {
      return null;
    }
  };

  const sortMessageBySentAt = (messages: Message[]) => {
    return messages.sort((a, b) => parseInt(a.seenAt) - parseInt(b.seenAt));
  };

  const markAsSeenMessages = (messages: Message[]) => {
    const ids = messages.map(e => e.id);
    for (const id of ids) {
      markAsSeen(id);
    }
  };

  const markAsSeen = (messageId: string) => {
    sendToWs({
      channel: 'client/update-message-seen-at',
      body: {messageId, chatSessionId},
    });
  };

  const getUnreadMessageCount = () => {
    sendToWs({channel: 'client/get-unread-msg-count', body: {}});
  };

  const handleGetUnreadMessageCountResp = ({
    unreadMsgCount,
  }: GetUnreadMessageCountResponseBody) => {};

  const onLongPress = useCallback(
    (message: Message) => {
      if (message.state === MessageState.FAILED) {
        modalActions.setContent(
          <LiveChatRetryModal
            onPressRetry={() => retryFailedMessage(message as FailedMessage)}
            onPressDelete={() => deleteFailedMessage(message.id)}
          />,
        );
      } else {
        modalActions.setContent(
          <ConfirmDeleteLiveChatMessageModal
            onPressDelete={() => unsendMessage(message.id)}
          />,
        );
      }

      modalActions.show();
    },
    [chatSessionId],
  );

  const retryFailedMessage = (message: FailedMessage) => {
    const retryRemain = RETRY_SEND_MESSAGE_MAX;

    // update state to sending
    setMessages(prev => {
      const updateMessages = [...prev];
      const messageIndex = updateMessages.findIndex(e => e.id === message.id);
      if (messageIndex !== -1) {
        updateMessages[messageIndex] = {
          ...updateMessages[messageIndex],
          state: MessageState.SENDING,
        };
      }
      return updateMessages;
    });

    switch (message.contentType) {
      case 'TEXT':
        retrySendText({message, retryRemain});
        break;

      case 'FILE':
        sendFile({
          doc: message.doc,
          metadata: message.metadata,
          retryRemain,
        });
        break;

      case 'IMAGE':
        sendImage({
          image: message.image,
          metadata: message.metadata,
          retryRemain,
        });
        break;

      case 'VIDEO':
        sendImage({
          image: message.image,
          metadata: message.metadata,
          retryRemain,
        });
        break;
      default:
        break;
    }
  };

  const deleteFailedMessage = (id: string) => {
    setMessages(prev => {
      const updateMessages = [...prev].filter(e => e.id !== id);
      return updateMessages;
    });
  };

  const onPress = useCallback((message: Message) => {
    if (message.contentType === 'TEXT') return;
    navigation.navigate('ResidentialLiveChatPreviewScreen', {message});
  }, []);

  const unsendMessage = (messageId: string) => {
    sendToWs({
      channel: 'client/delete-message',
      body: {
        chatSessionId,
        messageId,
      },
    });
  };

  const handleUnsentMessageResp = ({messageId}: DeleteMessageResponseBody) => {
    setMessages(prev => {
      const updateMessages = [...prev];
      const messageIndex = updateMessages.findIndex(e => e.id === messageId);
      if (messageIndex !== -1) {
        updateMessages[messageIndex] = {
          ...updateMessages[messageIndex],
          status: 0,
        };
      }
      return updateMessages;
    });
  };

  const isCloseToTop = ({contentOffset}: NativeScrollEvent) => {
    return contentOffset.y === 0;
  };

  const onScroll = (event: NativeScrollEvent) => {
    try {
      if (
        isCloseToTop(event) &&
        !isLoading &&
        !isLoadingPrevMessages &&
        messages.length !== 0 &&
        currentPaginateItemLength !== 0
      ) {
        getPrevMessages();
      }
    } catch (error) {}
  };

  const getPrevMessages = () => {
    try {
      if (!chatSessionId) return;

      setIsLoadingPrevMessages(true);
      getMessages({
        chatSessionId,
        page: paginate.page + 1,
        limit: paginate.per_page,
      });
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsLoadingPrevMessages(false);
      }, 400);
    }
  };

  const scrollToEnd = () => {
    scrollViewRef.current &&
      scrollViewRef.current.scrollToEnd({animated: true});
  };

  const handleTakingPhoto = async () => {
    try {
      setIsTakingPhoto(false);
      const permission = await requestCameraPermission();
      if (permission !== 'granted') {
        Alert.alert(
          'Enable Camera',
          'Your camera is currently disabled. To proceed, please grant permission to use your camera',
        );
        return;
      }
      const {assets} = await ImagePicker.launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });
      if (assets && assets?.length > 0) {
        const image = assets[0];
        const {uri, type, fileName, width, height, fileSize} = image;
        const filename = fileName ?? `${Date.now()}.png`;
        const mimeType = type ?? 'image/png';
        const metadata = {
          messageUid: uuidv4(),
          key: `IMAGE_${Date.now()}`,
          filename,
          mimeType,
          width,
          height,
          fileSize,
        };
        preAddSentMessage({
          messageContent: uri ?? '',
          contentType: 'IMAGE',
          metadata,
          image,
        });
        setTimeout(() => scrollToEnd(), 500);
        await sendImage({image, metadata, retryRemain: RETRY_SEND_MESSAGE_MAX});
      }
    } catch (error) {
      console.log('handleTakingPhoto ERROR => ', error);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      return await request(PERMISSIONS.IOS.CAMERA);
    } else {
      return await request(PERMISSIONS.ANDROID.CAMERA);
    }
  };

  const handleImagePicker = async () => {
    try {
      setIsPickingImage(false);
      let permissionStatus: PermissionStatus;
      if (Platform.OS === 'ios') {
        permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      } else {
        permissionStatus = await check(
          Number(Platform.Version) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
      }
      if (
        permissionStatus === RESULTS.UNAVAILABLE ||
        permissionStatus === RESULTS.BLOCKED
      ) {
        Alert.alert(
          t(
            'Residential_Photo_Library_Unavailable',
            'Photo Library Unavailable',
          ),
          t(
            'Residential_Photo_Library_Unavailable_desc',
            'To include photo library images in your \nmessages, change your settings to \nallow One Bangkok to access your \nphotos.',
          ),
          [
            {
              text: t('Residential_Photo_Library_Unavailable_cancel', 'Cancel'),
            },
            {
              text: t(
                'Residential_Photo_Library_Unavailable_open_settings',
                'Open Settings',
              ),
              onPress: () => {
                setTimeout(() => {
                  Linking.openSettings();
                }, 0);
              },
            },
          ],
        );
        return;
      }
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'mixed',
          includeBase64: false,
          selectionLimit: MAX_FILE_SELECTED,
        },
        async response => {
          const {assets} = response;
          if (!assets) return;
          const {fileSize} = assets[0];
          if (fileSize && fileSize > UPLOAD_FILE_MAX_SIZE) {
            alertUploadExceedSizeLimit();
            return;
          }

          const sendImagesData: TSendImage[] = [];
          for (const image of assets) {
            const {uri, type, fileName, width, height, fileSize} = image;
            if (fileSize && fileSize <= UPLOAD_FILE_MAX_SIZE) {
              const filename = fileName ?? `${Date.now()}.png`;
              const mimeType = type ?? 'image/png';
              const metadata = {
                messageUid: uuidv4(),
                key: `IMAGE_${Date.now()}`,
                filename,
                mimeType,
                width,
                height,
                fileSize,
              };
              preAddSentMessage({
                messageContent: uri ?? '',
                contentType: mimeType.includes('video') ? 'VIDEO' : 'IMAGE',
                metadata,
                image,
              });
              sendImagesData.push({
                image,
                metadata,
                retryRemain: RETRY_SEND_MESSAGE_MAX,
              });
            }
          }
          setTimeout(() => scrollToEnd(), 500);
          await sendImages(sendImagesData);
        },
      );
    } catch (error) {
      console.log('Catch error: ', error);
    }
  };

  const sendImages = async (data: TSendImage[]) => {
    await Promise.all(
      data.map(e => {
        sendImage(e);
      }),
    );
  };

  const sendImage = async ({image, metadata, retryRemain}: TSendImage) => {
    try {
      const {uri, type, fileName} = image;
      const filename = fileName ?? `${Date.now()}.png`;
      const mimeType = type ?? 'image/png';
      const {data} = await serviceMindService.presignedUploadUrl({
        filename,
        mimeType,
        type: 'chat-images',
      });
      const uploadURL = data.data.uploadUrlData.uploadURL;
      const resourceUrl = data.data.uploadUrlData.resourceUrl;
      const formData = new FormData();
      formData.append('uploadURL', uploadURL);
      formData.append('image', {uri, type, name: fileName});
      await serviceMindService.uploadImageUrl(formData);

      sendToWs({
        channel: 'client/send-message',
        body: {
          chatSessionId,
          contentType: mimeType.includes('video') ? 'VIDEO' : 'IMAGE',
          messageContent: resourceUrl,
          metadata,
        },
      });
    } catch (error) {
      if (retryRemain > 0) {
        retryRemain -= 1;
        sendImage({image, metadata, retryRemain});
      } else {
        setMessageToFailedState(metadata.key);
      }
    }
  };

  const preAddSentMessage = ({
    messageContent,
    metadata,
    contentType,
    image,
    doc,
  }: Pick<Message, 'contentType' | 'metadata' | 'messageContent'> &
    Partial<Pick<FailedMessage, 'image' | 'doc'>>) => {
    const preMessage: Message & Partial<Pick<FailedMessage, 'image' | 'doc'>> =
      {
        state: MessageState.SENDING,
        id: `PRE_SENT_MESSAGE_${Date.now()}`,
        orgId: '',
        chatSessionId: '',
        senderEntityType: 'TENANT',
        senderEntityId: '',
        messageContent,
        seenAt: '',
        status: 1,
        sentAt: '',
        deliveredAt: null,
        contentType,
        metadata,
        imageWidth: 1,
        imageHeight: 1,
        image,
        doc,
      };
    setMessages(prev => [...prev, preMessage]);
  };

  const onPressAttachPhoto = () => {
    modalActions.setContent(
      <LiveChatAttachPhotoModal
        onPressTakePhoto={() => {
          setIsTakingPhoto(true);
        }}
        onPressChooseFromLibrary={() => {
          setIsPickingImage(true);
        }}
      />,
    );
    modalActions.show();
  };

  const alertUploadExceedSizeLimit = () => {
    Alert.alert(
      t(
        'Residential__LiveChat__File_exceeds_size_limit',
        'File exceeds size limit',
      ),
      `${t(
        'Residential__LiveChat__Maximum_upload_size',
        'maximum upload size',
      )}: ${UPLOAD_FILE_MAX_SIZE_MB} MB.`,
      [{text: t('General_OK', 'OK')}],
    );
  };

  const onPressAttachFromLibrary = async () => {
    try {
      const docs = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
        ],
        allowMultiSelection: true,
      });
      if (docs.length === 0) return;
      if (docs.length > MAX_FILE_SELECTED) {
        alertUploadExceedSizeLimit();
        return;
      }

      const someDocSizeExceedSizeLimit = docs.some(
        ({size}) => size && size > UPLOAD_FILE_MAX_SIZE,
      );
      if (someDocSizeExceedSizeLimit) {
        alertUploadExceedSizeLimit();
        return;
      }

      const sendFilesData: TSendFile[] = [];
      for (const doc of docs) {
        const {uri, type, name, size} = doc;
        if (size && size <= UPLOAD_FILE_MAX_SIZE) {
          const filename = name ?? 'unknown';
          const mimeType = type ?? 'unknown';
          const fileSize = size;
          const metadata = {
            messageUid: uuidv4(),
            key: `FILE_${Date.now()}`,
            filename,
            mimeType,
            fileSize,
            fileSizeType: 'Byte',
          };
          preAddSentMessage({
            messageContent: uri,
            contentType: 'FILE',
            metadata,
            doc,
          });
          sendFilesData.push({
            doc,
            metadata,
            retryRemain: RETRY_SEND_MESSAGE_MAX,
          });
        }
      }
      setTimeout(() => scrollToEnd(), 500);
      await sendFiles(sendFilesData);
    } catch (error) {
      console.log('pickFile ERROR => ', error);
    }
  };

  const sendFiles = async (data: TSendFile[]) => {
    await Promise.all(data.map(e => sendFile(e)));
  };

  const sendFile = async ({doc, metadata, retryRemain}: TSendFile) => {
    try {
      const {uri, type, name} = doc;
      const filename = name ?? 'unknown';
      const mimeType = type ?? 'unknown';
      const {data} = await serviceMindService.presignedUploadUrl({
        filename,
        mimeType,
        type: 'chat-images',
      });
      const uploadURL = data.data.uploadUrlData.uploadURL;
      const resourceUrl = data.data.uploadUrlData.resourceUrl;
      const formData = new FormData();
      formData.append('uploadURL', uploadURL);
      formData.append('image', {uri, type, name});
      await serviceMindService.uploadImageUrl(formData);

      sendToWs({
        channel: 'client/send-message',
        body: {
          chatSessionId,
          contentType: 'FILE',
          messageContent: resourceUrl,
          metadata,
        },
      });
    } catch (error) {
      if (retryRemain > 0) {
        retryRemain -= 1;
        sendFile({doc, metadata, retryRemain});
      } else {
        setMessageToFailedState(metadata.key);
      }
    }
  };

  const setMessageToFailedState = async (metadataKey: string) => {
    setMessages(prev => {
      const updateMessages = [...prev];
      const index = updateMessages.findIndex(
        e => e?.metadata?.key === metadataKey,
      );
      if (index !== -1) {
        updateMessages[index] = {
          ...updateMessages[index],
          state: MessageState.FAILED,
        };
      }
      return updateMessages;
    });
  };

  const getImageDimension = (uri: string): Promise<ImageDimension> => {
    return new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve({width, height});
      });
    });
  };

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => {
      if (viewableItems?.length > 0) {
        setCurrentViewItemIndex(
          viewableItems[viewableItems.length - 1].index ?? 0,
        );
      }
    },
    [],
  );

  const onContentSizeChange = () => {
    setTimeout(() => {
      if (paginate.page === 1) {
        scrollViewRef.current &&
          scrollViewRef.current.scrollToEnd({animated: false});
      }
    }, 400);
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t('Residential__LiveChat', 'Chat with Concierge')}
          titleColor="dark-gray"
          bgColor="bg-white"
          onPressLeftAction={onPressBack}
        />

        {!isLoading && (
          <>
            <FlatList
              ref={scrollViewRef}
              className="w-full flex flex-col bg-[#F3F3F3] pt-[12px] px-[16px] pb-[300px] h-screen"
              scrollEnabled={messages.length !== 0}
              onScroll={({nativeEvent}) => onScroll(nativeEvent)}
              onContentSizeChange={onContentSizeChange}
              scrollEventThrottle={16}
              onScrollToIndexFailed={() => {}}
              refreshControl={
                <RefreshControl
                  onRefresh={() => {}}
                  refreshing={isLoadingPrevMessages}
                />
              }
              showsVerticalScrollIndicator={false}
              data={messages}
              renderItem={({item}) => (
                <LiveChatMessages
                  conciergeAvatar={conciergeAvatar}
                  message={item}
                  onLongPress={onLongPress}
                  onPress={onPress}
                />
              )}
              ListEmptyComponent={() => EmptyMessage()}
              ListFooterComponent={() =>
                isKeyboardVisible && (
                  <Spacing height={gapBetweenKeyboardAndMessage} />
                )
              }
              onViewableItemsChanged={onViewableItemsChanged}
              maintainVisibleContentPosition={{
                minIndexForVisible: 10,
              }}
            />
            <Spacing height={Platform.OS === 'ios' ? 200 : 150} />
          </>
        )}
      </ScreenContainer>

      {!isLoading && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View className="flex flex-col w-full px-[16px] pb-[36px] bg-[#fff] pt-[8px]">
            <View
              className="flex flex-row w-full justify-between mb-[10px]"
              style={{gap: 10}}>
              <TouchableOpacity
                className="bg-white py-[12px] px-[16px] grow flex flex-row items-center justify-center border-r-[1px] border-line-light"
                disabled={isLoading}
                onPress={onPressAttachPhoto}>
                <Icon
                  type="greenPicture"
                  width={16}
                  height={16}
                  className="mt-[-2px]"
                />
                <Text size="C1" className="ml-[4px]">
                  {t('Residential__LiveChat__Attach_a_photo', 'Attach a photo')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white py-[12px] px-[16px] grow flex flex-row items-center justify-center"
                disabled={isLoading}
                onPress={onPressAttachFromLibrary}>
                <Icon
                  type="greenPaperClip"
                  width={16}
                  height={16}
                  className="mt-[-2px]"
                />
                <Text size="C1" className="ml-[4px]">
                  {t('Residential__LiveChat__Attach_a_file', 'Attach a file')}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex flex-row w-full items-center">
              <TextInput
                placeholder={t(
                  'Residential__LiveChat__Type_to_start_chatting',
                  'Type a message'
                )}
                className="w-full border-black bg-white"
                style={{
                  width: screenWidth - 84,
                  height: isKeyboardVisible ? 'auto' : 48,
                  maxHeight: INPUT_BOX_MAX_HEIGHT,
                }}
                value={newMessage}
                onChangeText={setNewMessage}
                disabled={isLoading}
                multiline={true} 
              />
              <TouchableOpacity
                className="flex items-center justify-center bg-dark-teal-dark rounded-full w-[44px] h-[44px] ml-[10px] mt-auto"
                onPress={onSendNewMessage}
                disabled={!validNewMessage}>
                <Icon type="whiteMassage" width={16} height={16} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default ResidentialLiveChatScreen;

const EmptyMessage = () => {
  return (
    <View className="flex flex-col mt-[280px]">
      <Text size="H3" weight="medium" className="w-full text-center ">
        {t(
          'Residential__LiveChat__One_Bangkok_Live_Chat',
          'Start a chat with \n our concierge',
        )}
      </Text>
    </View>
  );
};
