import React, {useEffect, useState} from 'react';

import faqAction from '~/states/setting/faq/faqAction';
import {Header} from '~/components/molecules/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {FeedbackData} from '~/utils/ob_sdk/services/ob_document/index.interface';
import {Pressable, ScrollView, View} from 'react-native';
import Markdown from 'react-native-marked';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import {Screen} from '~/components/templates/Screen';
import Feedback from '../components/Feedback';
import {WrappedResponseDocumentResultData} from 'ob-document-sdk/dist/api';

type Props = NativeStackScreenProps<RootStackParamList, 'FaqAnswerScreen'>;

const FaqAnswerScreen = ({
  route: {
    params: {categoryId, id, question},
  },
}: Props) => {
  let currentLanguage = appLanguageState.currentLanguage.get();
  const [answer, setAnswer] = useState<WrappedResponseDocumentResultData>();
  const [feedback, setFeedback] = useState<FeedbackData>();
  const [loading, setLoading] = useState(true);

  const [_question, setQuestion] = useState(question);
  useEffect(() => {
    const getAnswer = async () => {
      if (id) {
        if (!currentLanguage) {
          currentLanguage = appLanguageState.defaultLanguage.get();
        }
        const translatedQuestion = await faqAction.getFaqCategory(categoryId);
        translatedQuestion?.title && setQuestion(translatedQuestion.title);
        const document = await faqAction.getFaqDetail(id, currentLanguage);
        if (document) {
          setAnswer(document);
        }
        const feedbackData = await faqAction.getFeedback(id, currentLanguage);
        if (feedbackData) {
          setFeedback(feedbackData);
        }
      }
      setLoading(false);
    };
    getAnswer();
  }, [categoryId, currentLanguage, id]);

  const onPressFeedback = async (value: boolean) => {
    if (!answer || feedback?.like === value) {
      return;
    }
    let response;
    if (feedback === undefined) {
      response = await faqAction.createFeedback(answer?.id, value);
    } else {
      response = await faqAction.updateFeedback(feedback.id, value);
    }
    setFeedback(response);
  };

  return (
    <Screen isLoading={loading}>
      <Header
        leftAction="goBack"
        title={t('General__FAQs', 'FAQs')}
        rightAction={'switchLanguage'}
      />
      <ScrollView className="w-full px-6">
        {answer && (
          <Pressable className={getTheme('bg-default')}>
            <View>
              <Text size="B2">{_question}</Text>
              <Spacing height={12} />
              <Text size="H2" weight="medium" className="leading-[30.8px]">
                {answer?.title}
              </Text>
              <Spacing height={24} />
              <Markdown
                flatListProps={{scrollEnabled: false}}
                value={answer?.body}
              />
            </View>
            <Spacing height={24} />
            <Feedback like={feedback?.like} onPress={onPressFeedback} />
            <Spacing height={24} />
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
};

export default FaqAnswerScreen;
