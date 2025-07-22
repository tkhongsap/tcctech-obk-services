/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {Text} from '~/components/atoms';
import {
  IArtCType,
  IProgram,
  mappingArtCTypes,
  mappingProgramItems,
} from '~/models/ArtCulture';
import ProgramRowItem from '../components/RowItem';
import clsx from 'clsx';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import ArtCBackHeader from '../components/ArtCBackHeader';
import {artCultureServices} from '~/services/artCultureService';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {Fetch} from '~/utils/fetch/fetch';
import Loading from '~/components/organisms/Loading';
import {useFocusEffect} from '@react-navigation/native';
import {IRouteItem} from '~/features/sustainability/screens/WalkingSelectRouteScreen';
import {
  IDigitalCategory,
  IFileDownloadItem,
} from '~/features/sustainability/components/ISustainability';
import {logScreenView} from '~/utils/logGA';
import authenState from '~/states/authen/authenState';
import t from '~/utils/text';

interface IBookmark {
  contentType: string;
  contentId: string;
  createdAt: Date;
}

interface ISustainBookmark {
  id: string;
  type: string;
  title: string;
  thumbnail: string;
}

interface IArtCTypeItem {
  id: number;
  title: string;
}

const ArtCultureBookmarkScreen = () => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();
  const loadedContent = useRef(false);

  const [tabSelected, setTabSelected] = useState<string>('');

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchBookmark();
  };

  const [bookmark, setBookmark] = useState<IBookmark[] | null>(null);
  const fetchBookmark = async () => {
    await artCultureServices
      .getBookmark()
      .then(res => {
        const {data} = res.data;
        setBookmark(
          data.map((item: any) => {
            return {
              contentType: item.contentType,
              contentId: item.contentId,
              createdAt: item.createdAt,
            };
          }),
        );
      })
      .catch(error => {
        console.log(error);
        setBookmark([]);
      });

    setRefreshing(false);
  };

  const [artCAllType, setArtCAllType] = useState<IArtCTypeItem[]>([]);
  const fetchAllArtCType = async () => {
    const items: IArtCTypeItem[] = [];
    await artCultureServices
      .fetchAllArtCTypePage(languageSelected)
      .then(res => {
        const {data} = res.data;
        data.forEach((item: any) => {
          const localeItem = item.artCTranslation.find(
            (itemLocale: any) => itemLocale.locale === languageSelected,
          );

          if (localeItem) {
            items.push({
              id: item.id,
              title: localeItem.title,
            });
          }
        });
      })
      .catch(error => {
        console.log(error);
      });

    setArtCAllType(items);
  };

  useEffect(() => {
    if (!loadedContent.current) {
      loadedContent.current = true;

      fetchAllArtCType();

      setBookmark([]);
      setArtCTypes([]);
      setArtCPrograms([]);
      setSustainBookmark([]);
      setMapRouteContent([]);
      setDigitalLibraryContent([]);

      fetchBookmark();
    }
  }, []);

  const [artCTypes, setArtCTypes] = useState<IArtCType[] | null>(null);
  const fetchArtCultureTypeContent = async () => {
    if (!bookmark || bookmark.length === 0) {
      setArtCTypes([]);
      return;
    }

    const bookmarkArtCTypeId = bookmark
      .filter(item => item.contentType === 'art_culture_category')
      .map(item => item.contentId);
    if (bookmarkArtCTypeId.length === 0) {
      setArtCTypes([]);
      return;
    }

    await artCultureServices
      .fetchAllArtCTypePage(languageSelected)
      .then(res => {
        const {data} = res.data;

        const artCTypesContent = mappingArtCTypes(languageSelected, data);
        const selectArtCTypeBookmark = artCTypesContent.filter(
          (item: IArtCType) => bookmarkArtCTypeId.includes(`${item.id}`),
        );
        setArtCTypes(selectArtCTypeBookmark);
      })
      .catch(err => {
        setArtCTypes([]);
        console.log(err);
      });
  };

  const [artCPrograms, setArtCPrograms] = useState<IProgram[] | null>(null);
  const fetchArtCultureProgramContent = async () => {
    if (!bookmark || bookmark.length === 0) {
      setArtCPrograms([]);
      return;
    }

    const bookmarkProgramId = bookmark
      .filter(item => item.contentType === 'art_culture_program')
      .map(item => item.contentId);
    if (bookmarkProgramId.length === 0) {
      setArtCPrograms([]);
      return;
    }

    await artCultureServices
      .fetchProgramsPage(languageSelected)
      .then(res => {
        const {data} = res.data;

        const programs = mappingProgramItems(languageSelected, data.programs);
        const selectProgramBookmark = programs.filter((item: IProgram) =>
          bookmarkProgramId.includes(`${item.id}`),
        );

        setArtCPrograms(selectProgramBookmark);
      })
      .catch(err => {
        setArtCPrograms([]);
        console.log(err);
      });
  };

  const [sustainBookmark, setSustainBookmark] = useState<
    ISustainBookmark[] | null
  >(null);
  const fetchSustainContent = async () => {
    if (!bookmark || bookmark.length === 0) {
      setSustainBookmark([]);
      return;
    }

    const bookmarkSustainBannerId = bookmark
      .filter(item => item.contentType === 'sustainability_banner')
      .map(item => item.contentId);
    const tempSustainBookmark: ISustainBookmark[] = [];
    for (const id of bookmarkSustainBannerId) {
      let objParam = {
        sLanguage: languageSelected || 'en',
        sID: id,
        isBanner: true,
      };

      const res = await Fetch('GetContentDetail', objParam);
      const {sHeaderImagePath, sTitle} = res;
      if (res && sHeaderImagePath && sTitle) {
        tempSustainBookmark.push({
          id: id,
          type: 'sustainability_banner',
          title: sTitle,
          thumbnail: sHeaderImagePath,
        });
      }
    }

    const bookmarkSustainNormalId = bookmark
      .filter(item => item.contentType === 'sustainability_content')
      .map(item => item.contentId);
    for (const id of bookmarkSustainNormalId) {
      let objParam = {
        sLanguage: languageSelected || 'en',
        sID: id,
        isBanner: false,
      };

      const res = await Fetch('GetContentDetail', objParam);
      const {sHeaderImagePath, sTitle} = res;
      if (res && sHeaderImagePath && sTitle) {
        tempSustainBookmark.push({
          id: id,
          type: 'sustainability_content',
          title: sTitle,
          thumbnail: sHeaderImagePath,
        });
      }
    }

    setSustainBookmark(tempSustainBookmark);
  };

  const [mapRouteContent, setMapRouteContent] = useState<IRouteItem[]>([]);
  const fetchWalkingMeetingMapContent = async () => {
    if (!bookmark || bookmark.length === 0) {
      setMapRouteContent([]);
      return;
    }

    const mapIds = bookmark
      .filter(item => item.contentType === 'walking_meeting_map_route')
      .map(item => item.contentId);

    await artCultureServices
      .fetchWalkingMeetingMaps(languageSelected)
      .then(res => {
        const {data} = res.data;
        setMapRouteContent(
          data.filter((item: IRouteItem) => mapIds.includes(`${item.id}`)),
        );
      })
      .catch(err => {
        console.error(err);
      });
  };

  const [digitalLibraryContent, setDigitalLibraryContent] = useState<
    IFileDownloadItem[]
  >([]);
  const fetchDigitalLibraryContent = async () => {
    if (!bookmark || bookmark.length === 0) {
      setDigitalLibraryContent([]);
      return;
    }

    const digitalItemIds = bookmark
      .filter(item => item.contentType === 'digital_library_item')
      .map(item => item.contentId);

    try {
      const categoryRes = await Fetch('GetDigitalLibraryCategory', {
        sLanguage: languageSelected || 'en',
      });

      const {lstCategory} = categoryRes;
      const tempDigitalLibraryContent: IFileDownloadItem[] = [];
      if (lstCategory && lstCategory.length > 0) {
        lstCategory.forEach(async (item: IDigitalCategory) => {
          const digitalRes = await Fetch('GetDigitalLibraryFile', {
            sLanguage: languageSelected || 'en',
            sID: item.sID,
          });

          const {lstFile} = digitalRes;

          lstFile.forEach((file: IFileDownloadItem) => {
            if (digitalItemIds.includes(file.sID)) {
              tempDigitalLibraryContent.push(file);
            }
          });
        });

        setDigitalLibraryContent(tempDigitalLibraryContent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [bookmarkContent, setBookmarkContent] = useState<any[]>([]);
  const buildBookmarkContent = async () => {
    if (!bookmark) {
      return;
    }

    const resDigitalLib = await Fetch('GetDigitalLibraryCategory', {
      sLanguage: languageSelected,
    });

    const tempBuildContent: any[] = [];
    bookmark.forEach(bkItem => {
      let cnt;

      if (bkItem.contentType === 'art_culture_category') {
        cnt = (artCTypes || []).find(item => `${item.id}` === bkItem.contentId);
      }

      if (bkItem.contentType === 'art_culture_program') {
        cnt = (artCPrograms || []).find(
          item => `${item.id}` === bkItem.contentId,
        );
      }

      if (
        bkItem.contentType === 'sustainability_banner' ||
        bkItem.contentType === 'sustainability_content'
      ) {
        cnt = (sustainBookmark || []).find(
          item => `${item.id}` === bkItem.contentId,
        );
      }

      if (bkItem.contentType === 'walking_meeting_map') {
        cnt = {
          type: 'walking_meeting_map',
          id: '1',
        };
      }

      if (bkItem.contentType === 'walking_meeting_map_route') {
        cnt = (mapRouteContent || []).find(
          item => `${item.id}` === bkItem.contentId,
        );
      }

      if (
        bkItem.contentType === 'digital_library' &&
        resDigitalLib.nStatusCode === 200
      ) {
        cnt = {
          type: 'digital_library',
          id: '1',
          title: resDigitalLib.sTitle,
          thumbnail: resDigitalLib.sPathBackground,
        };
      }

      if (bkItem.contentType === 'digital_library_item') {
        cnt = {
          id: bkItem.contentId,
          ...(digitalLibraryContent || []).find(
            item => `${item.sID}` === bkItem.contentId,
          ),
        };
      }

      if (cnt) {
        tempBuildContent.push({
          type: bkItem.contentType,
          content: cnt,
        });
      }
    });

    setBookmarkContent(tempBuildContent);
  };

  const [firstLoaded, setFirstLoaded] = useState(false);
  const fetchAllBookmarkContent = async () => {
    await fetchArtCultureTypeContent();
    await fetchArtCultureProgramContent();
    await fetchSustainContent();
    await fetchWalkingMeetingMapContent();
    await fetchDigitalLibraryContent();
    setTimeout(() => {
      setFirstLoaded(true);
    }, 500);
  };

  useEffect(() => {
    if (bookmark) {
      if (bookmark.length > 0) {
        setFirstLoaded(false);
        fetchAllBookmarkContent();
      } else {
        setArtCTypes([]);
        setArtCPrograms([]);
        setSustainBookmark([]);
        setMapRouteContent([]);
        setDigitalLibraryContent([]);
      }
    } else {
      setFirstLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmark]);

  useEffect(() => {
    if (firstLoaded) {
      buildBookmarkContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoaded]);

  useFocusEffect(
    useCallback(() => {
      fetchBookmark();
    }, []),
  );

  useEffect(() => {
    logScreenView('ArtCultureBookmarkScreen');
  }, []);

  const handleBookmarkAction = (type: string, contentId: string) => {
    if (!authenState.token.value) {
      return;
    }

    artCultureServices
      .deleteBookmark(type, contentId)
      .then(() => {
        const tmpNewCnt: any[] = [];
        bookmarkContent.forEach(item => {
          if (item.type === type && `${item.content.id}` === contentId) {
            return;
          }

          tmpNewCnt.push(item);
        });

        setBookmarkContent(tmpNewCnt);
      })
      .catch(error => {
        console.warn('error =>', error);
      });
  };

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      <ArtCBackHeader title={t('General__My_Bookmark', 'My Bookmark')} />
      {firstLoaded &&
      bookmark &&
      artCTypes &&
      artCPrograms &&
      sustainBookmark ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View className="py-2">
            <ScrollView
              className="px-4"
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              bounces={false}>
              <Pressable
                onPress={() => setTabSelected('')}
                className={clsx([
                  'border-b shrink-0 text-nowrap px-2',
                  tabSelected === ''
                    ? 'border-jet-black-light'
                    : 'border-light-silver-light',
                ])}
                style={{minWidth: Dimensions.get('screen').width * 0.3}}>
                <Text
                  className={clsx([
                    'text-center py-2',
                    tabSelected === ''
                      ? 'font-obMedium'
                      : 'text-subtitle-muted-light',
                  ])}>
                  {t('ArtCulture__All', 'All') || 'All'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setTabSelected('art-c')}
                className={clsx([
                  'border-b shrink-0 text-nowrap px-2',
                  tabSelected === 'art-c'
                    ? 'border-jet-black-light'
                    : 'border-light-silver-light',
                ])}
                style={{minWidth: Dimensions.get('screen').width * 0.3}}>
                <Text
                  className={clsx([
                    'text-center py-2',
                    tabSelected === 'art-c'
                      ? 'font-obMedium'
                      : 'text-subtitle-muted-light',
                  ])}>
                  {t('BU_Art_and_Culture', 'Art & Culture') || 'Art & Culture'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setTabSelected('sustainability')}
                className={clsx([
                  'border-b shrink-0 text-nowrap px-2',
                  tabSelected === 'sustainability'
                    ? 'border-jet-black-light'
                    : 'border-light-silver-light',
                ])}
                style={{minWidth: Dimensions.get('screen').width * 0.3}}>
                <Text
                  className={clsx([
                    'text-center py-2 break-keep',
                    tabSelected === 'sustainability'
                      ? 'font-obMedium'
                      : 'text-subtitle-muted-light',
                  ])}>
                  {t('BU_Sustain', 'Sustainability & Smart City') ||
                    'Sustainability & Smart City'}
                </Text>
              </Pressable>
              <View className="w-8" />
            </ScrollView>
          </View>

          <View className="pt-2 px-4 pb-16">
            <View className="py-4 w-full">
              {bookmarkContent.length > 0 ? (
                <>
                  {bookmarkContent.map((item, index) => {
                    if (
                      item.type === 'art_culture_category' &&
                      (tabSelected === '' || tabSelected === 'art-c')
                    ) {
                      if (
                        !item.content.id ||
                        !item.content.artCTranslation.title ||
                        !item.content.artCTranslation.thumbnail
                      ) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-${item.content.id}-${index}`}
                          artCType={
                            t('BU_Art_and_Culture', 'Art & Culture') || ''
                          }
                          item={{
                            id: item.content.id,
                            title: item.content.artCTranslation.title,
                            thumbnail: item.content.artCTranslation.thumbnail,
                            type: 'art_culture_category',
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }

                    if (
                      item.type === 'art_culture_program' &&
                      (tabSelected === '' || tabSelected === 'art-c')
                    ) {
                      let artCTitle = '';
                      const programArtCType = artCAllType.find(
                        (artCTypeItem: any) =>
                          artCTypeItem.id === item.content.artCTypeId,
                      );

                      if (programArtCType) {
                        artCTitle = programArtCType?.title;
                      }

                      if (
                        !artCTitle ||
                        !item.content.id ||
                        !item.content.programTranslations.title ||
                        !item.content.programTranslations.thumbnail
                      ) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-${item.content.id}-${index}`}
                          artCType={artCTitle}
                          item={{
                            type: 'art_culture_program',
                            id: item.content.id,
                            title: item.content.programTranslations.title,
                            thumbnail:
                              item.content.programTranslations.thumbnail,
                            locations:
                              item.content.programTranslations.locations,
                            periodAt: item.content.periodAt,
                            periodEnd: item.content.periodEnd,
                            publishedAt: item.content.publishedAt,
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }

                    if (
                      (item.type === 'sustainability_banner' ||
                        item.type === 'sustainability_content') &&
                      (tabSelected === '' || tabSelected === 'sustainability')
                    ) {
                      if (
                        !item.content.id ||
                        !item.content.title ||
                        !item.content.thumbnail
                      ) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-${item.content.id}-${index}`}
                          artCType={
                            t('BU_Sustain', 'Sustainability & Smart City') || ''
                          }
                          item={{
                            type: item.type,
                            id: item.content.id,
                            title: item.content.title,
                            thumbnail: item.content.thumbnail,
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }

                    if (
                      item.type === 'walking_meeting_map_route' &&
                      (tabSelected === '' || tabSelected === 'sustainability')
                    ) {
                      if (
                        !item.content.id ||
                        !item.content.title ||
                        !item.content.thumbnail
                      ) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-${item.content.id}-${index}`}
                          artCType={
                            t(
                              'Sustain_Walking_Page_Title',
                              'Walking Meeting Map',
                            ) || ''
                          }
                          item={{
                            type: 'walking_meeting_map_route',
                            id: item.content.id,
                            title: item.content.title,
                            thumbnail: item.content.thumbnail,
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }

                    if (
                      item.type === 'digital_library_item' &&
                      (tabSelected === '' || tabSelected === 'sustainability')
                    ) {
                      if (
                        !item.content.sID ||
                        !item.content.sFileName ||
                        !item.content.sPathCover
                      ) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-${item.content.sID}-${index}`}
                          artCType={
                            t('Sustain_Digital_Library', 'Digital Library') ||
                            ''
                          }
                          item={{
                            type: 'digital_library_item',
                            id: item.content.sID,
                            title: item.content.sFileName,
                            thumbnail: item.content.sPathCover,
                            link: item.content.sPathFile,
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }

                    if (
                      item.type === 'walking_meeting_map' &&
                      (tabSelected === '' || tabSelected === 'sustainability')
                    ) {
                      if (!item.content.id) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-walking_meeting_map-${index}`}
                          item={{
                            type: 'walking_meeting_map',
                            id: item.content.id,
                            title: t(
                              'Sustain_Walking_Page_Title',
                              'Walking Meeting Map',
                            ),
                            thumbnail: '',
                            thumbnailReq: require('../../../assets/images/sustain-head-bg.png'),
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }

                    if (
                      item.type === 'digital_library' &&
                      (tabSelected === '' || tabSelected === 'sustainability')
                    ) {
                      if (
                        !item.content.id ||
                        !item.content.title ||
                        !item.content.thumbnail
                      ) {
                        return;
                      }

                      return (
                        <ProgramRowItem
                          key={`bookmark-item-digital_library-${index}`}
                          item={{
                            type: 'digital_library',
                            id: item.content.id,
                            title: item.content.title,
                            thumbnail: item.content.thumbnail,
                          }}
                          isBookmark={true}
                          handleOnRemoveBookmark={(type, contentId) =>
                            handleBookmarkAction(type, contentId)
                          }
                        />
                      );
                    }
                  })}

                  {tabSelected === 'art-c' &&
                    bookmarkContent.filter(
                      item =>
                        item.type === 'art_culture_category' ||
                        item.type === 'art_culture_program',
                    ).length === 0 && (
                      <Text className="text-center">
                        {t('General__No_Bookmark', 'There is no bookmark.')}
                      </Text>
                    )}

                  {tabSelected === 'sustainability' &&
                    bookmarkContent.filter(
                      item =>
                        item.type === 'sustainability_banner' ||
                        item.type === 'sustainability_content' ||
                        item.type === 'walking_meeting_map' ||
                        item.type === 'digital_library' ||
                        item.type === 'walking_meeting_map_route' ||
                        item.type === 'digital_library_item',
                    ).length === 0 && (
                      <Text className="text-center">
                        {t('General__No_Bookmark', 'There is no bookmark.')}
                      </Text>
                    )}
                </>
              ) : (
                <Text className="text-center">
                  {t('General__No_Bookmark', 'There is no bookmark.')}
                </Text>
              )}
            </View>
          </View>
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

export default ArtCultureBookmarkScreen;
