import React, {useEffect, useRef, useState} from 'react';
import {RefreshControl, StatusBar, View} from 'react-native';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import {Text} from '~/components/atoms';
import {RootStackParamList} from '~/navigations/AppNavigation';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {
  IAddOnProgramItem,
  ITagPage,
  mappingAddOns,
  mappingArtCTypes,
  mappingProgramItems,
} from '~/models/ArtCulture';
import ProgramRowItem from '../components/RowItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {artCultureServices} from '~/services/artCultureService';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import ArtCBackHeader from '../components/ArtCBackHeader';
import Loading from '~/components/organisms/Loading';
import t from '~/utils/text';
import {logScreenView} from '~/utils/logGA';

type Props = NativeStackScreenProps<RootStackParamList, 'ArtCultureTagScreen'>;

const ArtCultureTagScreen = ({
  route: {
    params: {tag},
  },
}: Props) => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const loadedContent = useRef(false);

  const [content, setContent] = useState<ITagPage | null>(null);

  const [contentItems, setContentItems] = useState<IAddOnProgramItem[]>([]);

  const fetchContent = () => {
    artCultureServices
      .fetchTagPage(tag, languageSelected)
      .then(res => {
        const {data} = res.data;

        const artCTypes = mappingArtCTypes(languageSelected, data.artCTypes);
        const programs = mappingProgramItems(languageSelected, data.programs);
        const addOns = mappingAddOns(languageSelected, data.addOns);

        setContent({
          artCTypes,
          programs,
          addOns,
        });

        const cItems: IAddOnProgramItem[] = [];
        programs.forEach(item => {
          cItems.push({
            type: 'program',
            id: item.id,
            artCTypeId: item.artCTypeId,
            thumbnail: item.programTranslations.banner,
            title: item.programTranslations.title,
            locations: item.programTranslations.locations,
            periodAt: item.periodAt,
            periodEnd: item.periodEnd,
            publishedAt: item.publishedAt,
          });
        });

        addOns.forEach(item => {
          cItems.push({
            type: 'addOn',
            id: item.id,
            addOnType: item.type,
            thumbnail: item.addOnTranslations.thumbnail,
            title: item.addOnTranslations.title,
            publishedAt: item.publishedAt,
          });
        });

        setContentItems(
          cItems.sort(
            (a, b) =>
              dayjs(b.publishedAt).toDate().getTime() -
              dayjs(a.publishedAt).toDate().getTime(),
          ),
        );
      })
      .catch(err => {
        console.error(err);
        setContent({
          artCTypes: [],
          programs: [],
          addOns: [],
        });
      });
  };

  useEffect(() => {
    if (!loadedContent.current && languageSelected && tag) {
      loadedContent.current = true;
      fetchContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSelected, tag]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    logScreenView('ArtCultureTagScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      <ArtCBackHeader title={t('Geneal__Tags', 'Tag')} />

      {content ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <View>
              <Text className="text-lg font-obMedium px-4 pt-4">"{tag}"</Text>
            </View>

            <View className="pt-6 px-4 pb-16">
              {contentItems.map(item => (
                <ProgramRowItem
                  key={`addon-program-tag-item-${item.type}-${item.id}`}
                  artCType={
                    content.artCTypes.find(
                      aItem => aItem.id === item.artCTypeId,
                    )?.artCTranslation.title
                  }
                  item={item}
                  handleOnPress={() => {
                    loadedContent.current = false;
                  }}
                />
              ))}
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

export default ArtCultureTagScreen;
