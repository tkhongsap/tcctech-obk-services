import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import LinearGradient from 'react-native-linear-gradient';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {WebView} from 'react-native-webview';
import {
  IAddOnPage,
  mappingAddOn,
  mappingAddOns,
  mappingProgramItems,
} from '~/models/ArtCulture';
import ProgramFullDetailItem from '../components/ProgramFullDetailItem';
import {artCultureServices} from '~/services/artCultureService';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '~/features/sustainability/components/HtmlRenderTextClassStyles';
import RenderHTML from 'react-native-render-html';
import Loading from '~/components/organisms/Loading';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ArtCultureAddOnScreen'
>;

const ArtCultureAddOnScreen = ({
  route: {
    params: {programId, id},
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

  const [content, setContent] = useState<IAddOnPage | undefined>();

  const fetchContent = () => {
    artCultureServices
      .fetchAddOnPage(programId || 0, id, languageSelected)
      .then(res => {
        const {data} = res.data;

        const addOn = mappingAddOn(languageSelected, data.addOn);
        const relateAddOns = data.relateAddOns
          ? mappingAddOns(languageSelected, data.relateAddOns)
          : [];
        const relatePrograms = data.relatePrograms
          ? mappingProgramItems(languageSelected, data.relatePrograms)
          : [];

        if (!addOn) {
          navigation.navigate('ArtCultureLandingScreen');
        }

        setContent({
          addOn,
          relateAddOns,
          relatePrograms,
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
  }, [languageSelected, programId, id]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    logScreenView('ArtCultureAddOnScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      {content && content.addOn ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <ImageBackground
              className="h-[488px]"
              source={{uri: content.addOn.addOnTranslations.banner}}
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
              <Text className="text-base text-subtitle-light font-bold capitalize">
                {content.addOn.type}
              </Text>
              <Text className="text-3xl font-bold pt-4">
                {content.addOn.addOnTranslations.title}
              </Text>
            </View>

            {content.addOn.type === 'audio' && (
              <View className="pt-6 px-4">
                <WebView
                  className="w-full"
                  style={{height: Dimensions.get('screen').width * 0.45}}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction
                  source={{
                    uri: content.addOn.addOnTranslations.audio,
                  }}
                />
              </View>
            )}

            {content.addOn.type === 'video' && (
              <View className="pt-6 px-4">
                <WebView
                  className="w-full"
                  style={{height: Dimensions.get('screen').width * 0.52}}
                  allowsFullscreenVideo
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction
                  source={{
                    uri: content.addOn.addOnTranslations.video,
                  }}
                />
              </View>
            )}

            <View className="pt-4 px-4">
              <RenderHTML
                classesStyles={HTMLRenderTextClassStyles}
                tagsStyles={HTMLRenderTextTagsStyles}
                contentWidth={Dimensions.get('window').width}
                source={{
                  html: content.addOn.addOnTranslations.desc
                    ? replaceTextHtml(content.addOn.addOnTranslations.desc + '')
                    : '',
                }}
                systemFonts={Object.values(textWeightVariantTextEditor)}
              />
            </View>

            {content.addOn.partners.length > 0 && (
              <View className="pt-6 px-4">
                <Text className="font-medium">
                  {t('ArtCulture__Partner_With', 'In partnership with')}
                </Text>

                <View className="flex flex-row flex-wrap pt-2">
                  {content.addOn.partners.map(partner => (
                    <Pressable
                      key={`add-on-page-partner-item-${partner.id}`}
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

            {content.addOn.addOnTranslations.tags.length > 0 && (
              <View className="pt-6 px-4">
                <Text className="font-medium">
                  {t('ArtCulture__Tags', 'Tags')}
                </Text>
                <View className="flex flex-row flex-wrap pt-2">
                  {content.addOn.addOnTranslations.tags.map((tag, index) => (
                    <Pressable
                      key={`add-on-page-tag-item-${index}`}
                      className="border border-jet-black-light rounded-3xl mr-2 mb-2"
                      onPress={() => {
                        loadedContent.current = false;
                        navigation.navigate('ArtCultureTagScreen', {
                          tag: tag,
                        });
                      }}>
                      <Text className="py-1 px-3">{tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View className="pb-12">
              {content.relateAddOns.length > 0 && (
                <View className="pt-6">
                  <Text className="font-medium px-4">
                    {t('ArtCulture__Add_On_Material', 'Add On Material')}
                  </Text>

                  <ScrollView
                    className="pt-4 pl-4"
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {content.relateAddOns.map(addOn => (
                      <Pressable
                        key={`add-on-page-relate-add-on-${addOn.id}`}
                        onPress={() => {
                          loadedContent.current = false;
                          navigation.navigate('ArtCultureAddOnScreen', {
                            programId: programId,
                            id: addOn.id,
                          });
                        }}>
                        <View className="w-[200] h-[360px] bg-gray-300 mr-3">
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
                                <Text className="text-sm font-medium text-[#ADBCF4] capitalize">
                                  {addOn.type}
                                </Text>
                                <Text className="text-white font-bold">
                                  {addOn.addOnTranslations.title}
                                </Text>
                              </View>
                            </LinearGradient>
                          </ImageBackground>
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
                    className="pt-3 pb-8"
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {content.relatePrograms.map(item => (
                      <ProgramFullDetailItem
                        key={`add-on-page-relate-program-${item.id}`}
                        item={item}
                        wPercent={50}
                      />
                    ))}
                    <View className="w-4" />
                  </ScrollView>
                </>
              )}
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
    </View>
  );
};

export default ArtCultureAddOnScreen;
