import {useHookstate} from '@hookstate/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import clsx from 'clsx';
import dayjs from 'dayjs';
import {map} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import Config from 'react-native-config';
import RenderHTML from 'react-native-render-html';
import Share from 'react-native-share';
import {Text, textWeightVariantTextEditor} from '~/components/atoms';
import Loading from '~/components/organisms/Loading';
import {bookingSettingAction} from '~/features/booking/state/booking-setting';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '~/features/sustainability/components/HtmlRenderTextClassStyles';
import {
  IArtCPage,
  IProgram,
  mappingArtCType,
  mappingArtCTypes,
  mappingPlaylists,
  mappingProgramItems,
} from '~/models/ArtCulture';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {artCultureServices} from '~/services/artCultureService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import authenState from '~/states/authen/authenState';
import firebaseConfigState from '~/states/firebase';
import t from '~/utils/text';
import ArtCBackHeader from '../components/ArtCBackHeader';
import MemberOnlyModal from '../components/MemberOnlyModal';
import ProgramFilter from '../components/ProgramFilter';
import ProgramFullDetailItem from '../components/ProgramFullDetailItem';
import ProgramItem from '../components/ProgramItem';
import {logScreenView} from '~/utils/logGA';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtCultureArtCScreen'>;

interface ITypeMenu {
  id: number;
  posX: number;
}

export interface IFilterSelectedItem {
  name: string;
  type: string[];
}

