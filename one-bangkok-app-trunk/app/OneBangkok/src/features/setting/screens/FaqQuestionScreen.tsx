import React, {useEffect, useState} from 'react';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';

import faqAction from '~/states/setting/faq/faqAction';
import {Header} from '~/components/molecules/Header';
import {ListSection} from '~/components/molecules/ListSection';
import {ItemList} from '~/components/molecules/ItemList';
import {ListItemProps} from '~/components/molecules/ListItem';
import {ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';

type Props = NativeStackScreenProps<RootStackParamList, 'FaqQuestionScreen'>;

const FaqQuestionScreen = ({
  route: {
    params: {id, title},
  },
}: Props) => {
  const navigation = useNavigation();
  const currentLanguage = appLanguageState.currentLanguage.get();
  const [_title, setTitle] = useState(title);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ListItemProps[]>([
    {
      title: '',
      key: 'faq',
      rightElement: 'right',
    },
  ]);
  useEffect(() => {
    const getDocuments = async () => {
      if (id) {
        const translatedTitle = await faqAction.getFaqCategory(id);
        translatedTitle?.title && setTitle(translatedTitle.title);
        const documents = await faqAction.getFaqDocuments(id, currentLanguage);
        if (documents) {
          setQuestions(
            documents.map(doc => {
              return {
                title: doc.title, // language will handle on separate ticket in the future
                onPress: () => {
                  navigation.navigate('FaqAnswerScreen', {
                    categoryId: id,
                    question: _title,
                    id: doc.id,
                  });
                },
                key: 'faq-question-' + doc.id,
                rightElement: 'right',
              };
            }),
          );
        }
        setLoading(false);
      }
    };
    getDocuments();
  }, [_title, currentLanguage, id, navigation, title]);

  return (
    <Screen isLoading={loading}>
      <Header
        leftAction="goBack"
        title={_title}
        rightAction={'switchLanguage'}
      />
      <ScrollView className="px-6 w-full">
        <ListSection
          title={t(
            'Settings__Faqs_categories__Body',
            'Frequently ask questions',
          )}>
          {questions && <ItemList items={questions} />}
        </ListSection>
      </ScrollView>
    </Screen>
  );
};

export default FaqQuestionScreen;
