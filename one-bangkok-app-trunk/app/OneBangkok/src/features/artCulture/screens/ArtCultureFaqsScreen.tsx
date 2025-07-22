import React, {useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import t from '~/utils/text';
import {Text} from '~/components/atoms';
import FaqAccordionItem, {
  FaqDisplayItem,
  FaqItem,
} from '../components/FaqAccordianItem';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {artCultureServices} from '~/services/artCultureService';
import FloatingStickyMenu from '~/features/home/components/FloatingMenu';
import ArtCBackHeader from '../components/ArtCBackHeader';
import Loading from '~/components/organisms/Loading';
import {logScreenView} from '~/utils/logGA';

const ArtCultureFaqsScreen = () => {
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const [content, setContent] = useState<FaqDisplayItem[] | undefined>();

  const fetchContent = async () => {
    artCultureServices
      .fetchFaqs(languageSelected)
      .then(res => {
        const {data} = res.data;

        const filterData = data.filter(
          (item: FaqItem) => item.isPublished === true,
        );
        let formattedData: FaqDisplayItem[] = filterData.map(
          (item: FaqItem) => {
            const translation = item.faqTranslation.find(
              t => t.locale === languageSelected,
            );

            if (translation) {
              return {
                id: item.id,
                order: item.orderNo,
                faqTranslation: translation,
              };
            }
          },
        );

        formattedData = formattedData.filter(item => item !== undefined);

        const sortData = formattedData.sort((a, b) => a.order - b.order);
        setContent(sortData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSelected]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchContent();
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    logScreenView('ArtCultureFaqsScreen');
  }, []);

  return (
    <View className="bg-white h-screen">
      <StatusBar barStyle={'dark-content'} />
      <ArtCBackHeader title={t('General__FAQs', 'FAQs')} />

      {content ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Pressable>
            <View className="w-full px-4 pt-4">
              <Text className="text-2xl font-obMedium">
                {t('ArtCulture__Landing_Faq_Title', 'Frequent Asked Questions')}
              </Text>
              <Text className="text-vp-pass-desc-light">
                {t(
                  'ArtCulture__Landing_Faq_Sub_Title',
                  'Quick answers to questions you might have',
                )}
              </Text>
            </View>

            <View className="py-8 px-4">
              {content?.length === 0 ? (
                <Text className="text-center font-obMedium">
                  {t('ArtCulture__Empty_Faq', 'There is no FAQs')}
                </Text>
              ) : (
                <>
                  {content?.map(item => (
                    <FaqAccordionItem
                      key={`faq-page-faq-item-${item.id}-${item.order}`}
                      item={item}
                    />
                  ))}
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

export default ArtCultureFaqsScreen;
