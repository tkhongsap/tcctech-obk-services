import React from 'react';
import {TQuestionnaireQuestion} from '../screens/QuestionnaireDetailScreen';
import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';

interface Props {
  question: TQuestionnaireQuestion;
}
const QuestionnaireAnswerShortAnswer = ({question}: Props) => {
  return (
    <View className="px-4 pb-4">
      <Text weight="medium" color="default" size="B1" className="max-w-[310px]">
        {question.question}
      </Text>
      <View className="px-4 border flex flex-col border-line-light w-full">
        <View className="py-4 flex flex-row justify-between items-center">
          <Text className="text-dark-gray-light mt-2 m-0 min-h-[24px]">
            {question?.answers?.[0].answer || ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuestionnaireAnswerShortAnswer;
