import {useHookstate} from '@hookstate/core';
import clsx from 'clsx';
import dayjs from 'dayjs';
import {map} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  StatusBar,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, TextInput} from '~/components/atoms';
import Loading from '~/components/organisms/Loading';
import {bookingSettingAction} from '~/features/booking/state/booking-setting';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import {
  IProgram,
  IProgramListPage,
  mappingArtCTypes,
  mappingProgramItems,
} from '~/models/ArtCulture';
import {artCultureServices} from '~/services/artCultureService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import t from '~/utils/text';
import ArtCBackHeader from '../components/ArtCBackHeader';
import ProgramRowItem from '../components/RowItem';
import {logScreenView} from '~/utils/logGA';

const ArtCultureSearchProgramScreen = () => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const [searchText, setSearchText] = useState<string>('');

  const loadedContent = useRef(false);

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [content, setContent] = useState<IProgramListPage | null>(null);
  const [onGoingPrograms, setOnGoingPrograms] = useState<IProgram[]>([]);
  const [upComingPrograms, setUpComingPrograms] = useState<IProgram[]>([]);
  const [availableBookingProgram, setAvailableBookingProgram] = useState<
    Record<number, boolean>
  >({});

  const fetchContent = () => {
    artCultureServices
      .fetchProgramsPage(languageSelected)
      .then(res => {
        const {data} = res.data;

        const artCTypes = mappingArtCTypes(languageSelected, data.artCTypes);
        const programs = mappingProgramItems(languageSelected, data.programs);

        const now = new Date();
        const programsOnGoing = programs.filter(
          program =>
            (!program.periodAt && !program.periodEnd) ||
            (dayjs(program.periodAt).toDate().getTime() < now.getTime() &&
              dayjs(program.periodEnd).toDate().getTime() > now.getTime()),
        );
        const programsUpcoming = programs.filter(
          program =>
            dayjs(program.periodAt).toDate().getTime() > now.getTime() &&
            dayjs(program.periodEnd).toDate().getTime() > now.getTime(),
        );

        setOnGoingPrograms(programsOnGoing);
        setUpComingPrograms(programsUpcoming);
        setContent({
          artCTypes: artCTypes.filter(artCType => artCType.programs.length > 0),
          programsOnGoing: programsOnGoing,
          programsUpcoming: programsUpcoming,
        });

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
        setContent({
          artCTypes: [],
          programsOnGoing: [],
          programsUpcoming: [],
        });
      });
  };

  useEffect(() => {
    if (!loadedContent.current && languageSelected) {
      loadedContent.current = true;
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSelected]);

  const handleTypeSelected = (type: string | null) => {
    setSelectedType(type);
  };

  const handleSearchProgram = () => {
    if (!content) {
      return;
    }

    let searchOnGoingPrograms = content.programsOnGoing;
    let searchUpComingPrograms = content.programsUpcoming;

    if (searchText !== '') {
      searchOnGoingPrograms = searchOnGoingPrograms.filter(item =>
        item.programTranslations.title
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );

      searchUpComingPrograms = searchUpComingPrograms.filter(item =>
        item.programTranslations.title
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );
    }

    if (
      selectedType === null ||
      selectedType === 'ongoing' ||
      selectedType === 'upcoming'
    ) {
      setOnGoingPrograms(searchOnGoingPrograms);
      setUpComingPrograms(searchUpComingPrograms);
      return;
    }

    searchOnGoingPrograms = searchOnGoingPrograms.filter(
      item => `${item.artCTypeId}` === selectedType,
    );

    searchUpComingPrograms = searchUpComingPrograms.filter(
      item => `${item.artCTypeId}` === selectedType,
    );

    setOnGoingPrograms(searchOnGoingPrograms);
    setUpComingPrograms(searchUpComingPrograms);
  };

  useEffect(() => {
    handleSearchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, content]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
  };

  useEffect(() => {
    logScreenView('ArtCultureSearchProgramScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      <ArtCBackHeader title={t('ArtCulture__Program', 'Programs')} />

      {content ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <View className="pt-4 px-4">
              <View className="flex flex-row items-center justify-between border border-inactive-light">
                <TextInput
                  onChangeText={text => setSearchText(text)}
                  value={searchText}
                  placeholder="Search"
                  className="flex border-0 shrink"
                  style={{
                    width: Dimensions.get('screen').width - 78,
                  }}
                />

                <Pressable
                  className="shrink-0"
                  onPress={() => handleSearchProgram()}>
                  <Image
                    source={require('../../../assets/artc/icons/icon-magnify.png')}
                    className="w-[20px] h-[20px] my-2 mx-3"
                  />
                </Pressable>
              </View>
            </View>

            <ScrollView
              className="pt-4 px-4"
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              bounces={false}>
              <Pressable
                className={clsx([
                  'px-3 py-[2px] border mr-3',
                  selectedType === null
                    ? 'bg-jet-black-light border-jet-black'
                    : 'bg-white border-inactive-light',
                ])}
                onPress={() => handleTypeSelected(null)}>
                <Text className={clsx([selectedType === null && 'text-white'])}>
                  {t('ArtCulture__All', 'All')}
                </Text>
              </Pressable>

              <Pressable
                className={clsx([
                  'px-3 py-[2px] border mr-3',
                  selectedType === 'ongoing'
                    ? 'bg-jet-black-light border-jet-black'
                    : 'bg-white border-inactive-light',
                ])}
                onPress={() => handleTypeSelected('ongoing')}>
                <Text
                  className={clsx([
                    selectedType === 'ongoing' && 'text-white',
                  ])}>
                  {t('ArtCulture__Ongoing', 'Ongoing')}
                </Text>
              </Pressable>

              <Pressable
                className={clsx([
                  'px-3 py-[2px] border mr-3',
                  selectedType === 'upcoming'
                    ? 'bg-jet-black-light border-jet-black'
                    : 'bg-white border-inactive-light',
                ])}
                onPress={() => handleTypeSelected('upcoming')}>
                <Text
                  className={clsx([
                    selectedType === 'upcoming' && 'text-white',
                  ])}>
                  {t('ArtCulture__Upcoming', 'Upcoming')}
                </Text>
              </Pressable>

              {content.artCTypes.map(item => (
                <Pressable
                  key={`program-page-art-c-type-filter-${item.id}`}
                  className={clsx([
                    'px-3 py-[2px] border mr-3',
                    selectedType === `${item.id}`
                      ? 'bg-jet-black-light border-jet-black'
                      : 'bg-white border-inactive-light',
                  ])}
                  onPress={() => handleTypeSelected(`${item.id}`)}>
                  <Text
                    className={clsx([
                      selectedType === `${item.id}` && 'text-white',
                    ])}>
                    {item.artCTranslation.title}
                  </Text>
                </Pressable>
              ))}

              <View className="w-5" />
            </ScrollView>

            <View className="pt-6 px-4 pb-16">
              {selectedType !== 'upcoming' && (
                <View>
                  <Text className="font-obMedium text-2xl">
                    {t('ArtCulture__Ongoing', 'Ongoing')}
                  </Text>

                  <View className="pt-2">
                    {onGoingPrograms.length > 0 ? (
                      <>
                        {onGoingPrograms.map(item => (
                          <ProgramRowItem
                            key={`program-ongoing-item-${item.id}`}
                            artCType={
                              content.artCTypes.find(
                                aItem => aItem.id === item.artCTypeId,
                              )?.artCTranslation.title
                            }
                            item={{
                              type: 'program',
                              id: item.id,
                              thumbnail: item.programTranslations.banner,
                              title: item.programTranslations.title,
                              locations: item.programTranslations.locations,
                              periodAt: item.periodAt,
                              periodEnd: item.periodEnd,
                              publishedAt: item.publishedAt,
                              isGetTicketAvailable:
                                availableBookingProgram[item.id],
                            }}
                          />
                        ))}
                      </>
                    ) : (
                      <Text className="w-full pt-4 text-center">
                        {t(
                          'ArtCulture__No_Ongoing_Program',
                          'No ongoing program',
                        )}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {selectedType !== 'ongoing' && (
                <View className="pt-6">
                  <Text className="font-obMedium text-2xl">
                    {t('ArtCulture__Upcoming', 'Upcoming')}
                  </Text>

                  <View className="pt-2">
                    {upComingPrograms.length > 0 ? (
                      <>
                        {upComingPrograms.map(item => (
                          <ProgramRowItem
                            key={`program-upcoming-item-${item.id}`}
                            artCType={
                              content.artCTypes.find(
                                aItem => aItem.id === item.artCTypeId,
                              )?.artCTranslation.title
                            }
                            item={{
                              type: 'program',
                              id: item.id,
                              thumbnail: item.programTranslations.banner,
                              title: item.programTranslations.title,
                              locations: item.programTranslations.locations,
                              periodAt: item.periodAt,
                              periodEnd: item.periodEnd,
                              publishedAt: item.publishedAt,
                              isGetTicketAvailable:
                                availableBookingProgram[item.id],
                            }}
                          />
                        ))}
                      </>
                    ) : (
                      <Text className="w-full pt-4 text-center">
                        {t(
                          'ArtCulture__No_Upcoming_Program',
                          'No upcoming program',
                        )}
                      </Text>
                    )}
                  </View>
                </View>
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

export default ArtCultureSearchProgramScreen;
