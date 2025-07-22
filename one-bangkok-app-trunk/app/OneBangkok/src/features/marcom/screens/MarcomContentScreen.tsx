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
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Screen} from '~/components/templates';
import {Header, IconButton} from '~/components/molecules';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {
  Icon,
  Spacing,
  Text,
  textWeightVariantTextEditor,
} from '~/components/atoms';
import RenderHtml from 'react-native-render-html';
import YoutubePlayer from 'react-native-youtube-iframe';
import {IContentMarcomDetail, IRelateContentItem} from '../components/IMarcom';
import FastImage from 'react-native-fast-image';
import FastImageScale from '../../sustainability/components/FastImageScale';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Fetch} from '~/utils/fetch/fetch';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '../../sustainability/components/HtmlRenderTextClassStyles';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {activeOpacity} from '~/constants';
import LinearGradient from 'react-native-linear-gradient';
import {t} from 'i18next';
import {
  WhatHappeningProps,
  whatHappeningService,
} from '~/services/whatHappeningService';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaViewContent} from './SafeAreaViewContent';
import {artCultureServices} from '~/services/artCultureService';
import {mappingProgramItems} from '~/models/ArtCulture';
import {logScreenView, logTitleView} from '~/utils/logGA';

type Props = NativeStackScreenProps<RootStackParamList, 'MarcomContentScreen'>;

