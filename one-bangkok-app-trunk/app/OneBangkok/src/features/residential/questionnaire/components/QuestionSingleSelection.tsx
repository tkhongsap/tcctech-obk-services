import React, {useEffect, useState} from 'react';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {
  TQuestionnaireOption,
  TQuestionnaireQuestion,
} from '../screens/QuestionnaireDetailScreen';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants';
import t from '~/utils/text';

export type TCustomQuestionnaireOption = TQuestionnaireOption & {
  selected: boolean;
  otherOptionValue: string;
};

interface Props {
  question: TQuestionnaireQuestion;
  onFocus:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onBlur:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  options: TCustomQuestionnaireOption[];
  onOptionsChange?: (value: TCustomQuestionnaireOption[]) => void;
  // Add required prop if needed
  required?: boolean;
  validationError?: Record<number, {type: number; message?: string}> | null;
}
const QuestionSingleSelection = ({
  question,
  onFocus,
  onBlur,
  onOptionsChange = () => {},
  required = false,
  validationError,
  ...props
}: Props) => {
  const validator = validationError?.[question.id];
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (required && validator && validator.type === 3) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [validator]);
  const maxLengthTextInput = 100;
  const [options, setOptions] = useState<TCustomQuestionnaireOption[]>(
    props.options,
  );
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const onPress = (id: number) => {
    onOptionsChange(
      options.map(e => ({
        ...e,
        selected: e.id === id,
        otherOptionValue: e.id === id ? e.otherOptionValue : '',
      })),
    );
    setOptions(prev =>
      prev.map(e => ({
        ...e,
        selected: e.id === id,
        otherOptionValue: e.id === id ? e.otherOptionValue : '',
      })),
    );
  };

  const onOtherValueChange = (id: number, value: string) => {
    onFocus;
    setShortAnswer(value);
    onOptionsChange(
      options.map(e => ({...e, otherOptionValue: e.id === id ? value : ''})),
    );
    setOptions(prev =>
      prev.map(e => ({...e, otherOptionValue: e.id === id ? value : ''})),
    );
  };

  return (
    <>
      {question.question && (
        <Text
          weight="regular"
          color="default"
          size="B1"
          numberOfLines={2}
          className="max-w-[310px]">
          {question.question || ''}
        </Text>
      )}
      {options.length > 0 && <Spacing height={12} />}
      {options.map(option => (
        <TouchableOpacity
          key={option.id}
          className={`min-h-[48px] w-full flex flex-col px-4 py-3 mb-3 border border-line-light ${
            valid ? 'border-red-500 bg-red-50' : ''
          }`}
          onPress={() => onPress(option.id)}>
          <View
            className="flex flex-row justify-between items-center"
            style={{gap: 8}}>
            <View className="flex-row items-center" style={{gap: 8}}>
              <Icon
                type={option.selected ? 'scRadioCheckedIcon' : 'scRadioIcon'}
                width={24}
                height={24}
                color="#FFFFFF"
              />
              <Text weight="regular" size="B1">
                {option.text}
              </Text>
            </View>
          </View>
          {option.selected && option.otherOption && (
            <View className="mt-3">
              <TextInput
                name="otherValue"
                // onPressIn={() => onPress(option.id)}
                autoCorrect={false}
                value={option.otherOptionValue}
                defaultValue={option.otherOptionValue}
                autoCapitalize="none"
                placeholderTextColor={Colors.black40}
                placeholder={t(
                  'Residential_Questionnaire_Input_placeholder',
                  'Type here',
                )}
                labelText=""
                maxLength={maxLengthTextInput}
                onBlur={onBlur}
                onFocus={onFocus}
                rules={{
                  onChange: e => onOtherValueChange(option.id, e.target.value),
                  ...(required && {
                    required: t(
                      'Residential_Questionnaire_Answer_Required',
                      'Please answer the question',
                    ),
                  }),
                }}
              />
              <Text
                color={
                  option.otherOptionValue.length > maxLengthTextInput
                    ? 'error'
                    : 'subtitle-muted'
                }
                size="B2">
                {option.otherOptionValue.length}/{maxLengthTextInput}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
      {valid && required && (
        <Text className="text-red-500 mt-[-10px]" style={{fontSize: 14}}>
          {validator?.message || ''}
        </Text>
      )}
      <Spacing height={24} />
    </>
  );
};

export default QuestionSingleSelection;
