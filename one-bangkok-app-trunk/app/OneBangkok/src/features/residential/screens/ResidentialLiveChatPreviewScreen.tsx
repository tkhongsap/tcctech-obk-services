import {
  Alert,
  Image,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {ScreenContainer, StickyButton} from '../components';
import {Header} from '../components/Header';
import Pdf from 'react-native-pdf';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Message} from '../components/LiveChatMessages';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';
import WebView from 'react-native-webview';
import t from '~/utils/text';
import {Spacing} from '~/components/atoms';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Video, {VideoRef} from 'react-native-video';
import ImageZoom from '../components/ImageZoom';
import Share from 'react-native-share';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResidentialLiveChatPreviewScreen'
>;
const screenHeight = Dimensions.get('screen').height;

const ResidentialLiveChatPreviewScreen = ({
  route: {
    params: {message},
  },
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const onPress = async () => {
    try {
      setIsLoading(true);
      const permission = await requestPermissions();
      if (
        Platform.OS === 'ios' &&
        (permission === RESULTS.BLOCKED ||
          permission === RESULTS.DENIED ||
          permission === RESULTS.UNAVAILABLE)
      ) {
        Alert.alert(
          'Enable Photo and videos',
          'Your photo and videos are currently disabled. To proceed, please grant permission to use your photo and videos',
        );
        return;
      }

      await downloadFile(message);
    } catch (error) {
      Alert.alert(
        t('General__Something_went_wrong', 'Something\nwent wrong'),
        t(
          'Announcement__Error_generic__Body',
          'Please wait and try again soon.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    return await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  };

  const alertDownloadComplete = (appendExt: string) => {
    Alert.alert(
      t('Residential__Download_complete', 'Download Complete'),
      `${appendExt?.toUpperCase()} ${t(
        'Residential__LiveChat__Downloaded_to_device',
        'downloaded to device',
      )}`,
      [{text: t('General_OK', 'OK')}],
    );
  };
  const getFilename = (message: Message) => {
    try {
      if (message.senderEntityType === 'TENANT') {
        return message.metadata.filename;
      } else {
        if (message.contentType === 'FILE') {
          return (
            message.metadata.file.name ??
            message.messageContent.split('/chat-documents/')[1]
          );
        } else if (message.contentType === 'VIDEO') {
          return (
            message.metadata.file.name ??
            message.messageContent.split('/chat-videos/')[1]
          );
        } else {
          return (
            message.metadata.file.name ??
            message.messageContent.split('/chat-images/')[1]
          );
        }
      }
    } catch (error) {
      return Date.now().toString();
    }
  };

  const downloadFile = async (message: Message) => {
    const url = message.messageContent;
    const cacheDir =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath;

    const filename = getFilename(message);
    const path = `${cacheDir}/${filename}`;
    const appendExt = getFileAppendExtByResourceUrl(url);
    const config: ReactNativeBlobUtilConfig = {
      fileCache: true,
      path,
      appendExt,
      timeout: 1000 * 60 * 3, // 3 mins
      addAndroidDownloads:
        Platform.OS === 'android'
          ? {
              useDownloadManager: true,
              notification: true,
              path,
              description: `${appendExt?.toUpperCase()} downloaded by download manager.`,
            }
          : {},
    };

    await ReactNativeBlobUtil.config(config)
      .fetch('GET', url)
      .then(async value => {
        if (Platform.OS === 'ios') {
          if (
            message.contentType === 'IMAGE' ||
            message.contentType === 'VIDEO'
          ) {
            await CameraRoll.saveToCameraRoll('file://' + value.path(), 'auto');
            alertDownloadComplete(appendExt);
          } else if (message.contentType === 'FILE') {
            const result = await Share.open({
              url: path,
              saveToFiles: true,
            }).catch();
            if (result.success) {
              alertDownloadComplete(appendExt);
            }
          }
        } else {
          alertDownloadComplete(appendExt);
        }
      });
  };

  const getFileAppendExtByResourceUrl = (url: string) => {
    for (const ext of extensions) {
      if (url.endsWith(ext)) return ext;
    }
    return 'file';
  };

  return (
    <>
      <ScreenContainer
        bgColor="#FFFFFF"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          title={t('Residential__LiveChat__Preview', 'Preview')}
        />
        {message.contentType === 'FILE' && (
          <PreviewFile
            message={message}
            disabled={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {message.contentType === 'IMAGE' && <PreviewImage message={message} />}
        {message.contentType === 'VIDEO' && (
          <PreviewVideo message={message} setIsLoading={setIsLoading} />
        )}
      </ScreenContainer>
      <StickyButton
        title={t('General__Download', 'Download')}
        onPress={onPress}
        rightIcon="downloadIconPdf"
        iconWidth={20}
        color="dark-teal"
        disabled={isLoading}
      />
    </>
  );
};

export default ResidentialLiveChatPreviewScreen;

type PreviewProps = {
  message: Message;
  disabled?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
};
const PreviewFile = ({message, disabled, setIsLoading}: PreviewProps) => {
  const webViewRef = useRef<WebView>(null);
  return (
    <>
      {message.messageContent.endsWith('.pdf') ? (
        <Pdf
          trustAllCerts={false}
          source={{uri: message.messageContent, cache: true}}
          style={styles.pdf}
          enableDoubleTapZoom={!disabled}
        />
      ) : (
        <View className="w-full" style={{height: screenHeight - 205}}>
          <WebView
            ref={webViewRef}
            source={{
              uri: `https://docs.google.com/gview?embedded=true&url=${message.messageContent}`,
            }}
            javaScriptEnabled={true}
            nestedScrollEnabled={true}
            onLoad={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              if (nativeEvent.title == '') {
                webViewRef.current && webViewRef.current.reload();
              }
            }}
            onLoadStart={() => {
              setIsLoading && setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading && setIsLoading(false);
            }}
          />
        </View>
      )}
    </>
  );
};

const PreviewImage = ({message, setIsLoading}: PreviewProps) => {
  const contentType =
    message.messageContent.endsWith('.mp4') ||
    message.messageContent.endsWith('.mov')
      ? 'MP4'
      : 'IMAGE';

  return (
    <>
      {contentType === 'MP4' ? (
        <PreviewVideo message={message} setIsLoading={setIsLoading} />
      ) : (
        <>
          {Platform.OS === 'ios' ? (
            <ScrollView
              style={styles.container}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              minimumZoomScale={1}
              maximumZoomScale={5}
              className="bg-jet-black-light w-full">
              <View
                className="w-full h-screen  flex items-center justify-center p-[16px]"
                style={{height: screenHeight - 160}}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: '100%',
                    maxHeight: screenHeight - 250,
                    aspectRatio: message.imageWidth / message.imageHeight,
                  }}
                  source={{uri: message.messageContent}}
                  onLoadStart={() => {
                    setIsLoading && setIsLoading(true);
                  }}
                  onLoadEnd={() => {
                    setIsLoading && setIsLoading(false);
                  }}
                />
                <Spacing height={50} />
              </View>
            </ScrollView>
          ) : (
            <View
              style={styles.container}
              className="bg-jet-black-light w-full">
              <View
                className="w-full h-screen  flex items-center justify-center p-[16px]"
                style={{height: screenHeight - 160}}>
                <ImageZoom
                  uri={message.messageContent}
                  styles={{
                    width: '100%',
                    maxHeight: screenHeight - 220,
                    aspectRatio: message.imageWidth / message.imageHeight,
                  }}
                />
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};

const PreviewVideo = ({message}: PreviewProps) => {
  const videoRef = useRef<VideoRef>(null);

  return (
    <View style={styles.container} className="bg-jet-black-light w-full">
      <View
        className="w-full h-screen  flex items-center justify-center p-[16px] pb-10"
        style={{height: screenHeight - 160}}>
        <Video
          ref={videoRef}
          className="rounded-[12px] z-10"
          resizeMode="contain"
          style={styles.backgroundVideo}
          source={{uri: message.messageContent}}
          fullscreen={Platform.OS === 'ios'}
          controls={true}
          controlsStyles={{
            hideNavigationBarOnFullScreenMode: false,
            hideNotificationBarOnFullScreenMode: false,
            hideDuration: false,
            hideSeekBar: false,
          }}
        />
        {Platform.OS === 'ios' && <Spacing height={50} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 8,
    paddingBottom: 150,
    paddingHorizontal: 16,
    backgroundColor: '#E4E4E4',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: Platform.OS === 'android' ? 30 : 0,
    right: 0,
  },
});
