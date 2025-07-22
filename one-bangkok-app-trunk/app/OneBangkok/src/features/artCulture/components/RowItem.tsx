import dayjs from 'dayjs';
import React from 'react';
import {Image, ImageBackground, Platform, Pressable, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Icon, Text} from '~/components/atoms';
import {IAddOnProgramItem} from '~/models/ArtCulture';
import {useNavigation} from '~/navigations/AppNavigation';
import firebaseConfigState from '~/states/firebase';
import {hideLoading, showLoading} from '~/states/loadingState';

interface IRowItem {
  artCType?: string;
  item: IAddOnProgramItem;
  isBookmark?: boolean;
  handleOnPress?: () => void;
  handleOnRemoveBookmark?: (type: string, contentId: string) => void;
}

const RowItem = ({
  artCType,
  item,
  isBookmark,
  handleOnPress,
  handleOnRemoveBookmark,
}: IRowItem) => {
  const navigation = useNavigation();

  const getMime = (sType: string) => {
    let sMime = 'application/pdf';
    switch (sType.toLocaleLowerCase()) {
      case 'doc':
        sMime = 'application/msword';
        break;
      case 'docx':
        sMime =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'xls':
        sMime = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        sMime =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'ppt':
        sMime = 'application/vnd.ms-powerpoint';
        break;
      case 'pptx':
        sMime =
          'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'pdf':
        sMime = 'application/pdf';
        break;
    }
    return sMime;
  };

  const handlePressFile = async (sPath: string, sFileName: string) => {
    showLoading();
    try {
      // Get the app's cache directory
      const {fs} = ReactNativeBlobUtil;
      const cacheDir =
        Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

      // Generate a unique filename for the downloaded image
      const filePath = `${cacheDir}/${sFileName}`;

      const configOptions = Platform.select({
        ios: {
          fileCache: true,
          path: filePath,
          notification: true,
          appendExt: sFileName?.split('.').pop(),
        },
        android: {
          fileCache: true,
          path: filePath,
          appendExt: sFileName?.split('.').pop(),
          addAndroidDownloads: {
            // Related to the Android only
            useDownloadManager: true,
            notification: true,
            path: filePath,
            description: 'File',
          },
        },
      });

      if (Platform.OS === 'ios') {
        await ReactNativeBlobUtil.config(configOptions as any)
          .fetch('GET', sPath)
          .progress((received, total) => {
            console.log('progress', received + '-' + total + '');
          })
          .then(res => {
            setTimeout(() => {
              ReactNativeBlobUtil.ios.presentPreview('file://' + res.path());
            }, 300);
          })
          .catch(errorMessage => {
            console.log(errorMessage);
          });
      } else {
        await ReactNativeBlobUtil.config(configOptions as any)
          .fetch('GET', sPath)
          .then(res => {
            ReactNativeBlobUtil.android.actionViewIntent(
              res.path(),
              getMime(sFileName?.split('.').pop() + ''),
            );
          })
          .catch(err => console.log('download Err', err));
      }
    } catch (error) {
      console.log('error', error);
    }
    hideLoading();
  };

  const cardOnPress = () => {
    if (item.type === 'program' || item.type === 'art_culture_program') {
      navigation.navigate('ArtCultureProgramScreen', {
        id: item.id,
      });
    } else if (item.type === 'art_culture_category') {
      navigation.navigate('ArtCultureArtCScreen', {
        id: item.id,
      });
    } else if (
      item.type === 'sustainability_banner' ||
      item.type === 'sustainability_content'
    ) {
      navigation.navigate('NormalContentScreen', {
        id: `${item.id}`,
        isBanner: item.type === 'sustainability_banner' ? true : false,
      });
    } else if (item.type === 'walking_meeting_map') {
      navigation.navigate('WalkingSearchScreen');
    } else if (item.type === 'walking_meeting_map_route') {
      navigation.navigate('WalkingMapRouteScreen', {
        id: parseInt(`${item.id}`),
      });
    } else if (item.type === 'digital_library') {
      navigation.navigate('DigitalLibraryScreen');
    } else if (item.type === 'digital_library_item' && item.link) {
      handlePressFile(item.link, item.title);
    } else {
      navigation.navigate('ArtCultureAddOnScreen', {
        id: item.id,
      });
    }
  };

  const handleOnRemoveBookmarkPress = (type: string, contentId: string) => {
    if (handleOnRemoveBookmark) {
      handleOnRemoveBookmark(type, contentId);
    }
  };

  return (
    <View className="flex flex-row mb-3 h-[150px] border border-line-light">
      <Pressable
        onPress={() => {
          if (handleOnPress) {
            handleOnPress();
          }

          cardOnPress();
        }}>
        <ImageBackground
          className="w-[148px] h-[148px] shrink-0"
          source={item.thumbnailReq ? item.thumbnailReq : {uri: item.thumbnail}}
          resizeMode="cover">
          {isBookmark && (
            <Pressable
              className="flex flex-row items-center justify-center bg-white-fade-light w-[40px] h-[40px] rounded-[4px] ml-auto mr-2 mt-2"
              onPress={() =>
                handleOnRemoveBookmarkPress(item.type, `${item.id}`)
              }>
              <Image
                source={
                  isBookmark
                    ? require('../../../assets/artc/icons/icon-star-solid.png')
                    : require('../../../assets/artc/icons/icon-star-outline.png')
                }
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          )}
        </ImageBackground>
      </Pressable>
      <View className="flex flex-col h-full w-full justify-between px-3 py-4 shrink">
        <View>
          {artCType && (
            <Text className="text-xs text-subtitle-muted-light">
              {artCType}
            </Text>
          )}
          {item.addOnType && (
            <Text className="text-xs text-subtitle-muted-light capitalize">
              {item.addOnType}
            </Text>
          )}
          <Pressable
            onPress={() => {
              if (handleOnPress) {
                handleOnPress();
              }

              cardOnPress();
            }}>
            <Text
              numberOfLines={2}
              className="w-full overflow-hidden text-jet-black-light font-obMedium">
              {item.title}
            </Text>
          </Pressable>
        </View>
        <View>
          {item.locations && (
            <Text className="text-xs text-subtitle-muted-light">
              {item.locations.join(', ')}
            </Text>
          )}
          {item.periodAt && item.periodEnd && (
            <Text className="text-sm">
              {dayjs(item.periodAt).format('DD MMM YYYY')} -{' '}
              {dayjs(item.periodEnd).format('DD MMM YYYY')}
            </Text>
          )}
        </View>
        {firebaseConfigState.enable_artc_booking_ticket.value &&
          item.isGetTicketAvailable && (
            <View className="flex flex-row ml-[-3px]">
              <Icon type="ticket" width={14} height={12} />
              <Text className="text-sm">Get Ticket</Text>
            </View>
          )}
      </View>
    </View>
  );
};

export default RowItem;
