import React, {useMemo} from 'react';
import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TQuestionnaireQuestion} from '../screens/QuestionnaireDetailScreen';

interface Props {
  question: TQuestionnaireQuestion;
}
const QuestionnaireAnswerSingleSelection = ({question}: Props) => {
  const getOtherAnswer = (id: number | undefined) => {
    const answer = question.answers.find(a => a.selectedOptionId === id);
    if (answer) {
      return answer?.answer;
    }
    return null;
  };

  const selected = useMemo(() => {
    try {
      const option = question.options.find(
        e => e.id === question?.answers[0].selectedOptionId,
      );
      let res = null;
      if (option) {
        if (option.otherOption) {
          const answer = getOtherAnswer(option?.id);
          if (answer) {
            res = answer;
          }
        } else {
          res = option.text;
        }
      }
      return res;
    } catch (error) {
      return null;
    }
  }, [question]);

  return (
    <View className="px-4 pb-4">
      {question.question != '' && question.question && (
        <Text
          weight="medium"
          color="default"
          size="B1"
          numberOfLines={2}
          className="max-w-[310px]">
          {question.question}
        </Text>
      )}
      <Spacing height={12} />
      <View className="px-4 border flex flex-col border-line-light w-full">
        <View className="py-4 flex flex-row justify-between items-center">
          <Text className="text-dark-gray-light mt-2 m-0 min-h-[24px]">
            {selected ?? ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuestionnaireAnswerSingleSelection;
