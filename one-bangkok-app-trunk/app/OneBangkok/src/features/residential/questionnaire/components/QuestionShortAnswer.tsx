import React, {useEffect, useRef, useState} from 'react';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants';
import t from '~/utils/text';
import {
  TQuestionnaireInlineImage,
  TQuestionnaireQuestion,
} from '../screens/QuestionnaireDetailScreen';

interface Props {
  inlineImage: TQuestionnaireInlineImage;
  question: TQuestionnaireQuestion;
  onFocus:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onBlur:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  shortAnswer?: string;
  onShortAnswerChange?: (value: string) => void;
  required: boolean;
  validationError?: Record<number, {type: number; message?: string}> | null;
}
const QuestionShortAnswer = ({
  question,
  onFocus,
  onBlur,
  onShortAnswerChange = () => {},
  required = false,
  validationError,
  ...props
}: Props) => {
  const validator = validationError?.[question.id];
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (required && validator && validator.type === 1) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [validator]);
  const maxLengthTextInput = 100;
  const [shortAnswer, setShortAnswer] = useState<string>(
    props.shortAnswer ?? '',
  );

  // const inputRefs: {
  //   [key: string]: React.MutableRefObject<any>;
  // } = {
  //   subject: useRef(),
  // };

  const onChange = (value: string) => {
    setShortAnswer(value);
    onShortAnswerChange(value);
  };

  return (
    <>
      <TextInput
        className={`${valid ? 'border-red-500 bg-red-50' : ''}`}
        name="subject"
        autoCorrect={false}
        value={shortAnswer != null ? shortAnswer : ''}
        defaultValue={shortAnswer}
        autoCapitalize="none"
        placeholderTextColor={Colors.black40}
        placeholder={t(
          'Residential_Questionnaire_Input_placeholder',
          'Type here',
        )}
        labelText={question?.question ?? ''}
        maxLength={maxLengthTextInput}
        rules={{
          onChange: e => onChange(e.target.value),
        }}
        // onFocus={onFocus}
        // onSubmitEditing={() => inputRefs.subject?.current?.focus()}
        style={[
          // @ts-ignore
          {borderColor: valid ? Colors.error : Colors.inputBorder},
        ]}
      />
      {/* Hide maxLength counter if error */}
      <Text
        color={
          (shortAnswer != null ? shortAnswer.length : 0) > maxLengthTextInput
            ? 'error'
            : 'subtitle-muted'
        }
        size="B2">
        {shortAnswer != null ? shortAnswer.length : 0}/{maxLengthTextInput}
      </Text>
      {valid && required && (
        <Text className="text-red-500 mt-[-10px]" style={{fontSize: 14}}>
          {validator?.message || ''}
        </Text>
      )}
      <Spacing height={24} />
    </>
  );
};

export default QuestionShortAnswer;
