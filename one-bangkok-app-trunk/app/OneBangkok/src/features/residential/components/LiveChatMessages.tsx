import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useRef} from 'react';
import {Icon, Text} from '~/components/atoms';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import Video, {VideoRef} from 'react-native-video';
import t from '~/utils/text';
import DatetimeParser from '../utils/reformatter/datetime';

export enum MessageState {
  SENDING,
  FAILED,
  // otherwise is success
}
export type MessageContentType = 'TEXT' | 'FILE' | 'IMAGE' | 'VIDEO';
export type EntityType = 'TENANT' | 'BACKEND_USER';
export type Message = {
  id: string;
  orgId: string;
  chatSessionId: string;
  senderEntityType: EntityType;
  senderEntityId: string;
  messageContent: string;
  sentAt: string;
  status: number;
  seenAt: string;
  deliveredAt: string | null;
  contentType: MessageContentType;
  metadata: any;
  imageWidth: number;
  imageHeight: number;
  state?: MessageState;
};
type Props = {
  conciergeAvatar: string;
  message: Message;
  onPress: (message: Message) => void;
  onLongPress: (message: Message) => void;
  disabled?: boolean;
};
type MessageProps = {
  message: Message;
  onPress: (message: Message) => void;
  onLongPress: (message: Message) => void;
  disabled?: boolean;
  language: string;
  opacity: number;
};
type BackendMessageProps = {
  conciergeAvatar: string;
} & MessageProps;

const screenWidth = Dimensions.get('screen').width;
const extensions = [
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'mp4',
  'mov',
];

const LiveChatMessages = ({
  conciergeAvatar,
  message,
  onPress,
  onLongPress,
  disabled,
}: Props) => {
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const isUnsuccessMessage = () => {
    return (
      message?.state === MessageState.SENDING ||
      message?.state === MessageState.FAILED
    );
  };

  return (
    <Fragment key={message.id}>
      {message.senderEntityType === 'TENANT' ? (
        <TenantMessage
          message={message}
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={disabled}
          language={language}
          opacity={isUnsuccessMessage() ? 0.5 : 1}
        />
      ) : (
        <BackendMessage
          conciergeAvatar={conciergeAvatar}
          message={message}
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={disabled}
          language={language}
          opacity={isUnsuccessMessage() ? 0.5 : 1}
        />
      )}
    </Fragment>
  );
};

export default React.memo(LiveChatMessages);

const fileSize = (size: number) => {
  const kb = Math.ceil(size / 1024);
  if (kb <= 1000) return `${kb}KB`;

  const mb = Math.ceil(kb / 1024);
  return `${mb}MB`;
};

const getFileAppendExtByResourceUrl = (url: string) => {
  for (const ext of extensions) {
    if (url.endsWith(ext)) return ext;
  }
  return 'file';
};

const DeliveryDate = ({
  deliveredAt,
  language,
}: {
  deliveredAt: number;
  language: string;
}) => {
  const parseDateFormat = (timestamp: number) => {
    try {
      return `${DatetimeParser.toDMY({
        language,
        timestamp,
      })} ${DatetimeParser.toHM({language, timestamp})}`;
    } catch (error) {
      return '';
    }
  };
  return (
    <Text size="C1" color="muted" className="mt-[8px]">
      {parseDateFormat(deliveredAt)}
    </Text>
  );
};

const SendingFailed = () => {
  return (
    <Text size="C1" color="dark-red" className="mt-[8px]">
      {t(
        'Residential__Live_chat_failed_message_description',
        'Sending failed. Long press to retry or delete.',
      )}
    </Text>
  );
};

const TenantMessage = ({
  message,
  onPress,
  onLongPress,
  disabled,
  language,
  opacity,
}: MessageProps) => {
  return (
    <View
      className="flex flex-row ml-auto mb-[32px]"
      style={{
        width: screenWidth - (message.contentType === 'TEXT' ? 70 : 120),
      }}>
      <View className="flex flex-col items-end w-full">
        <View className="flex flex-row" style={{opacity}}>
          {message.status === 0 ? (
            TenantUnsent()
          ) : (
            <>
              {message.contentType === 'TEXT' && (
                <TenantText
                  message={message}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  disabled={disabled}
                  language={language}
                />
              )}

              {message.contentType === 'IMAGE' && (
                <TenantImage
                  message={message}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  disabled={disabled}
                  language={language}
                />
              )}

              {message.contentType === 'FILE' && (
                <TenantFile
                  message={message}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  disabled={disabled}
                  language={language}
                />
              )}

              {message.contentType === 'VIDEO' && (
                <TenantVideo
                  message={message}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  disabled={disabled}
                  language={language}
                />
              )}
            </>
          )}
        </View>
        {message.deliveredAt !== null && (
          <DeliveryDate
            deliveredAt={parseInt(message.deliveredAt)}
            language={language}
          />
        )}
        {message.state === MessageState.FAILED && <SendingFailed />}
      </View>
    </View>
  );
};