const ArtCultureArtCScreen = ({
  route: {
    params: {id},
  },
}: Props) => {
  const navigation = useNavigation();
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const loadedContent = useRef(false);

  const enableBookmarkContent =
    firebaseConfigState.enable_bookmark_content.value || false;
  const enableShareContent =
    firebaseConfigState.enable_share_content.value || false;

  const [content, setContent] = useState<IArtCPage | undefined>();
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [availableBookingProgram, setAvailableBookingProgram] = useState<
    Record<number, boolean>
  >({});

  const [isDisplayFilter, setIsDisplayFilter] = useState(false);
  const [filter, setFilter] = useState<IFilterSelectedItem>({
    name: '',
    type: [],
  });

  const fetchContent = () => {
    artCultureServices
      .fetchArtCTypePage(id, languageSelected)
      .then(res => {
        const {data} = res.data;

        const artCTypes = mappingArtCTypes(languageSelected, data.artCTypes);
        const artCType = mappingArtCType(languageSelected, data.artCType);
        const programItems = mappingProgramItems(
          languageSelected,
          data.programs,
        );
        const playlist = data.playlist
          ? mappingPlaylists(languageSelected, data.playlist)
          : [];

        if (!artCType) {
          navigation.navigate('ArtCultureLandingScreen');
        }

        setContent({
          artCTypes,
          artCType,
          programs: programItems,
          playlist,
        });
        setPrograms(programItems);
        return data;
      })
      .then(data => {
        return bookingSettingAction.fetchAvailablePrograms(
          map(data.programs, 'id'),
          dayjs(),
        );
      })
      .then(availablePrograms => {
        setAvailableBookingProgram(availablePrograms);
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

  const [menuTypeRef, setMenuTypeRef] = useState<ScrollView | null>(null);
  const [menuTypePos, setMenuTypePos] = useState<ITypeMenu[]>([]);
  useEffect(() => {
    setTimeout(() => {
      if (id && content && menuTypeRef && menuTypePos.length > 0) {
        const menuType = menuTypePos.find(item => item.id === id);
        if (menuType) {
          menuTypeRef.scrollTo({x: menuType.posX, y: 0, animated: false});
        }
      }
    }, 500);
  }, [id, content, menuTypeRef, menuTypePos]);

  const onFilterChange = (type: string, value: string) => {
    if (type === 'name') {
      setFilter({
        ...filter,
        name: value,
      });
    }

    if (type === 'type') {
      let newValue = filter.type.includes(value)
        ? filter.type.filter(item => item !== value)
        : [...filter.type, value];

      if (value === '') {
        newValue = [];
      }

      setFilter({
        ...filter,
        type: newValue.length === 6 ? [] : newValue,
      });
    }

    if (type === 'reset') {
      setFilter({
        name: '',
        type: [],
      });
    }
  };

  const applyFilter = () => {
    setIsDisplayFilter(false);
    if (content && content.programs.length > 0) {
      const filteredPrograms = content.programs.filter(item => {
        let isName = false;
        let isType = false;

        if (filter.name === '') {
          isName = true;
        } else {
          isName = item.programTranslations.author
            .toLowerCase()
            .includes(filter.name.toLowerCase());
        }

        if (filter.type.length === 0) {
          isType = true;
        } else {
          isType =
            item.type.filter((itemType: string) =>
              filter.type.includes(itemType),
            ).length > 0;
        }

        return isName && isType;
      });

      setPrograms(filteredPrograms);
    }
  };

  const shareContent = async () => {
    if (content && content.artCType) {
      try {
        Share.open({
          url: `${Config.UNIVERSAL_LINK}/art-culture/${content.artCType.id}`,
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
    if (!authenState.token.value) {
      setIsMemberOnlyModalVisible(true);
      return;
    }

    if (!isFetchBookmarkDone) {
      return;
    }

    if (isBookmark) {
      artCultureServices
        .deleteBookmark('art_culture_category', `${content?.artCType?.id}`)
        .then(() => {
          setIsBookmark(false);
        })
        .catch(error => {
          console.warn('error =>', error);
        });
    } else {
      artCultureServices
        .createBookmark('art_culture_category', `${content?.artCType?.id}`)
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

        const artCType = data.filter(
          (item: any) =>
            item.contentType === 'art_culture_category' &&
            item.contentId === `${content?.artCType?.id}`,
        );

        if (artCType.length > 0) {
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
    if (authenState && authenState.token.value && content && content.artCType) {
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
        content.artCType &&
        enableBookmarkContent
      ) {
        fetchBookmark();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, enableBookmarkContent]),
  );

  useEffect(() => {
    logScreenView('ArtCultureArtCScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      <ArtCBackHeader
        title={t('BU_Art_and_Culture', 'Art & Culture')}
        hide={isDisplayFilter}
      />

      {isMemberOnlyModalVisible && (
        <MemberOnlyModal onClose={() => setIsMemberOnlyModalVisible(false)} />
      )}

      {content && content.artCType ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <View className="py-5">
              <ScrollView
                ref={ref => setMenuTypeRef(ref)}
                className={'px-4'}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                bounces={false}>
                {content.artCTypes.map((item, index) => (
                  <View
                    key={`art-c-page-type-item-${item.id}`}
                    onLayout={({nativeEvent}) => {
                      menuTypePos[index] = {
                        id: item.id,
                        posX: nativeEvent.layout.x,
                      };
                      setMenuTypePos(menuTypePos);
                    }}>
                    <Pressable
                      className={clsx([
                        'px-3 py-[2px] border mr-3',
                        id === item.id
                          ? 'bg-jet-black-light border-jet-black'
                          : 'bg-white border-inactive-light',
                      ])}
                      onPress={() => {
                        loadedContent.current = false;
                        setIsBookmark(false);
                        navigation.navigate('ArtCultureArtCScreen', {
                          id: item.id,
                        });
                      }}>
                      <Text className={clsx([id === item.id && 'text-white'])}>
                        {item.artCTranslation.title}
                      </Text>
                    </Pressable>
                  </View>
                ))}
                <View className="w-5" />
              </ScrollView>
            </View>

            {content.artCType &&
            content.artCType.artCTranslation.banner !== '' ? (
              <View>
                <ImageBackground
                  className="w-full bg-white"
                  resizeMode="cover"
                  style={{
                    height: Dimensions.get('screen').width * 0.575,
                  }}
                  source={{
                    uri: content.artCType.artCTranslation.banner,
                  }}
                />
              </View>
            ) : (
              <View />
            )}

            <View className="px-4 pt-6">
              <Text className="text-2xl font-obMedium pb-3">
                {content.artCType.artCTranslation.title}
              </Text>

              {(enableBookmarkContent || enableShareContent) && (
                <View className="pt-4 pb-6 border-t border-line-light">
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
              )}

              {content.artCType.artCTranslation.locations &&
              content.artCType.artCTranslation.locations.length > 0 ? (
                <View className="pb-4">
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
                  {content.artCType.artCTranslation.locations.map(
                    (item, index) => (
                      <View key={`art-c-page-location-item-${index}`}>
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

              {content.artCType.artCTranslation.openingHours &&
              content.artCType.artCTranslation.openingHours.length > 0 ? (
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
                  {content.artCType.artCTranslation.openingHours.map(
                    (item, index) => (
                      <View key={`art-c-page-opening-hour-item-${index}`}>
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

              {content.artCType.displayFreeLabel ? (
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
                  {content.artCType.artCTranslation.enterFee &&
                  content.artCType.artCTranslation.enterFee > 0 ? (
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
                        <Text className="text-subtitle-muted-light">
                          {content.artCType.artCTranslation.enterFee}
                          {t('ArtCulture__Baht', 'THB')}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View />
                  )}
                </>
              )}

              {content.artCType.artCTranslation.externalLink !== '' ? (
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
                        content.artCType!.artCTranslation.externalLink || '',
                      )
                    }>
                    <Text className="text-subtitle-muted-light underline">
                      {content.artCType.artCTranslation.externalLink}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View />
              )}

              <View className="pb-6">
                <RenderHTML
                  classesStyles={HTMLRenderTextClassStyles}
                  tagsStyles={HTMLRenderTextTagsStyles}
                  contentWidth={Dimensions.get('window').width}
                  source={{
                    html: content.artCType.artCTranslation.desc
                      ? replaceTextHtml(
                          content.artCType.artCTranslation.desc + '',
                        )
                      : '',
                  }}
                  systemFonts={Object.values(textWeightVariantTextEditor)}
                />
              </View>
            </View>

            {content.artCType.artCCategory.length > 0 && (
              <View className="pt-4 pb-4">
                {content.artCType.artCTranslation.categorySectionTitle && (
                  <Text className="font-obMedium pb-2 px-4">
                    {content.artCType.artCTranslation.categorySectionTitle}
                  </Text>
                )}
                <ScrollView
                  className="px-4"
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {content.artCType.artCCategory.map(item => (
                    <View
                      key={`art-c-page-category-item-${item.artCTypeId}-${item.id}`}>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('ArtCultureArtCCategoryScreen', {
                            typeId: item.artCTypeId,
                            id: item.id,
                          });
                        }}>
                        <ImageBackground
                          className="flex flex-row items-center justify-center p-2 w-28 h-28 mr-4"
                          source={{uri: item.artCTranslation.thumbnail}}
                          resizeMode="cover">
                          <Text
                            numberOfLines={3}
                            className="font-obMedium text-white text-center">
                            {item.artCTranslation.title}
                          </Text>
                        </ImageBackground>
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {content.playlist.length > 0 && (
              <View className="pt-4 px-4">
                {content.artCType.artCTranslation.playlistSectionTitle && (
                  <Text className="font-obMedium pb-2">
                    {content.artCType.artCTranslation.playlistSectionTitle}
                  </Text>
                )}

                <View>
                  {content.playlist.map(item => (
                    <Pressable
                      key={`art-c-page-playlist-item-${item.id}`}
                      className="flex flex-row border border-light-silver-light mb-4"
                      onPress={() => {
                        try {
                          Linking.openURL(item.link);
                        } catch (error) {
                          console.log("can't open url", error);
                        }
                      }}>
                      <ImageBackground
                        className="w-[120px] h-[120px]"
                        source={{uri: item.thumbnail}}
                        resizeMode="cover"
                      />
                      <View className="flex flex-col w-full px-3 py-2 shrink justify-between">
                        <View>
                          <Text className="font-obMedium">{item.title}</Text>
                          <Text className="text-xs">{item.author}</Text>
                          <Text
                            className="text-xs text-muted-800-light pt-1"
                            numberOfLines={2}>
                            {item.desc}
                          </Text>
                        </View>

                        <Text className="text-xs">
                          {dayjs(item.publishedAt).format('DD MMM YYYY')} |{' '}
                          {item.durations > 60
                            ? `${Math.floor(item.durations / 60)} hr ${
                                item.durations % 60 !== 0
                                  ? `${item.durations % 60} mins`
                                  : ''
                              }`
                            : `${item.durations} mins`}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {content.artCType.displayList ? (
              <>
                <View className="px-4 py-3">
                  {content.artCType.artCTranslation.programSectionTitle && (
                    <View className="pb-2">
                      <Text className="text-xl font-obMedium">
                        {content.artCType.artCTranslation.programSectionTitle}
                      </Text>
                    </View>
                  )}

                  <View className="flex flex-row justify-between">
                    <Text className="text-subtitle-muted-light font-obMedium">
                      {t('ArtCulture__Showing', 'Showing')} {programs.length}{' '}
                      {t('ArtCulture__Items', 'items')}
                    </Text>

                    <Pressable
                      onPress={() => {
                        setIsDisplayFilter(true);
                      }}>
                      <Text>{t('ArtCulture__Filter', 'Filter')}</Text>
                    </Pressable>
                  </View>
                </View>

                <View className="flex flex-row flex-wrap px-2">
                  {programs.map(item => (
                    <ProgramItem
                      key={`art-c-page-program-item-${item.artCTypeId}-${item.id}`}
                      item={item}
                    />
                  ))}
                </View>
              </>
            ) : (
              <>
                {programs.length > 0 && (
                  <View className="pt-10">
                    {content.artCType.artCTranslation.programSectionTitle && (
                      <View className="px-4">
                        <Text className="font-medium">
                          {content.artCType.artCTranslation.programSectionTitle}
                        </Text>
                      </View>
                    )}
                    <ScrollView
                      className="pt-3 pb-8"
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {programs.map(item => (
                        <ProgramFullDetailItem
                          key={`art-c-page-program-full-detail-item-${item.artCTypeId}-${item.id}`}
                          item={{
                            ...item,
                            isGetTicketAvailable:
                              availableBookingProgram[item.id],
                          }}
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

      {isDisplayFilter && (
        <ProgramFilter
          filterValue={filter}
          onFilterChange={onFilterChange}
          closeFilter={() => setIsDisplayFilter(false)}
          onApplyFilter={applyFilter}
        />
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

export default ArtCultureArtCScreen;