const MarcomContentScreen = ({
  route: {
    params: {id, sMode, isBanner},
  },
}: Props) => {
  const navigation = useNavigation() as any;
  const currentLanguage =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();

  const insets = useSafeAreaInsets();

  let nWidth = Dimensions.get('window').width;
  let nHeight = Dimensions.get('window').height;

  const [heightContentBox, setHeightContentBox] = useState(0);

  let hasDynamicIsland = DeviceInfo.hasDynamicIsland();

  const [objContent, setObjContent] = useState<IContentMarcomDetail>({
    sHeaderNav: '',
    sID: '',
    sHeaderImagePath: '',
    sTextImage: '',
    sTitle: '',
    sIntroduce: '',
    lstContent: [],
    sTitleRelated: '',
    sSubTitleRelated: '',
    lstRelated: [],
    lstTag: [],
    isArtAndCulture: false,
    nTypeLink: 1,
    nSystemType: null,
    nArtAndCultureType: null,
    sDetailLink: '',
    sMode: '',
  });
  const nExploreBoxHeight = 130;

  const [refreshing, setRefreshing] = useState(false);
  const [isLoadContent, setIsLoadContent] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);

  const GetContentDetail = useCallback(async () => {
    setIsLoadContent(true);
    let objParam = {
      sLanguage: currentLanguage || 'en',
      sID: id,
      sMode: sMode,
      isBanner: isBanner,
    };

    const res = await Fetch('GetContentDetail', objParam, true);
    setIsLoadContent(false);
    return res;
  }, [currentLanguage, id, isBanner, sMode]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    GetContentDetail()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          let res = resp as IContentMarcomDetail;

          //Add Related from Art + C
          // Internal Link id, Art + C, Program
          if (
            objContent.nTypeLink === 1 &&
            objContent.nSystemType === 1 &&
            (!objContent.nArtAndCultureType ||
              objContent.nArtAndCultureType === 1)
          ) {
            await artCultureServices
              .fetchProgramPage(+(objContent.sDetailLink ?? 0), currentLanguage)
              .then(resArt => {
                const {data} = resArt.data;

                const relatedPrograms = mappingProgramItems(
                  currentLanguage,
                  data.relatePrograms,
                );

                if (relatedPrograms.length > 0) {
                  let arrRelatedAll = res.lstRelated;
                  relatedPrograms.forEach(iR => {
                    let objArtRelated = iR.programTranslations;
                    if (objArtRelated) {
                      let objAddRelated: IRelateContentItem = {
                        sID: '',
                        sImagePath: '',
                        sTitle: null,
                        sLinkToID: '',
                        isBanner: false,
                      };
                      objAddRelated.sID = objArtRelated.programId + '';
                      objAddRelated.sImagePath = objArtRelated.thumbnail;
                      objAddRelated.sTitle = objArtRelated.title;
                      objAddRelated.sLinkToID = objArtRelated.programId + '';
                      objAddRelated.isArtAndCultureRelated = true;

                      arrRelatedAll?.push(objAddRelated);
                    }
                  });
                  res.lstRelated = arrRelatedAll;
                }
              })
              .catch(err => {
                console.error(err);
              });
          }
          setObjContent(res);
        }
        setRefreshing(false);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [
    GetContentDetail,
    currentLanguage,
    objContent.nArtAndCultureType,
    objContent.nSystemType,
    objContent.nTypeLink,
    objContent.sDetailLink,
  ]);

  useEffect(() => {
    GetContentDetail()
      .then(async resp => {
        if (resp.nStatusCode === 200) {
          let res = resp as IContentMarcomDetail;

          //Add Related from Art + C
          // Internal Link id, Art + C, Program
          if (
            objContent.nTypeLink === 1 &&
            objContent.nSystemType === 1 &&
            (!objContent.nArtAndCultureType ||
              objContent.nArtAndCultureType === 1)
          ) {
            await artCultureServices
              .fetchProgramPage(+(objContent.sDetailLink ?? 0), currentLanguage)
              .then(resArt => {
                const {data} = resArt.data;

                const relatedPrograms = mappingProgramItems(
                  currentLanguage,
                  data.relatePrograms,
                );

                if (relatedPrograms.length > 0) {
                  let arrRelatedAll = res.lstRelated;
                  relatedPrograms.forEach(iR => {
                    let objArtRelated = iR.programTranslations;
                    if (objArtRelated) {
                      let objAddRelated: IRelateContentItem = {
                        sID: '',
                        sImagePath: '',
                        sTitle: null,
                        sLinkToID: '',
                        isBanner: false,
                      };
                      objAddRelated.sID = objArtRelated.programId + '';
                      objAddRelated.sImagePath = objArtRelated.thumbnail;
                      objAddRelated.sTitle = objArtRelated.title;
                      objAddRelated.sLinkToID = objArtRelated.programId + '';
                      objAddRelated.isArtAndCultureRelated = true;

                      arrRelatedAll?.push(objAddRelated);
                    }
                  });
                  res.lstRelated = arrRelatedAll;
                }
              })
              .catch(err => {
                console.error(err);
              });
          }
          setObjContent(res);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }, [
    GetContentDetail,
    currentLanguage,
    id,
    isBanner,
    objContent.nArtAndCultureType,
    objContent.nSystemType,
    objContent.nTypeLink,
    objContent.sDetailLink,
    sMode,
  ]);
  const handlePressRelated = (objItem: IRelateContentItem) => {
    if (objItem.isBanner && objItem.nType === 2) {
      handleOpenURL(objItem.sLinkToURL + '');
    } else if (objItem.isBanner && objItem.nType === 1) {
      //Banner Content
      navigation.push('MarcomContentScreen', {
        id: objItem.sLinkToID,
        sMode: sMode,
        isBanner: true,
      });
    } else if (!objItem.isArtAndCultureRelated) {
      //Marcom Content
      navigation.push('MarcomContentScreen', {
        id: objItem.sLinkToID,
        sMode: sMode,
        isBanner: false,
      });
    } else if (objItem.isArtAndCultureRelated) {
      //Art + C Program Content
      navigation.navigate('ArtCultureProgramScreen', {
        id: objItem.sLinkToID,
      });
    }
  };
  useEffect(() => {
    if (sMode === 'Explore' && objContent?.sTitle) {
      logTitleView(objContent.sTitle);
    }
  }, [sMode, objContent.sTitle]);

  const handleOpenURL = (sURL: string) => {
    Linking.openURL(sURL);
  };

  const handleViewThisEvent = async () => {
    if (objContent.nTypeLink === 1) {
      if (objContent.nSystemType === 2) {
        //Workplace
        await whatHappeningService.getEvents(currentLanguage).then(response => {
          if (response as WhatHappeningProps[]) {
            let objResult = response?.find(
              f => f.id + '' === objContent.sDetailLink,
            );
            if (objResult) {
              navigation.navigate('EventDetail', {
                ...objResult,
              });
            }
          }
        });
      } else if (objContent.nSystemType === 1) {
        //Art + C
        if (
          !objContent.nArtAndCultureType ||
          objContent.nArtAndCultureType === 1
        ) {
          //Program
          navigation.navigate('ArtCultureProgramScreen', {
            id: objContent.sDetailLink,
          });
        } else if (objContent.nArtAndCultureType === 2) {
          //Add-on
          navigation.navigate('ArtCultureAddOnScreen', {
            id: objContent.sDetailLink,
          });
        }
      }
    } else if (objContent.nTypeLink === 2) {
      navigation.navigate('NotificationDeeplink', {
        url: objContent.sDetailLink,
      });
    }
  };

  const handlePressRelateExplore = (sID: string) => {
    navigation.push('MarcomContentScreen', {
      id: sID,
      sMode: 'Explore',
      isBanner: false,
    });
  };

  const handlePressShare = () => {
    Alert.alert('Under development', '', [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
    ]);
  };

  const styles = StyleSheet.create({
    fontNameBold: {
      fontWeight: 'bold',
    },
    boxRelated: {
      borderColor: '#eee',
      borderWidth: 1,
      borderRadius: 10,
      width: 120,
    },
    boxTextRelated: {
      padding: 5,
      height: 35,
    },
    imageRelated: {
      width: 120,
      height: 120,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    imageExplore: {
      width: nExploreBoxHeight,
      height: nExploreBoxHeight,
    },
    linearGradient: {
      flex: 1,
    },
  });

  useEffect(() => {
    logScreenView('MarcomContentScreen');
    logTitleView('Marcom Content');
  }, []);

  return (
    <Screen>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />

      {!isBanner && (
        <Header title={objContent.sHeaderNav} leftAction="goBack" />
      )}
      <SafeAreaViewContent
        className={'items-center h-screen w-full'}
        style={{backgroundColor: 'white'}}>
        <ScrollView
          className={'w-full'}
          testID="normal-content-scroll-view-id"
          contentContainerStyle={{paddingBottom: insets.bottom}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            {sMode === 'WhatHappening' ? (
              <FastImage
                source={{
                  uri: objContent.sHeaderImagePath,
                  priority: FastImage.priority.low,
                }}
                style={{
                  width: Dimensions.get('window').width,
                  height: (Dimensions.get('window').width * 9) / 16,
                }}>
                <View
                  className="absolute bottom-[0] w-full"
                  style={{height: 125}}>
                  <LinearGradient
                    colors={['rgba(0,0,0, 0)', 'rgba(0,0,0, 1)']}
                    style={{flex: 1}}
                  />
                </View>
                <View className="absolute bottom-[0px] w-full px-3">
                  {objContent.sTextImage && (
                    <View>
                      <RenderHtml
                        contentWidth={nWidth}
                        classesStyles={HTMLRenderTextClassStyles}
                        tagsStyles={HTMLRenderTextTagsStyles}
                        source={{
                          html: replaceTextHtml(objContent.sTextImage + ''),
                        }}
                        systemFonts={Object.values(textWeightVariantTextEditor)}
                      />
                      <Spacing height={15} />
                    </View>
                  )}
                  {/* Comment for wait Function bookmark from Art + C */}
                  {/* <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#3a3837',
                  }}
                />
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: Dimensions.get('window').width,
                      marginTop: 3,
                      marginBottom: 3,
                    }}>
                    <TouchableOpacity
                      activeOpacity={activeOpacity}
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        let bookmark = !isBookmark;
                        setIsBookmark(bookmark);
                        if (bookmark) {
                          Alert.alert('Under development', '', [
                            {
                              text: 'OK',
                              onPress: () => console.log('OK Pressed'),
                            },
                          ]);
                        }
                      }}>
                      <Icon
                        type={'bookmarkIcon'}
                        color={isBookmark ? 'gold' : '#f5f5f5'}
                        width={30}
                        height={30}
                      />
                      <Text
                        style={{
                          marginLeft: 10,
                          marginTop: 18,
                          fontSize: 20,
                          color: 'white',
                          marginRight: 20,
                        }}>
                        {t('Mc_Bookmark', 'Bookmark')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={activeOpacity}
                      style={{flexDirection: 'row'}}
                      onPress={handlePressShare}>
                      <Icon
                        type={'shareIcon'}
                        color={'white'}
                        width={50}
                        height={50}
                      />
                      <Text
                        style={{fontSize: 20, marginTop: 18, color: 'white'}}>
                        {t('Mc_Share', 'Share')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View> */}
                </View>
              </FastImage>
            ) : sMode === 'Explore' ? (
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
                resizeMode="cover"
                style={{
                  width: Dimensions.get('window').width,
                  height: 500,
                }}>
                <View className="absolute top-[20px] items-start w-full">
                  <View className="px-4">
                    <IconButton
                      width={25}
                      height={25}
                      color="black"
                      type="back"
                      onPress={() => navigation.goBack()}
                      rotation={0}
                    />
                  </View>
                </View>
              </FastImage>
            )}

            <Spacing height={10} />

            <View
              className="px-3"
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                setHeightContentBox(layout.height);
              }}>
              {objContent.sTitle && sMode !== 'WhatHappening' && (
                <Text weight="medium" size="H3">
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
              <Spacing height={10} />
              {objContent.lstContent?.map((item, index) =>
                item.sMode === 'Text' ? (
                  <View key={item.sMode + index}>
                    <Spacing height={10} />
                    <RenderHtml
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
                    <Spacing height={10} />
                  </View>
                ) : item.sMode === 'Image' ? (
                  <View key={item.sMode + index}>
                    <Spacing height={10} />
                    <FastImageScale sUri={item.sImagePath + ''} nMargin={24} />
                    <Spacing height={10} />
                  </View>
                ) : item.sMode === 'Youtube' ? (
                  <View key={item.sMode + index}>
                    <Spacing height={10} />
                    <YoutubePlayer
                      height={210}
                      play={false}
                      videoId={item.sYoutubeID + ''}
                    />
                    {Platform.OS === 'android' && (
                      <Pressable
                        onPress={() => handleOpenURL(item.sYoutubeURL + '')}>
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
                    <Spacing height={10} />
                  </View>
                ) : null,
              )}

              {/* Tag */}
              {objContent.lstTag && objContent.lstTag.length > 0 && (
                <View>
                  <Spacing height={20} />
                  <Text weight="medium" style={{fontSize: 18}}>
                    {t('Mc_Tag', 'Tag')}
                  </Text>
                  <Spacing height={10} />
                </View>
              )}
              {objContent.lstTag && objContent.lstTag.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 10,
                    flexWrap: 'wrap',
                    width: Dimensions.get('window').width,
                  }}>
                  {objContent.lstTag.map((item, index) => (
                    <View key={item.sTagName + '_' + index}>
                      <View
                        style={{
                          borderColor: '#4f4f4f',
                          borderWidth: 1,
                          paddingTop: 5,
                          paddingBottom: 5,
                          paddingLeft: 10,
                          paddingRight: 10,
                          borderRadius: 20,
                        }}>
                        <Text>{item.sTagName}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Related */}
              {objContent.lstRelated &&
                objContent.lstRelated?.length > 0 &&
                (sMode === 'Explore' ? (
                  <>
                    <Spacing height={20} />

                    {objContent.sTitleRelated && (
                      <Text weight="medium" style={{fontSize: 16}}>
                        {objContent.sTitleRelated}
                      </Text>
                    )}

                    {objContent.sSubTitleRelated && (
                      <Text weight="regular" style={{fontSize: 14}}>
                        {objContent.sSubTitleRelated}
                      </Text>
                    )}

                    <Spacing height={10} />

                    <ScrollView horizontal={true}>
                      <Pressable>
                        <View style={{flexDirection: 'row', gap: 10}}>
                          {objContent.lstRelated.map((item, index) => (
                            <View key={item.sID + '_' + index}>
                              <TouchableOpacity
                                activeOpacity={activeOpacity}
                                onPress={() =>
                                  handlePressRelateExplore(item.sID)
                                }>
                                <View>
                                  <FastImage
                                    source={{
                                      uri: item.sImagePath + '',
                                      priority: FastImage.priority.low,
                                    }}
                                    style={styles.imageExplore}>
                                    <View
                                      className="absolute bottom-[0] w-full"
                                      style={{height: nExploreBoxHeight}}>
                                      <LinearGradient
                                        colors={[
                                          'rgba(0, 0, 0, 0.3)',
                                          'rgba(0, 0, 0, 0.3)',
                                        ]}
                                        style={styles.linearGradient}
                                      />
                                    </View>
                                    <View className="absolute w-full">
                                      <View
                                        style={{
                                          flexDirection: 'column',
                                          justifyContent: 'center',
                                          height: nExploreBoxHeight,
                                          alignItems: 'center',
                                        }}>
                                        <Text
                                          weight="medium"
                                          style={{
                                            fontSize: 16,
                                            color: 'white',
                                          }}>
                                          {item.sTitle}
                                        </Text>
                                      </View>
                                    </View>
                                  </FastImage>
                                </View>
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      </Pressable>
                    </ScrollView>
                    <Spacing height={Platform.OS === 'ios' ? 120 : 80} />
                  </>
                ) : (
                  <>
                    <Spacing height={20} />

                    {objContent.sTitleRelated && (
                      <Text weight="medium" style={{fontSize: 16}}>
                        {objContent.sTitleRelated}
                      </Text>
                    )}

                    {objContent.sSubTitleRelated && (
                      <Text weight="regular" style={{fontSize: 14}}>
                        {objContent.sSubTitleRelated}
                      </Text>
                    )}

                    <Spacing height={10} />

                    <ScrollView horizontal={true}>
                      <Pressable>
                        <View style={{flexDirection: 'row', gap: 10}}>
                          {objContent.lstRelated.map((item, index) => (
                            <TouchableOpacity
                              key={item.sImagePath + '' + index}
                              onPress={() => handlePressRelated(item)}
                              activeOpacity={1}>
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
                                      numberOfLines={1}
                                      size={'C1'}
                                      style={styles.fontNameBold}>
                                      {item.sTitle}
                                    </Text>
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        fontSize: 10,
                                        lineHeight:
                                          currentLanguage === 'th' ? 15 : 10,
                                        color: '#7c7c7c',
                                      }}>
                                      {item.sDescription}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </Pressable>
                    </ScrollView>
                    <Spacing
                      height={
                        Platform.OS === 'android' && sMode === 'Banner' ? 70 : 0
                      }
                    />
                  </>
                ))}
            </View>

            {sMode === 'WhatHappening' &&
            nHeight -
              (heightContentBox + (Dimensions.get('window').width * 9) / 16) +
              120 >
              (Platform.OS === 'ios' ? 160 : 150) ? (
              <Spacing
                height={
                  nHeight -
                  (Dimensions.get('window').width * 9) / 16 -
                  heightContentBox -
                  (Platform.OS === 'ios' ? 290 : 258)
                }
              />
            ) : null}

            {sMode === 'WhatHappening' &&
              !isLoadContent &&
              (objContent.nTypeLink === 1 || objContent.nTypeLink === 2) && (
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  onPress={() => handleViewThisEvent()}>
                  <Spacing height={20} />
                  <View
                    style={{
                      width: '100%',
                      height: 150,
                      backgroundColor: '#1a1919',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 15,
                      paddingRight: 10,
                      paddingBottom: 15,
                    }}>
                    <Text
                      weight="medium"
                      style={{fontSize: 20, paddingTop: 20, color: '#dcdcdc'}}>
                      {t('Mc_ViewThisEvent', 'View This Event')}
                    </Text>
                    <View style={{paddingTop: 8}}>
                      <Icon
                        type={'next'}
                        color="#dcdcdc"
                        width={35}
                        height={35}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}

            {sMode === 'WhatHappening' &&
            !isLoadContent &&
            (objContent.nTypeLink === 1 || objContent.nTypeLink === 2) ? (
              <Spacing
                height={
                  Platform.OS === 'ios' ? (hasDynamicIsland ? 48 : 40) : 0
                }
              />
            ) : sMode === 'WhatHappening' ? (
              <Spacing height={Platform.OS === 'ios' ? 100 : 0} />
            ) : null}
          </Pressable>
        </ScrollView>
      </SafeAreaViewContent>
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

export default MarcomContentScreen;
