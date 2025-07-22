import React, {Fragment, useMemo} from 'react';
import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TQuestionnaireQuestion} from '../screens/QuestionnaireDetailScreen';

interface Props {
  question: TQuestionnaireQuestion;
}
const QuestionnaireAnswerMultiSelection = ({question}: Props) => {
  const getOtherAnswer = (id: number | undefined) => {
    const answer = question.answers.find(a => a.selectedOptionId === id);
    if (answer) {
      return answer.answer;
    }
  };

  const getAnswer = (id: number | null) => {
    try {
      const option = question.options.find(o => o.id === id);
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
  };

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
      {question?.answers !== null &&
        question?.answers.map(answer => (
          <Fragment key={answer.selectedOptionId}>
            <Spacing height={12} />
            <View className="px-4 border flex flex-col border-line-light w-full">
              <View className="py-4 flex flex-row justify-between items-center">
                <View>
                  <Text className="text-dark-gray-light mt-2 m-0 min-h-[24px]">
                    {getAnswer(answer.selectedOptionId) || ''}
                  </Text>
                </View>
              </View>
            </View>
          </Fragment>
        ))}
    </View>
  );
};

export default QuestionnaireAnswerMultiSelection;
