import React, {useState} from 'react';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from '~/components/molecules/TextInput';
import {Icon, Spacing, Text} from '~/components/atoms';
import {
  QuestionnaireQuestionType,
  TQuestionnaireOption,
  TQuestionnaireQuestion,
} from '../screens/QuestionnaireDetailScreen';
import {Colors} from '~/constants';
import t from '~/utils/text';
import {useEffect} from 'react';
export type TCustomQuestionnaireMultipleOption = TQuestionnaireOption & {
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
  options?: TCustomQuestionnaireMultipleOption[];
  onOptionsChange?: (options: TCustomQuestionnaireMultipleOption[]) => void;
  required: boolean;
  validationError?: Record<number, {type: number; message?: string}> | null;
}
const QuestionMultipleSelection = ({
  question,
  onFocus,
  onBlur,
  onOptionsChange = () => {},
  required,
  validationError,
  ...props
}: Props) => {
  const maxLengthTextInput = 100;
  const validator = validationError?.[question.id];
  const [valid, setValid] = useState<boolean>(false);
  useEffect(() => {
    if (required && validator && validator.type === 4) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [validator]);
  const [options, setOptions] = useState<TCustomQuestionnaireMultipleOption[]>(
    props.options ?? [],
  );
  const onPress = (id: number) => {
    onOptionsChange(
      options.map(e => ({
        ...e,
        selected: e.id === id ? !e.selected : e.selected,
        otherOptionValue: e.otherOption === true ? e.otherOptionValue : '',
      })),
    );
    setOptions(prev =>
      prev.map(e => ({
        ...e,
        selected: e.id === id ? !e.selected : e.selected,
        otherOptionValue: e.otherOption === true ? e.otherOptionValue : '',
      })),
    );
  };

  const onOtherValueChange = (id: number, value: string, a: any) => {
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
      {options.map(e => (
        <TouchableOpacity
          key={e.id}
          className={`px-4 border flex flex-col w-full mb-3 ${
            e.selected
              ? 'bg-light-gray-light border-dark-teal-light'
              : 'border-line-light '
          } ${valid ? 'border-red-500 bg-red-50' : ''}`}
          onPress={() => onPress(e.id)}>
          <View className="py-4 flex flex-row justify-between items-center">
            <View className="flex-row items-center gap-2 justify-center">
              <Text
                className={`${
                  e.selected ? 'text-dark-teal-light ' : 'text-dark-gray-light'
                } mt-2  m-0`}
                weight={e.selected ? 'medium' : 'regular'}>
                {e.text}
              </Text>
            </View>
            {e.selected && (
              <View>
                <Icon
                  type="checkedIcon"
                  width={16}
                  height={16}
                  color="#014541"
                />
              </View>
            )}
          </View>
          {/* Show TextInput only if "Other" is selected */}
          {e.selected && e.otherOption && (
            <View>
              <TextInput
                autoCorrect={false}
                name="otherValue"
                value={e.otherOptionValue}
                defaultValue={e.otherOptionValue}
                autoCapitalize="none"
                placeholderTextColor={Colors.black40}
                placeholder={
                  t(
                    'Residential_Questionnaire_Input_placeholder',
                    'Type here',
                  ) ?? 'Type here'
                }
                maxLength={maxLengthTextInput}
                labelText=""
                onFocus={onFocus}
                onBlur={onBlur}
                rules={{
                  onChange: a => onOtherValueChange(e.id, a.target.value, a),
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
                  e.otherOptionValue.length > maxLengthTextInput
                    ? 'error'
                    : 'subtitle-muted'
                }
                size="B2">
                {e.otherOptionValue.length}/{maxLengthTextInput}
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

export default QuestionMultipleSelection;
