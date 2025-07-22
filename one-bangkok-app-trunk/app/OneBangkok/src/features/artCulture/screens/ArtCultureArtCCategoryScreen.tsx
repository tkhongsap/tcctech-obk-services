import React, {useEffect, useRef, useState} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import t from '~/utils/text';
import {Icon, Text, textWeightVariantTextEditor} from '~/components/atoms';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import ProgramFullDetailItem from '../components/ProgramFullDetailItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {
  IArtCCategoryPage,
  mappingArtCCategory,
  mappingArtCType,
  mappingProgramItems,
} from '~/models/ArtCulture';
import ProgramItem from '../components/ProgramItem';
import {artCultureServices} from '~/services/artCultureService';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import RenderHTML from 'react-native-render-html';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '~/features/sustainability/components/HtmlRenderTextClassStyles';
import Loading from '~/components/organisms/Loading';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ArtCultureArtCCategoryScreen'
>;

const ArtCultureArtCCategoryScreen = ({
  route: {
    params: {typeId, id},
  },
}: Props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const loadedContent = useRef(false);

  const [content, setContent] = useState<IArtCCategoryPage | undefined>();

  const fetchContent = () => {
    artCultureServices
      .fetchArtCCategoryPage(typeId, id, languageSelected)
      .then(res => {
        const {data} = res.data;

        const artCType = mappingArtCType(languageSelected, data.artCType);
        const artCCategory = mappingArtCCategory(
          languageSelected,
          data.ArtCCategory,
        );
        const programs = mappingProgramItems(languageSelected, data.programs);

        if (!artCType || !artCCategory) {
          navigation.navigate('ArtCultureLandingScreen');
        }

        setContent({
          artCType,
          artCCategory,
          programs,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!loadedContent.current && languageSelected && typeId && id) {
      loadedContent.current = true;
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSelected, typeId, id]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    logScreenView('ArtCultureArtCCategoryScreen');
  }, []);
  
  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      {content && content.artCType && content.artCCategory ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <ImageBackground
              className="h-[488px]"
              source={{uri: content.artCCategory.artCTranslation.banner}}
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

            <View className="px-4 pt-6">
              <Text className="text-base text-subtitle-light font-bold">
                {content.artCType.artCTranslation.title}
              </Text>
              <Text className="text-2xl font-obMedium pb-4">
                {content.artCCategory.artCTranslation.title}
              </Text>

              {content.artCCategory.artCTranslation.locations &&
              content.artCCategory.artCTranslation.locations.length > 0 ? (
                <View>
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
                  {content.artCCategory.artCTranslation.locations.map(
                    (item, index) => (
                      <View key={`art-c-category-location-item-${index}`}>
                        <Text className="text-subtitle-muted-light">
                          {item}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              ) : (
                <View />
              )}

              {content.artCCategory.artCTranslation.openingHours &&
              content.artCCategory.artCTranslation.openingHours.length > 0 ? (
                <View className="pb-4">
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
                  {content.artCCategory.artCTranslation.openingHours.map(
                    (item, index) => (
                      <View key={`art-c-category-opening-hour-item-${index}`}>
                        <Text className="text-subtitle-muted-light">
                          {item}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              ) : (
                <View />
              )}

              {content.artCCategory.displayFreeLabel ? (
                <View className="pb-4">
                  <View className="flex flex-row items-center">
                    <ImageBackground
                      className="w-5 h-4 shrink-0"
                      source={require('../../../assets/artc/icons/thb-currency.png')}
                      resizeMode="contain"
                    />
                    <Text className="text-dark-gray-light font-obMedium ml-2">
                      {t('ArtCulture__Admission_Fee', 'Admission Fee')}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-subtitle-muted-light">Free</Text>
                  </View>
                </View>
              ) : (
                <>
                  {content.artCCategory.artCTranslation.enterFee &&
                  content.artCCategory.artCTranslation.enterFee > 0 ? (
                    <View className="pb-4">
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
                          {content.artCCategory.artCTranslation.enterFee}
                          {t('ArtCulture__Baht', 'THB')}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View />
                  )}
                </>
              )}

              {content.artCCategory.artCTranslation.externalLink !== '' ? (
                <View className="pb-4">
                  <View className="flex flex-row items-center">
                    <ImageBackground
                      className="w-5 h-4 shrink-0"
                      source={require('../../../assets/artc/icons/navigator.png')}
                      resizeMode="contain"
                    />
                    <Text className=" text-dark-gray-light font-obMedium ml-2">
                      {t('ArtCulture__External_Link', 'External link')}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        content.artCCategory!.artCTranslation.externalLink ||
                          '',
                      )
                    }>
                    <Text className="text-subtitle-muted-light">
                      {content.artCCategory.artCTranslation.externalLink}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View />
              )}
            </View>

            <View className="pt-3 mt-4 mx-4 border-t border-line-light" />

            <View className="pt-4 pb-4 px-4">
              <RenderHTML
                classesStyles={HTMLRenderTextClassStyles}
                tagsStyles={HTMLRenderTextTagsStyles}
                contentWidth={Dimensions.get('window').width}
                source={{
                  html: content.artCCategory.artCTranslation.desc
                    ? replaceTextHtml(
                        content.artCCategory.artCTranslation.desc + '',
                      )
                    : '',
                }}
                systemFonts={Object.values(textWeightVariantTextEditor)}
              />
            </View>

            {content.artCCategory.artCTranslation.tags &&
              content.artCCategory.artCTranslation.tags.length > 0 && (
                <View className="pt-6 px-4">
                  <Text className="font-medium">
                    {t('ArtCulture__Tags', 'Tags')}
                  </Text>
                  <View className="flex flex-row flex-wrap pt-2">
                    {content.artCCategory.artCTranslation.tags.map(
                      (tag, index) => (
                        <Pressable
                          key={`art-c-category-tag-item-${index}`}
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

            {content.artCCategory.displayList ? (
              <>
                {content.programs.length > 0 && (
                  <>
                    <View className="px-4 py-3">
                      {content.artCCategory.artCTranslation
                        .programSectionTitle && (
                        <View className="pb-2">
                          <Text className="text-xl font-obMedium">
                            {
                              content.artCType.artCTranslation
                                .programSectionTitle
                            }
                          </Text>
                        </View>
                      )}

                      <View className="flex flex-row justify-between">
                        <Text className="text-subtitle-muted-light font-obMedium">
                          {t('ArtCulture__Showing', 'Showing')}{' '}
                          {content.programs.length}{' '}
                          {t('ArtCulture__Items', 'items')}
                        </Text>

                        <Pressable className="hidden">
                          <Text>{t('ArtCulture__Filter', 'Filter')}</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View className="flex flex-row flex-wrap px-2">
                      {content.programs.map(item => (
                        <ProgramItem
                          key={`art-c-category-page-program-item-${item.artCTypeId}-${item.id}`}
                          item={item}
                        />
                      ))}
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                {content.programs.length > 0 && (
                  <View className="pt-10">
                    {content.artCCategory.artCTranslation
                      .programSectionTitle && (
                      <View className="px-4">
                        <Text className="font-medium">
                          {content.artCType.artCTranslation.programSectionTitle}
                        </Text>
                      </View>
                    )}
                    <ScrollView
                      className="pt-3"
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {content.programs.map(item => (
                        <ProgramFullDetailItem
                          key={`art-c-category-page-program-full-detail-item-${item.artCTypeId}-${item.id}`}
                          item={item}
                          wPercent={50}
                        />
                      ))}
                      <View className="w-4" />
                    </ScrollView>
                  </View>
                )}
              </>
            )}

            <View className="h-8" />
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
    </View>
  );
};

export default ArtCultureArtCCategoryScreen;