const TenantText = ({
  message,
  onPress,
  onLongPress,
  disabled = false,
}: Omit<MessageProps, 'opacity'>) => {
  return (
    <TouchableOpacity
      className="w-fit bg-white px-[20px] py-[12px] rounded-[12px]"
      disabled={disabled}
      onPress={() => onPress(message)}
      onLongPress={() => onLongPress(message)}>
      <Text color="dark-teal">{message.messageContent}</Text>
      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
    </TouchableOpacity>
  );
};

const TenantFile = ({
  message,
  onLongPress,
  onPress,
  disabled = false,
}: Omit<MessageProps, 'opacity'>) => {
  const fileExt = getFileAppendExtByResourceUrl(
    message.messageContent,
  ).toUpperCase();

  return (
    <TouchableOpacity
      className="w-fit bg-white pl-[8px] pr-[16px] py-[8px] rounded-[12px] flex flex-row items-center max-w-full"
      disabled={disabled}
      onPress={() => onPress(message)}
      onLongPress={() => onLongPress(message)}>
      <View className="relative">
        <View className="absolute top-[0px] left-[0px] z-10 w-full h-full flex items-center justify-center">
          <Text color="dark-teal" size="C1" style={{letterSpacing: 0.5}}>
            {fileExt}
          </Text>
        </View>
        <Image
          className="w-[55px] h-[72px] z-0"
          source={require('~/assets/images/mock_file.png')}
        />
      </View>
      <View className="flex flex-col ml-[10px]">
        <Text
          weight="medium"
          color="dark-teal"
          className="max-w-[200px] break-all"
          numberOfLines={3}>
          {message.metadata.filename}
        </Text>
        <Text color="muted">{fileSize(message.metadata.fileSize)}</Text>
      </View>
      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
    </TouchableOpacity>
  );
};

const TenantImage = ({
  message,
  onPress,
  onLongPress,
  disabled = false,
}: Omit<MessageProps, 'opacity'>) => {
  const videoRef = useRef<VideoRef>(null);
  const contentType =
    message.messageContent.endsWith('.mp4') ||
    message.messageContent.endsWith('.mov')
      ? 'MP4'
      : 'IMAGE';

  return (
    <TouchableOpacity
      className="rounded-[12px] flex flex-row items-center bg-white p-[4px]"
      disabled={disabled}
      onPress={() => onPress(message)}
      onLongPress={() => onLongPress(message)}>
      {contentType === 'MP4' ? (
        <View className="relative">
          <View className="absolute top-[0px] left-[0px] z-10 w-full h-full flex items-center justify-center">
            <Icon type="playIcon" width={40} height={40} />
          </View>
          <Video
            ref={videoRef}
            className="rounded-[60px] z-1 aspect-[5/3]"
            resizeMode="cover"
            style={{
              width: '100%',
            }}
            source={{uri: message.messageContent}}
            paused={true}
            renderLoader={() => (
              <View className="w-full h-full bg-white"></View>
            )}
          />
        </View>
      ) : (
        <Image
          resizeMode="contain"
          className="rounded-[12px] z-10"
          style={{
            width: '100%',
            aspectRatio: message.imageWidth / message.imageHeight,
          }}
          source={{uri: message.messageContent}}
        />
      )}

      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
    </TouchableOpacity>
  );
};

const TenantVideo = ({
  message,
  onPress,
  onLongPress,
  disabled = false,
}: Omit<MessageProps, 'opacity'>) => {
  const videoRef = useRef<VideoRef>(null);
  return (
    <TouchableOpacity
      className="rounded-[12px] flex flex-row items-center bg-white p-[4px]"
      disabled={disabled}
      onPress={() => onPress(message)}
      onLongPress={() => onLongPress(message)}>
      <View className="relative p-[2px]">
        <View className="absolute top-[0px] left-[0px] z-10 w-full h-full flex items-center justify-center">
          <Icon type="playIcon" width={40} height={40} />
        </View>
        <Video
          ref={videoRef}
          className="rounded-[60px] z-1 aspect-[5/3]"
          resizeMode="cover"
          style={{
            width: '100%',
          }}
          source={{uri: message.messageContent}}
          paused={true}
          renderLoader={() => <View className="w-full h-full bg-white"></View>}
        />
      </View>
      <View className="border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
    </TouchableOpacity>
  );
};

const TenantUnsent = () => {
  return (
    <TouchableOpacity
      className="w-fit bg-white px-[20px] py-[12px] rounded-[12px]"
      disabled>
      <Text color="muted" className="italic">
        {t('Residential__LiveChat__Unsent', 'Unsent')}
      </Text>
      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-white border-b-[7.5px] border-b-transparent absolute bottom-[-6px] right-[10px]" />
    </TouchableOpacity>
  );
};

