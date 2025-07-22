import React, {useEffect, useRef, useState} from 'react';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants';
import t from '~/utils/text';
import {TQuestionnaireQuestion} from '../screens/QuestionnaireDetailScreen';

interface Props {
  question: TQuestionnaireQuestion;
  onFocus:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onBlur:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  paragraph?: string;
  onParagraphChange?: (value: string) => void;
  required: boolean;
  validationError?: Record<number, {type: number; message?: string}> | null;
}
const QuestionParagraph = ({
  question,
  onFocus,
  onBlur,
  onParagraphChange = () => {},
  required = false,
  validationError,
  ...props
}: Props) => {
  const validator = validationError?.[question.id];
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (required && validator && validator.type === 2) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [validator]);
  const maxLengthTextInput = 2000;
  const [paragraph, setParagraph] = useState<string>(props.paragraph ?? '');
  const inputRefs: {
    [key: string]: React.MutableRefObject<any>;
  } = {
    comment: useRef(),
  };

  const onChange = (value: string) => {
    setParagraph(value);
    onParagraphChange(value);
  };

  return (
    <>
      <TextInput
        className={`${valid ? 'border-red-500 bg-red-50' : ''}`}
        name="comment"
        autoCorrect={false}
        defaultValue={paragraph}
        autoCapitalize="none"
        placeholderTextColor={Colors.black40}
        placeholder={t(
          'Residential_Questionnaire_Input_placeholder',
          'Type here',
        )}
        labelText={question.question || ''}
        maxLength={maxLengthTextInput}
        style={{height: 128, textAlignVertical: 'top'}}
        multiline
        rules={{
          onChange: e => onChange(e.target.value),
          // ...(required && {
          //   required: t(
          //     'Residential_Questionnaire_Answer_Required',
          //     'Please answer the question',
          //   ),
          // }),
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        onSubmitEditing={() => inputRefs.comment?.current?.focus()}
      />
      <Text
        color={
          paragraph.length > maxLengthTextInput ? 'error' : 'subtitle-muted'
        }
        size="B2">
        {paragraph.length}/{maxLengthTextInput}
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

export default QuestionParagraph;
