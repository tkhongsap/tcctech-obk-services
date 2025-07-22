/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import {Header, IconButton} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import {hideLoading, showLoading} from '~/states/loadingState';
import GridViewLayout1 from '../components/GridViewLayout1';
import {IContentFileDownload} from '../components/ISustainability';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import FastImage from 'react-native-fast-image';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Fetch} from '~/utils/fetch/fetch';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {activeOpacity} from '~/constants';
import firebaseConfigState from '~/states/firebase';
import authenState from '~/states/authen/authenState';
import {artCultureServices} from '~/services/artCultureService';
import {logScreenView} from '~/utils/logGA';
import MemberOnlyModal from '~/features/artCulture/components/MemberOnlyModal';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'FileDownloadScreen'>;

const FileDownloadScreen = ({
  route: {
    params: {id},
  },
}: Props) => {
  const insets = useSafeAreaInsets();
  const currentLanguage = appLanguageState.currentLanguage.get();
  const navigation = useNavigation() as any;

  const enabledBookmarkContent =
    firebaseConfigState.enable_bookmark_wmm_dgl_content.value;

  const [objContent, setObjContent] = useState<IContentFileDownload>({
    sHeaderNav: '',
    sTitle: '',
    sIntroduce: '',
    lstFile: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  let nWidthCover = Dimensions.get('window').width / 2 - 19;
  let nHeightCover = (nWidthCover * 1.414) / 1;
  let nWidthBox = Dimensions.get('window').width / 2 - 18;
  let nHeightBox = (nWidthBox * 1.414) / 1;

  const GetDigitalLibraryFile = useCallback(async () => {
    let objParam = {
      sLanguage: currentLanguage || 'en',
      sID: id,
    };
    const res = await Fetch('GetDigitalLibraryFile', objParam);
    return res;
  }, [currentLanguage, id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetDigitalLibraryFile()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjContent(resp as IContentFileDownload);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetDigitalLibraryFile]);

  useEffect(() => {
    GetDigitalLibraryFile()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjContent(resp as IContentFileDownload);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetDigitalLibraryFile, currentLanguage, id]);

  const styles = StyleSheet.create({
    container: {
      height: nHeightBox,
      width: nWidthBox, // 178 * 100 px : 16:9
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fontNameBold: {
      fontWeight: 'bold',
      fontSize: 16,
      height: 50,
    },
    box: {
      borderColor: '#eee',
      borderWidth: 1,
      borderRadius: 10,
      width: nWidthBox,
    },
    boxText: {
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    downloadIconTop: {
      paddingTop: 5,
    },
  });

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

  const [bookmarkItemIds, setBookmarkItemIds] = useState<string[]>([]);
  const [isFetchBookmarkDone, setIsFetchBookmarkDone] =
    useState<boolean>(false);
  const fetchBookmark = () => {
    artCultureServices
      .getBookmarkByType('digital_library_item')
      .then(res => {
        const {data} = res.data;
        setBookmarkItemIds(data.map((item: any) => item.contentId));
      })
      .catch(error => {
        console.warn('error =>', error);
      })
      .finally(() => {
        setIsFetchBookmarkDone(true);
      });
  };

  useEffect(() => {
    if (authenState && authenState.token.value && enabledBookmarkContent) {
      fetchBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenState]);

  const [isMemberOnlyModalVisible, setIsMemberOnlyModalVisible] =
    useState(false);
  const handleBookmarkAction = (itemId: string) => {
    if (!authenState.token.value) {
      setIsMemberOnlyModalVisible(true);
      return;
    }

    if (!isFetchBookmarkDone) {
      return;
    }

    if (bookmarkItemIds.includes(`${itemId}`)) {
      artCultureServices
        .deleteBookmark('digital_library_item', itemId)
        .then(() => {
          setBookmarkItemIds(
            bookmarkItemIds.filter(item => item !== `${itemId}`),
          );
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark('digital_library_item', itemId)
        .then(() => {
          setBookmarkItemIds([...bookmarkItemIds, `${itemId}`]);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (authenState && authenState.token.value && enabledBookmarkContent) {
        fetchBookmark();
      }
    }, [enabledBookmarkContent]),
  );

  useEffect(() => {
    logScreenView('FileDownloadScreen');
  }, []);

  return (
    <Screen>
      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      <Header
        title={objContent.sHeaderNav}
        leftAction="goBack"
        onPressLeftAction={() => {
          navigation.goBack();
          hideLoading();
        }}
      />
      <Spacing height={10} />
      <ScrollView
        className={'w-full'}
        testID="normal-content-scroll-view-id"
        contentContainerStyle={{paddingBottom: insets.bottom}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Pressable>
          <View className="px-3">
            <Text
              weight="medium"
              style={{
                fontSize: 24,
                lineHeight: 32,
              }}>
              {objContent.sTitle}
            </Text>

            {objContent.sIntroduce && (
              <Text
                weight="regular"
                style={
                  currentLanguage === 'th'
                    ? {fontSize: 14, lineHeight: 20}
                    : {fontSize: 14}
                }>
                {objContent.sIntroduce}
              </Text>
            )}
          </View>
          <View>
            <GridViewLayout1
              data={objContent.lstFile}
              col={2}
              padding={12}
              renderItem={item => {
                return (
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={() =>
                      handlePressFile(item.sPathFile, item.sFileName)
                    }>
                    <View style={styles.box}>
                      <View className="relative" style={styles.container}>
                        {enabledBookmarkContent ? (
                          <Pressable
                            className="absolute top-0 right-2 z-10 flex flex-row items-center justify-center bg-white-fade-light w-[40px] h-[40px] ml-2 mt-2 rounded-[4px]"
                            onPress={() => handleBookmarkAction(`${item.sID}`)}>
                            <Image
                              source={
                                bookmarkItemIds.includes(`${item.sID}`)
                                  ? require('../../../assets/artc/icons/icon-star-solid.png')
                                  : require('../../../assets/artc/icons/icon-star-outline.png')
                              }
                              className="w-[20px] h-[20px]"
                            />
                          </Pressable>
                        ) : (
                          <View />
                        )}

                        {item.sPathCover ? (
                          <FastImage
                            source={{
                              uri: item.sPathCover + '',
                              priority: FastImage.priority.low,
                            }}
                            style={{
                              width: nWidthCover,
                              height: nHeightCover,
                              marginRight: 2,
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                            }}
                            resizeMode="contain"
                          />
                        ) : (
                          <Image
                            source={require('../../../assets/images/sustainability/default_image_digital_libraly.png')}
                            style={{
                              width: nWidthCover - 30,
                              height: nHeightCover - 40,
                              marginRight: 2,
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                            }}
                          />
                        )}
                      </View>
                      <View style={styles.boxText}>
                        <View style={{width: '78%'}}>
                          <Text style={styles.fontNameBold} numberOfLines={2}>
                            {item.sFileName.split('.')[0]}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                            }}>{`${item.sType} - ${item.sSize}`}</Text>
                        </View>
                        <View style={styles.downloadIconTop}>
                          <IconButton
                            width={35}
                            height={35}
                            color="black"
                            type="downloadIcon"
                            rotation={0}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <Spacing height={10} />
          </View>
        </Pressable>
      </ScrollView>
      <FloatingStickyMenu
        type="obNewIcon"
        width={30}
        height={30}
        color="white"
        rotation={0}
      />
    </Screen>
  );
};

export default FileDownloadScreen;