const BackendMessage = ({
  conciergeAvatar,
  message,
  onPress,
  onLongPress,
  language,
}: BackendMessageProps) => {
  return (
    <View
      className="flex flex-row mr-auto mb-[32px]"
      style={{
        width: screenWidth - (message.contentType === 'TEXT' ? 70 : 120),
        opacity: message?.state === MessageState.SENDING ? 0.5 : 1,
      }}>
      <View className="w-[40px] h-[40px] border-[1px] border-[#fff] mr-[8px] rounded-full flex items-center justify-center">
        <Image
          className="w-[38px] h-[38px] rounded-full "
          source={{uri: conciergeAvatar}}
        />
      </View>

      <View className="flex flex-col items-start w-full">
        <View className="flex flex-row">
          {message.contentType === 'TEXT' && (
            <BackendText
              message={message}
              onPress={() => onPress(message)}
              onLongPress={onLongPress}
              language={language}
            />
          )}
          {message.contentType === 'IMAGE' && (
            <BackendImage
              message={message}
              onLongPress={onLongPress}
              onPress={onPress}
              language={language}
            />
          )}
          {message.contentType === 'FILE' && (
            <BackendFile
              message={message}
              onLongPress={onLongPress}
              onPress={onPress}
              language={language}
            />
          )}
          {message.contentType === 'VIDEO' && (
            <BackendVideo
              message={message}
              onLongPress={onLongPress}
              onPress={onPress}
              language={language}
            />
          )}
        </View>
        {message.deliveredAt !== null && (
          <DeliveryDate
            deliveredAt={parseInt(message.deliveredAt)}
            language={language}
          />
        )}
      </View>
    </View>
  );
};

const BackendText = ({message}: Omit<MessageProps, 'opacity'>) => {
  return (
    <TouchableOpacity className="w-fit bg-[#B0F0D5] px-[20px] py-[12px] rounded-[12px]">
      <Text color="dark-teal">{message.messageContent}</Text>
      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-[#B0F0D5] border-b-[7.5px] border-b-transparent absolute bottom-[-6px] left-[10px] rotate-180" />
    </TouchableOpacity>
  );
};

const BackendImage = ({message, onPress}: Omit<MessageProps, 'opacity'>) => {
  return (
    <TouchableOpacity
      className="rounded-[12px] flex flex-row items-center bg-[#B0F0D5] p-[4px]"
      onPress={() => onPress(message)}>
      <Image
        resizeMode="contain"
        className="rounded-[12px] z-10"
        style={{
          width: '100%',
          aspectRatio: message.imageWidth / message.imageHeight,
        }}
        source={{uri: message.messageContent}}
      />
      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-[#B0F0D5] border-b-[7.5px] border-b-transparent absolute bottom-[-6px] left-[10px] rotate-180" />
    </TouchableOpacity>
  );
};

const BackendFile = ({message, onPress}: Omit<MessageProps, 'opacity'>) => {
  const fileExt = getFileAppendExtByResourceUrl(
    message.messageContent,
  ).toUpperCase();

  return (
    <TouchableOpacity
      className="w-fit bg-[#B0F0D5] pl-[8px] pr-[16px] py-[8px] rounded-[12px] flex flex-row items-center max-w-full"
      onPress={() => onPress(message)}>
      <View className="relative">
        <View className="absolute top-[0px] left-[0px] z-10 w-full h-full flex items-center justify-center">
          <Text color="dark-teal" size="C1" style={{letterSpacing: 0.5}}>
            {fileExt}
          </Text>
        </View>
        <Image
          className="w-[55px] h-[72px] z-0"
          source={require('~/assets/images/mock_file.png')}
        />
      </View>
      <View className="flex flex-col ml-[10px]">
        <Text
          weight="medium"
          color="dark-teal"
          className="max-w-[200px] break-all"
          numberOfLines={3}>
          {message.metadata.filename}
        </Text>
        <Text color="muted">{fileSize(message.metadata.fileSize)}</Text>
      </View>

      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-[#B0F0D5] border-b-[7.5px] border-b-transparent absolute bottom-[-6px] left-[10px] rotate-180" />
    </TouchableOpacity>
  );
};

const BackendVideo = ({message, onPress}: Omit<MessageProps, 'opacity'>) => {
  const fileExt = getFileAppendExtByResourceUrl(
    message.messageContent,
  ).toUpperCase();
  const videoRef = useRef<VideoRef>(null);

  return (
    <TouchableOpacity
      className="w-fit bg-[#B0F0D5] pl-[8px] pr-[8px] py-[8px] rounded-[12px] flex flex-row items-center max-w-full"
      onPress={() => onPress(message)}>
      <View className="relative">
        <View className="absolute top-[0px] left-[0px] z-10 w-full h-full flex items-center justify-center">
          <Icon type="playIcon" width={40} height={40} />
        </View>
        <Video
          ref={videoRef}
          className="rounded-[60px] z-1 aspect-[5/3]"
          resizeMode="cover"
          style={{
            width: '100%',
          }}
          source={{uri: message.messageContent}}
          paused={true}
          renderLoader={() => <View className="w-full h-full bg-white"></View>}
        />
      </View>
      <View className="border-t-[7.5px] border-t-transparent border-r-[10px] border-r-[#B0F0D5] border-b-[7.5px] border-b-transparent absolute bottom-[-6px] left-[10px] rotate-180" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    // position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
