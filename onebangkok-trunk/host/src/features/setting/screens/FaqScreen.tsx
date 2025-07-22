import React, {useEffect, useState} from 'react';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';

import faqAction from '~/states/setting/faq/faqAction';
import {Header} from '~/components/molecules/Header';
import {ListSection} from '~/components/molecules/ListSection';
import {ItemList} from '~/components/molecules/ItemList';
import {ListItemProps} from '~/components/molecules/ListItem';
import {ScrollView} from 'react-native';
import {useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';

const FaqScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<ListItemProps[]>();
  const language = appLanguageState.currentLanguage.get();
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    appLanguageState.currentLanguage.get(),
  );
  useEffect(() => {
    async function fetchCategories() {
      if (!categories || currentLanguage !== language) {
        setCurrentLanguage(language);
        const faqCategories = await faqAction.getFaqCategories(language);
        if (faqCategories) {
          const data: ListItemProps[] = faqCategories.map(category => {
            return {
              title: category.title, // language will handle on separate ticket in the future
              onPress: () => {
                navigation.navigate('FaqQuestionScreen', {
                  id: category.id,
                  title: category.title,
                });
              },
              key: 'faq-' + category.id,
              rightElement: 'right',
            };
          });
          setCategories(data);
        }
        setLoading(false);
      }
    }
    fetchCategories();
  }, [categories, currentLanguage, language, navigation]);

  return (
    <Screen isLoading={loading}>
      <Header
        leftAction="goBack"
        title={t('General__FAQs', 'FAQs')}
        rightAction={'switchLanguage'}
      />
      <ScrollView className="px-6 w-full">
        {categories && (
          <ListSection
            title={t(
              'Settings__Faqs_categories__Body',
              'Frequently ask questions',
            )}>
            <ItemList items={categories} />
          </ListSection>
        )}
      </ScrollView>
    </Screen>
  );
};

export default FaqScreen;
