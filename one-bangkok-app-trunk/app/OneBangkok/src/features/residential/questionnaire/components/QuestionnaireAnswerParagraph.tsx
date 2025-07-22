import React from 'react';
import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TQuestionnaireQuestion} from '../screens/QuestionnaireDetailScreen';

interface Props {
  question: TQuestionnaireQuestion;
}
const QuestionnaireAnswerParagraph = ({question}: Props) => {
  console.log('QuestionnaireAnswerParagraph ----->', question);
  return (
    <View className="px-4 pb-4">
      <Text weight="medium" color="default" size="B1" className="max-w-[310px]">
        {question.question}
      </Text>
      <View className="px-4 border flex flex-col border-line-light w-full">
        <View className="py-4 flex flex-row justify-between items-center">
          <View>
            <Text className="text-dark-gray-light mt-2 m-0 min-h-[24px]">
              {question?.answers?.[0].answer || ''}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default QuestionnaireAnswerParagraph;
