import {useHookstate} from '@hookstate/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Linking,
  Pressable,
  RefreshControl,
  StatusBar,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icon, Text, textWeightVariantTextEditor} from '~/components/atoms';
import {
  IProgramPage,
  mappingArtCCategory,
  mappingArtCType,
  mappingProgramItem,
  mappingProgramItems,
} from '~/models/ArtCulture';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {artCultureServices} from '~/services/artCultureService';
import t from '~/utils/text';
import Share from 'react-native-share';
import RenderHTML from 'react-native-render-html';
import GetTicketButton from '~/features/booking/components/GetTicketButton';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '~/features/sustainability/components/HtmlRenderTextClassStyles';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import ProgramFullDetailItem from '../components/ProgramFullDetailItem';
import {numberFormatter} from '~/utils/number';
import WebView from 'react-native-webview';
import Config from 'react-native-config';
import firebaseConfigState from '~/states/firebase';
import authenState from '~/states/authen/authenState';
import Loading from '~/components/organisms/Loading';
import MemberOnlyModal from '../components/MemberOnlyModal';
// import TrackPlayer, {useProgress} from 'react-native-track-player';
import {logScreenView, logEvent} from '~/utils/logGA';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ArtCultureProgramScreen'
>;

const ArtCultureProgramScreen = ({
  route: {
    params: {id},
  },
}: Props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const enableBookmarkContent =
    firebaseConfigState.enable_bookmark_content.value || false;
  const enableShareContent =
    firebaseConfigState.enable_share_content.value || false;

  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const loadedContent = useRef(false);
  const loadedArtCContent = useRef(false);

  const [content, setContent] = useState<IProgramPage | undefined>();

  const fetchContent = () => {
    artCultureServices
      .fetchProgramPage(id, languageSelected)
      .then(res => {
        const {data} = res.data;

        const artCType = mappingArtCType(languageSelected, data.artCType);
        const artCCategory = mappingArtCCategory(
          languageSelected,
          data.artCCategory,
        );
        const program = mappingProgramItem(languageSelected, data.program);
        const relatePrograms = mappingProgramItems(
          languageSelected,
          data.relatePrograms,
        );
        const relateProducts = mappingProgramItems(
          languageSelected,
          data.relateProducts,
        );

        if (!program) {
          navigation.navigate('ArtCultureLandingScreen');
        }

        setContent({
          artCType,
          artCCategory,
          program,
          relatePrograms,
          relateProducts,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!loadedContent.current && languageSelected && id) {
      loadedContent.current = true;
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSelected, id]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
  };

  const shareContent = async () => {
    const eventShare = {
      title_name: content?.program?.programTranslations.title,
      screen_name: 'ProgramFullDetailItem',
      feature_name: 'Shared',
      action_type: 'click',
      bu: 'Art & Culture',
    };

    logEvent('button_click', eventShare);

    if (content && content.program) {
      try {
        Share.open({
          url: `${Config.UNIVERSAL_LINK}/art-culture/program/${content.program.id}`,
        });
      } catch (error) {
        console.warn('error =>', error);
      }
    }
  };

  const [isBookmark, setIsBookmark] = useState(false);
  const [isMemberOnlyModalVisible, setIsMemberOnlyModalVisible] =
    useState(false);
  const handleBookmarkAction = () => {
    const eventBookMark = {
      title_name: content?.program?.programTranslations.title,
      screen_name: 'ProgramFullDetailItem',
      feature_name: 'Bookmark',
      action_type: 'click',
      bu: 'Art & Culture',
    };
    logEvent('button_click', eventBookMark);
    if (!authenState.token.value) {
      setIsMemberOnlyModalVisible(true);
      return;
    }

    if (!isFetchBookmarkDone) {
      return;
    }

    if (isBookmark) {
      artCultureServices
        .deleteBookmark('art_culture_program', `${content?.program?.id}`)
        .then(() => {
          setIsBookmark(false);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark('art_culture_program', `${content?.program?.id}`)
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
    artCultureServices
      .getBookmark()
      .then(res => {
        const {data} = res.data;

        const program = data.filter(
          (item: any) =>
            item.contentType === 'art_culture_program' &&
            item.contentId === `${content?.program?.id}`,
        );

        if (program.length > 0) {
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
    if (authenState && authenState.token.value && content && content.program) {
      fetchBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, authenState]);

  useFocusEffect(
    useCallback(() => {
      if (
        authenState &&
        authenState.token.value &&
        content &&
        content.program &&
        enableBookmarkContent
      ) {
        fetchBookmark();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, enableBookmarkContent]),
  );

  useEffect(() => {
    logScreenView('ArtCultureProgramScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />

      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      {content && content.program ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable className="pb-12">
            <ImageBackground
              className="h-[488px]"
              source={{uri: content.program.programTranslations.banner}}
              style={{
                width: Dimensions.get('screen').width,
                paddingTop: insets.top,
              }}>
              <View className="flex flex-row justify-between pb-10 px-4">
                <Pressable
                  className="flex w-9 h-9 items-center justify-center rounded-[4px]"
                  onPress={() => navigation.goBack()}>
                  <Icon
                    type="back"
                    className="invert mix-blend-difference"
                    width={20}
                    height={20}
                  />
                </Pressable>
              </View>
            </ImageBackground>
            <View className="pt-6 px-4">
              {content.artCCategory && (
                <Text className="text-base text-subtitle-light font-bold">
                  {content.artCCategory.artCTranslation.title}
                </Text>
              )}

              {content.artCType && !content.artCCategory && (
                <Text className="text-base text-subtitle-light font-bold">
                  {content.artCType.artCTranslation.title}
                </Text>
              )}

              <View className="pt-2">
                <Text className="text-3xl font-bold">
                  {content.program.programTranslations.title}
                </Text>
                {content.program.programTranslations.author && (
                  <Text className="text-sm text-muted-light">
                    {content.program.programTranslations.author}
                  </Text>
                )}
              </View>

              {content.program.programTranslations.shortDesc && (
                <Text className="font-obMedium pt-2">
                  {content.program.programTranslations.shortDesc}
                </Text>
              )}
            </View>

            {content.program.programTranslations.audio && (
              <View className="pt-4 px-4">
                <WebView
                  className="w-full"
                  style={{height: Dimensions.get('screen').width * 0.45}}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction
                  source={{
                    uri: content.program.programTranslations.audio,
                  }}
                />
              </View>
            )}

            {content.program.programTranslations.video && (
              <View className="pt-4 px-4">
                <WebView
                  className="w-full"
                  style={{height: Dimensions.get('screen').width * 0.52}}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction
                  source={{
                    uri: content.program.programTranslations.video,
                  }}
                />
              </View>
            )}

            {enableBookmarkContent || enableShareContent ? (
              <View className="pt-4 px-4">
                <View className="pt-4 border-t border-line-light">
                  <View className="flex flex-row">
                    {enableBookmarkContent && (
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
                    )}
                    {enableShareContent && (
                      <Pressable
                        className="flex flex-row items-center bg-muted-50-light py-2 px-3 rounded-md mr-3"
                        onPress={() => shareContent()}>
                        <ImageBackground
                          className="w-4 h-4 shrink-0"
                          source={require('../../../assets/artc/icons/share-outline.png')}
                          resizeMode="contain"
                        />
                        <Text className="text-base font-bold pl-2">
                          {t('ArtCulture__Share', 'Share')}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View className="mt-4 mx-4 border-t border-line-light" />
            )}

            {content.program.programTranslations.locations &&
            content.program.programTranslations.locations.length > 0 ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/map-pin.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__Location', 'Location')}
                  </Text>
                </View>
                {content.program.programTranslations.locations.map(
                  (item, index) => (
                    <View key={`program-detail-location-item-${index}`}>
                      <Text className="text-subtitle-muted-light">{item}</Text>
                    </View>
                  ),
                )}
              </View>
            ) : (
              <View />
            )}

            {!content.program.isProduct &&
            content.program.periodAt &&
            content.program.periodAt ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/calendar.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__Program_Period', 'Program Period')}
                  </Text>
                </View>

                <View>
                  <Text className="text-subtitle-muted-light">
                    {dayjs(content.program.periodAt).format('DD MMM YYYY')} -{' '}
                    {dayjs(content.program.periodEnd).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>
            ) : (
              <View />
            )}

            {!content.program.isProduct &&
            content.program.programTranslations.openingHours &&
            content.program.programTranslations.openingHours.length > 0 ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/calendar.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__Opening_Hours', 'Opening Hours')}
                  </Text>
                </View>
                {content.program.programTranslations.openingHours.map(
                  (item, index) => (
                    <View key={`program-detail-opening-hours-item-${index}`}>
                      <Text className="text-subtitle-muted-light">{item}</Text>
                    </View>
                  ),
                )}
              </View>
            ) : (
              <View />
            )}

            {!content.program.isProduct ? (
              <>
                {content.program.displayFreeLabel ? (
                  <View className="pt-4 px-4">
                    <View className="flex flex-row items-center">
                      <ImageBackground
                        className="w-5 h-4 shrink-0"
                        source={require('../../../assets/artc/icons/thb-currency.png')}
                        resizeMode="contain"
                      />
                      <Text className=" text-dark-gray-light font-obMedium ml-2">
                        {t('ArtCulture__Admission_Fee', 'Admission Fee')}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-subtitle-muted-light">Free</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    {content.program.programTranslations.enterFee &&
                    content.program.programTranslations.enterFee > 0 ? (
                      <View className="pt-4 px-4">
                        <View className="flex flex-row items-center">
                          <ImageBackground
                            className="w-5 h-4 shrink-0"
                            source={require('../../../assets/artc/icons/thb-currency.png')}
                            resizeMode="contain"
                          />
                          <Text className=" text-dark-gray-light font-obMedium ml-2">
                            {t('ArtCulture__Admission_Fee', 'Admission Fee')}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-subtitle-muted-light">
                            {numberFormatter(
                              content.program.programTranslations.enterFee.toString(),
                              0,
                            )}{' '}
                            {t('ArtCulture__Baht', 'THB')}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View />
                    )}
                  </>
                )}
              </>
            ) : (
              <View />
            )}

            {!content.program.isProduct &&
            content.program.programTranslations.externalLink !== '' ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/navigator.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__External_Link', 'External Link')}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    if (content.program!.programTranslations.externalLink) {
                      Linking.openURL(
                        content.program!.programTranslations.externalLink,
                      );
                    }
                  }}>
                  <Text className="text-subtitle-muted-light underline">
                    {content.program.programTranslations.externalLink}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View />
            )}

            <View className="pt-4 pb-2 mx-4 overflow-hidden">
              <RenderHTML
                classesStyles={HTMLRenderTextClassStyles}
                tagsStyles={HTMLRenderTextTagsStyles}
                contentWidth={Dimensions.get('window').width}
                source={{
                  html: content.program.programTranslations.desc
                    ? replaceTextHtml(
                        content.program.programTranslations.desc + '',
                      )
                    : '',
                }}
                systemFonts={Object.values(textWeightVariantTextEditor)}
              />
            </View>

            {content.program.programTranslations.infoItems && (
              <View className="px-4">
                {content.program.programTranslations.infoItems.length > 0 && (
                  <>
                    {content.program.programTranslations.infoItems.map(
                      (item, index) => (
                        <View
                          key={`program-detail-info-item-${index}`}
                          className="pt-4">
                          <Text className="font-obMedium">{item.title}</Text>
                          <Text className="text-subtitle-muted-light">
                            {item.content}
                          </Text>
                        </View>
                      ),
                    )}
                  </>
                )}
              </View>
            )}

            {content.program.isProduct &&
            content.program.periodAt &&
            content.program.periodAt ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/calendar.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__Program_Period', 'Program Period')}
                  </Text>
                </View>

                <View>
                  <Text className="text-subtitle-muted-light">
                    {dayjs(content.program.periodAt).format('DD MMM YYYY')} -{' '}
                    {dayjs(content.program.periodEnd).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>
            ) : (
              <View />
            )}

            {content.program.isProduct &&
            content.program.programTranslations.openingHours &&
            content.program.programTranslations.openingHours.length > 0 ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/calendar.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__Opening_Hours', 'Opening Hours')}
                  </Text>
                </View>
                {content.program.programTranslations.openingHours.map(
                  (item, index) => (
                    <View key={`program-detail-opening-hours-item-${index}`}>
                      <Text className="text-subtitle-muted-light">{item}</Text>
                    </View>
                  ),
                )}
              </View>
            ) : (
              <View />
            )}

            {content.program.isProduct ? (
              <>
                {content.program.displayFreeLabel ? (
                  <View className="pt-4 px-4">
                    <View className="flex flex-row items-center">
                      <ImageBackground
                        className="w-5 h-4 shrink-0"
                        source={require('../../../assets/artc/icons/thb-currency.png')}
                        resizeMode="contain"
                      />
                      <Text className=" text-dark-gray-light font-obMedium ml-2">
                        {t('ArtCulture__Admission_Fee', 'Admission Fee')}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-subtitle-muted-light">Free</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    {content.program.programTranslations.enterFee &&
                    content.program.programTranslations.enterFee > 0 ? (
                      <View className="pt-4 px-4">
                        <View className="flex flex-row items-center">
                          <ImageBackground
                            className="w-5 h-4 shrink-0"
                            source={require('../../../assets/artc/icons/thb-currency.png')}
                            resizeMode="contain"
                          />
                          <Text className=" text-dark-gray-light font-obMedium ml-2">
                            {t('ArtCulture__Admission_Fee', 'Admission Fee')}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-subtitle-muted-light">
                            {numberFormatter(
                              content.program.programTranslations.enterFee.toString(),
                              0,
                            )}{' '}
                            {t('ArtCulture__Baht', 'THB')}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View />
                    )}
                  </>
                )}
              </>
            ) : (
              <View />
            )}

            {content.program.isProduct &&
            content.program.programTranslations.externalLink !== '' ? (
              <View className="pt-4 px-4">
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0"
                    source={require('../../../assets/artc/icons/navigator.png')}
                    resizeMode="contain"
                  />
                  <Text className=" text-dark-gray-light font-obMedium ml-2">
                    {t('ArtCulture__External_Link', 'External Link')}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    const eventProduct = {
                      title_name: content?.program?.programTranslations.title,
                      screen_name: 'ArtCultureProgramScreen',
                      feature_name: 'Product Detail',
                      action_type: 'click',
                      bu: 'Art & Culture',
                    };

                    logEvent('button_click', eventProduct);

                    if (content.program!.programTranslations.externalLink) {
                      Linking.openURL(
                        content.program!.programTranslations.externalLink,
                      );
                    }
                  }}>
                  <Text className="text-subtitle-muted-light underline">
                    {content.program.programTranslations.externalLink}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View />
            )}

            {content.program.isProduct && content.program.productPrice ? (
              <View className="pt-4 px-4">
                <Text className=" text-dark-gray-light font-obMedium">
                  {t('ArtCulture__Price', 'Price')}
                </Text>
                <View className="flex flex-row items-center">
                  <ImageBackground
                    className="w-5 h-4 shrink-0 mr-1"
                    source={require('../../../assets/artc/icons/thb-currency.png')}
                    resizeMode="contain"
                  />
                  <Text className="text-subtitle-muted-light">
                    {numberFormatter(
                      content.program.productPrice.toString(),
                      0,
                    )}{' '}
                    {t('ArtCulture__Baht', 'THB')}
                  </Text>
                </View>
              </View>
            ) : (
              <View />
            )}

            {content.program.partners.length > 0 && (
              <View className="pt-6 px-4">
                <Text className="font-medium">
                  {t('ArtCulture__Partner_With', 'In partnership with')}
                </Text>

                <View className="flex flex-row flex-wrap pt-2">
                  {content.program.partners.map(partner => (
                    <Pressable
                      key={`program-detail-partner-item-${partner.id}`}
                      className="border border-jet-black-light mr-2 mb-2"
                      onPress={() => {
                        if (partner.partnerTranslations.link) {
                          Linking.openURL(partner.partnerTranslations.link);
                        }
                      }}>
                      <ImageBackground
                        className="w-[60px] h-[60px] shrink-0"
                        source={{uri: partner.partnerTranslations.thumbnail}}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {content.program.programTranslations.tags.length > 0 && (
              <View className="pt-6 px-4">
                <Text className="font-medium">
                  {t('ArtCulture__Tags', 'Tags')}
                </Text>
                <View className="flex flex-row flex-wrap pt-2">
                  {content.program.programTranslations.tags.map(
                    (tag, index) => (
                      <Pressable
                        key={`program-detail-tag-item-${index}`}
                        className="border border-jet-black-light rounded-3xl mr-2 mb-2"
                        onPress={() => {
                          loadedContent.current = false;
                          navigation.navigate('ArtCultureTagScreen', {
                            tag: tag,
                          });
                        }}>
                        <Text className="py-1 px-3">{tag}</Text>
                      </Pressable>
                    ),
                  )}
                </View>
              </View>
            )}

            <View className="pb-12">
              {content.program && content.program.addOns.length > 0 && (
                <View className="pt-6">
                  <Text className="font-medium px-4">
                    {t('ArtCulture__Add_On_Material', 'Add On Material')}
                  </Text>

                  <ScrollView
                    className="pt-4 pl-4"
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {content.program.addOns.map(addOn => (
                      <Pressable
                        key={`program-detail-add-on-item-${addOn.type}-${addOn.id}`}>
                        <View className="w-[200] h-[360px] bg-gray-300 mr-3">
                          <Pressable
                            onPress={() => {
                              loadedContent.current = false;
                              loadedArtCContent.current = false;

                              navigation.navigate('ArtCultureAddOnScreen', {
                                programId: content.program!.id,
                                id: addOn.id,
                              });
                            }}>
                            <ImageBackground
                              className="w-full h-full"
                              source={{uri: addOn.addOnTranslations.thumbnail}}
                              resizeMode="cover">
                              <LinearGradient
                                colors={[
                                  'rgba(0, 0, 0, 0)',
                                  'rgba(0, 0, 0, .25)',
                                  'rgba(0, 0, 0, .75)',
                                  'rgba(0, 0, 0, .85)',
                                ]}
                                start={{x: 0.5, y: 0}}
                                end={{x: 0.5, y: 1}}
                                locations={[0, 0.7, 0.8, 1]}
                                className="relative w-full h-full">
                                <View className="absolute bottom-4 px-4">
                                  <Text className="text-sm font-medium capitalize text-[#ADBCF4]">
                                    {addOn.type}
                                  </Text>
                                  <Text className="text-white font-bold">
                                    {addOn.addOnTranslations.title}
                                  </Text>
                                </View>
                              </LinearGradient>
                            </ImageBackground>
                          </Pressable>
                        </View>
                      </Pressable>
                    ))}
                    <View className="w-4" />
                  </ScrollView>
                </View>
              )}

              {content.relatePrograms.length > 0 && (
                <>
                  <View className="pt-10 px-4">
                    <Text className="font-medium">
                      {t('ArtCulture__Related_Program', 'Related Programs')}
                    </Text>
                  </View>
                  <ScrollView
                    className="pt-3"
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {content.relatePrograms.map(item => (
                      <ProgramFullDetailItem
                        key={`program-detail-relate-program-${item.artCTypeId}-${item.id}`}
                        item={item}
                        wPercent={50}
                        handleOnPress={() => {
                          loadedContent.current = false;
                        }}
                      />
                    ))}
                    <View className="w-4" />
                  </ScrollView>
                </>
              )}

              {content.relateProducts.length > 0 && (
                <>
                  <View className="pt-6 px-4">
                    <Text className="font-medium">
                      {t('ArtCulture__Related_Product', 'Related Products')}
                    </Text>
                  </View>
                  <ScrollView
                    className="pt-3"
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {content.relateProducts.map(item => (
                      <ProgramFullDetailItem
                        key={`program-detail-relate-product-${item.artCTypeId}-${item.id}`}
                        item={item}
                        wPercent={50}
                        handleOnPress={() => {
                          loadedContent.current = false;
                        }}
                      />
                    ))}
                    <View className="w-4" />
                  </ScrollView>
                </>
              )}

              <View className="h-4" />
            </View>
          </Pressable>
        </ScrollView>
      ) : (
        <View className="relative w-full h-4/5 bg-default-light flex items-center justify-center">
          <Loading isLoading={true} />
        </View>
      )}

      <FloatingStickyMenu
        type="obNewIcon"
        width={30}
        height={30}
        color="white"
        rotation={0}
      />

      <GetTicketButton programId={content?.program?.id.toString()} />
    </View>
  );
};

export default ArtCultureProgramScreen;
