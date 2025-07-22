/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Linking,
  RefreshControl,
  Platform,
  ImageBackground,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import {Header, IconButton} from '~/components/molecules';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {Spacing, Text, textWeightVariantTextEditor} from '~/components/atoms';
import RenderHtml from 'react-native-render-html';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  IContentDetail,
  IRelateContentItem,
} from '../components/ISustainability';
import FastImage from 'react-native-fast-image';
import FastImageScale from '../components/FastImageScale';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Fetch} from '~/utils/fetch/fetch';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '../components/HtmlRenderTextClassStyles';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {activeOpacity} from '~/constants';
import {t} from 'i18next';
import firebaseConfigState from '~/states/firebase';
import {artCultureServices} from '~/services/artCultureService';
import authenState from '~/states/authen/authenState';
import MemberOnlyModal from '~/features/artCulture/components/MemberOnlyModal';
import {logScreenView, logEvent} from '~/utils/logGA';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'NormalContentScreen'>;

const NormalContentScreen = ({
  route: {
    params: {id, isBanner = false},
  },
}: Props) => {
  const navigation = useNavigation() as any;
  const currentLanguage = appLanguageState.currentLanguage.get();

  const enableBookmarkContent =
    firebaseConfigState.enable_bookmark_content.value || false;

  const insets = useSafeAreaInsets();

  let nWidth = Dimensions.get('window').width;

  const [objContent, setObjContent] = useState<IContentDetail>({
    sHeaderNav: '',
    sHeaderImagePath: '',
    sTitle: '',
    lstContent: [],
    sTitleRelated: '',
    lstRelated: [],
  });

  const [refreshing, setRefreshing] = useState(false);

  const GetContentDetail = useCallback(async () => {
    let objParam = {
      sLanguage: currentLanguage || 'en',
      sID: id,
      isBanner: isBanner,
    };

    const res = await Fetch('GetContentDetail', objParam);
    return res;
  }, [currentLanguage, id, isBanner]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetContentDetail()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjContent(resp as IContentDetail);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetContentDetail]);

  useEffect(() => {
    GetContentDetail()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          setObjContent(resp as IContentDetail);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [GetContentDetail, currentLanguage, id, isBanner]);

  const handlePressRelated = (objItem: IRelateContentItem) => {
    if (objItem.isBanner && objItem.nType === 2) {
      handleOpenURL(objItem.sLinkToURL + '');
    } else {
      navigation.push('NormalContentScreen', {
        id: objItem.sLinkToID,
        isBanner: objItem.isBanner,
      });
    }
  };

  const styles = StyleSheet.create({
    boxRelated: {
      borderColor: '#eee',
      borderWidth: 1,
      borderRadius: 10,
      width: 120,
    },
    boxTextRelated: {
      padding: 5,
    },
    imageRelated: {
      width: 120,
      height: 120,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    buttonBookmark: {
      width: 120,
      height: 35,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    buttonShare: {
      width: 120,
      height: 50,
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
      flexDirection: 'column',
      justifyContent: 'center',
    },
  });

  const handleOpenURLYoutube = (sURL: string) => {
    Linking.openURL(sURL);
  };

  const handleOpenURL = (sURL: string) => {
    navigation.navigate('NotificationDeeplink', {
      url: sURL,
    });
  };

  const [isBookmark, setIsBookmark] = useState(false);
  const [isMemberOnlyModalVisible, setIsMemberOnlyModalVisible] =
    useState(false);
  const handleBookmarkAction = () => {
    const eventBookmark = {
      title_name: objContent.sTitle,
      screen_name: 'NormalContentScreen',
      feature_name: 'Bookmark',
      action_type: 'click',
      bu: 'Sustainability',
    };
    console.log('eventBookmark =>', eventBookmark);
    logEvent('button_click', eventBookmark);

    if (!authenState.token.value) {
      setIsMemberOnlyModalVisible(true);
      return;
    }

    if (!isFetchBookmarkDone) {
      return;
    }

    const typeOfBookmark = isBanner
      ? 'sustainability_banner'
      : 'sustainability_content';

    if (isBookmark) {
      artCultureServices
        .deleteBookmark(typeOfBookmark, `${id}`)
        .then(() => {
          setIsBookmark(false);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark(typeOfBookmark, `${id}`)
        .then(() => {
          setIsBookmark(true);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    }
  };

  const [isFetchBookmarkDone, setIsFetchBookmarkDone] =
    useState<boolean>(false);
  const fetchBookmark = () => {
    const typeOfBookmark = isBanner
      ? 'sustainability_banner'
      : 'sustainability_content';

    artCultureServices
      .getBookmark()
      .then(res => {
        const {data} = res.data;

        const sustainContent = data.filter(
          (item: any) =>
            item.contentType === typeOfBookmark && item.contentId === `${id}`,
        );

        if (sustainContent.length > 0) {
          setIsBookmark(true);
        }
      })
      .catch(error => {
        console.warn('error =>', error);
      })
      .finally(() => {
        setIsFetchBookmarkDone(true);
      });
  };

  useEffect(() => {
    if (authenState && authenState.token.value && id) {
      fetchBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, authenState]);

  useFocusEffect(
    useCallback(() => {
      if (
        authenState &&
        authenState.token.value &&
        id &&
        enableBookmarkContent
      ) {
        fetchBookmark();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enableBookmarkContent]),
  );

  useEffect(() => {
    logScreenView('NormalContentScreen');
  }, []);

  return (
    <Screen>
      {!isBanner && (
        <Header title={objContent.sHeaderNav} leftAction="goBack" />
      )}

      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      <ScrollView
        className={'w-full'}
        testID="normal-content-scroll-view-id"
        contentContainerStyle={{paddingBottom: insets.bottom}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Pressable>
          {!isBanner ? (
            <FastImage
              source={{
                uri: objContent.sHeaderImagePath,
                priority: FastImage.priority.low,
              }}
              style={{
                width: Dimensions.get('window').width,
                height: (Dimensions.get('window').width * 9) / 16,
              }}
            />
          ) : (
            <FastImage
              source={{
                uri: objContent.sHeaderImagePath,
                priority: FastImage.priority.low,
              }}
              style={{
                width: Dimensions.get('window').width,
                height: 500,
              }}>
              <View className="absolute top-[80px] items-start w-full">
                <View className="px-4">
                  <IconButton
                    width={25}
                    height={25}
                    color="white"
                    type="back"
                    onPress={() => navigation.goBack()}
                    rotation={0}
                  />
                </View>
              </View>
            </FastImage>
          )}

          <Spacing height={10} />

          <View className="px-3">
            {objContent.sTitle && (
              <Text
                weight="medium"
                style={{
                  fontSize: 24,
                  lineHeight: 32,
                }}>
                {objContent.sTitle}
              </Text>
            )}
            {!isBanner && objContent.sIntroduce && (
              <Text
                weight="medium"
                style={
                  currentLanguage === 'th'
                    ? {fontSize: 16, lineHeight: 22}
                    : {fontSize: 16}
                }>
                {objContent.sIntroduce}
              </Text>
            )}
            <Spacing height={5} />
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#eee',
              }}
            />

            <Spacing height={10} />

            {enableBookmarkContent && (
              <View>
                <View className="flex flex-row">
                  <Pressable
                    className="flex flex-row items-center bg-muted-50-light py-2 px-3 rounded-md mr-3"
                    onPress={() => handleBookmarkAction()}>
                    {isBookmark ? (
                      <ImageBackground
                        className="w-4 h-4 shrink-0"
                        source={require('../../../assets/artc/icons/icon-star-solid.png')}
                        resizeMode="contain"
                      />
                    ) : (
                      <ImageBackground
                        className="w-4 h-4 shrink-0"
                        source={require('../../../assets/artc/icons/star-outline.png')}
                        resizeMode="contain"
                      />
                    )}
                    <Text className="text-base font-bold pl-2">
                      {t('ArtCulture__Bookmark', 'Bookmark')}
                    </Text>
                  </Pressable>
                </View>

                <Spacing height={10} />
              </View>
            )}

            {objContent.lstContent?.map((item, index) =>
              item.sMode === 'Text' ? (
                <RenderHtml
                  key={item.sMode + index}
                  classesStyles={HTMLRenderTextClassStyles}
                  tagsStyles={HTMLRenderTextTagsStyles}
                  contentWidth={nWidth}
                  source={{
                    html: item.sContent
                      ? replaceTextHtml(item.sContent + '')
                      : '',
                  }}
                  systemFonts={Object.values(textWeightVariantTextEditor)}
                />
              ) : item.sMode === 'Image' ? (
                <View key={item.sMode + index}>
                  <Spacing height={5} />
                  <FastImageScale sUri={item.sImagePath + ''} nMargin={24} />
                  <Spacing height={5} />
                </View>
              ) : item.sMode === 'Youtube' ? (
                <View key={item.sMode + index}>
                  <Spacing height={25} />
                  <YoutubePlayer
                    height={210}
                    play={false}
                    videoId={item.sYoutubeID + ''}
                  />
                  {Platform.OS === 'android' && (
                    <Pressable
                      onPress={() =>
                        handleOpenURLYoutube(item.sYoutubeURL + '')
                      }>
                      <Text
                        style={{
                          textAlign: 'center',
                          textDecorationLine: 'underline',
                          color: 'blue',
                        }}>
                        {t('Mc_open_on_web', 'Open on Web')}
                      </Text>
                    </Pressable>
                  )}
                </View>
              ) : null,
            )}

            {/* Related */}
            {objContent.lstRelated && objContent.lstRelated?.length > 0 && (
              <>
                <Spacing height={20} />

                <Text weight="medium" size="B2">
                  {objContent.sTitleRelated}
                </Text>

                <ScrollView horizontal={true}>
                  <Pressable>
                    <View style={{flexDirection: 'row', gap: 10}}>
                      {objContent.lstRelated.map((item, index) => (
                        <TouchableOpacity
                          key={item.sImagePath + '' + index}
                          onPress={() => handlePressRelated(item)}
                          activeOpacity={activeOpacity}>
                          <View style={styles.boxRelated}>
                            <View>
                              <FastImage
                                source={{
                                  uri: item.sImagePath + '',
                                  priority: FastImage.priority.low,
                                }}
                                style={styles.imageRelated}
                              />
                            </View>
                            <View style={styles.boxTextRelated}>
                              <View>
                                <Text
                                  weight="medium"
                                  style={{
                                    fontSize: 16,
                                    lineHeight: 22,
                                  }}>
                                  {item.sTitle}
                                </Text>
                                {item.sDescription && (
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      lineHeight:
                                        currentLanguage === 'th' ? 15 : 10,
                                      color: '#7c7c7c',
                                    }}>
                                    {item.sDescription}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Pressable>
                </ScrollView>
                <Spacing height={10} />
              </>
            )}
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

export default NormalContentScreen;
