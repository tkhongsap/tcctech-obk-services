import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import t from '~/utils/text';

const language =
  appLanguageState.currentLanguage.get() ||
  appLanguageState.defaultLanguage.get();

export interface ListSelect {
  code: number;
  detail: {en: string; th: string};
}
export interface SelectListProps {
  data: ListSelect[];
  onPress?: Function;
  selected?: number;
  disabled?: boolean;
  hasError?: boolean;
}
const SelectList = ({
  data,
  selected,
  onPress,
  disabled,
  hasError,
}: SelectListProps) => {
  const [selectValue, setSelectValue] = useState<number>();

  useEffect(() => {
    selected && setSelectValue(selected);
  }, []);

  const handleOnPress = (radioValue: number) => {
    setSelectValue(radioValue);
    onPress && onPress(radioValue);
  };

  return (
    <View className={getTheme('flex flex-col')}>
      {data.map(({code, detail}, index) => (
        <TouchableOpacity
          disabled={disabled}
          key={index + '-checkList-' + code}
          activeOpacity={activeOpacity}
          onPress={() => {
            handleOnPress(code);
          }}>
          <View
            className={`min-h-[48px] px-5 py-3 flex flex-row justify-between items-center ${getTheme(
              `border-[1px] ${
                selectValue === code
                  ? 'bg-light-gray border-[#014541]'
                  : 'border-line'
              } ${
                disabled
                  ? 'bg-light-gray'
                  : hasError && 'bg-error border-fire-engine-red'
              }`,
            )} `}>
            <View className="w-full max-w-[90%]">
              <Text
                weight={selectValue === code ? 'medium' : 'regular'}
                size="B1"
                className={`${disabled && getTheme('text-muted-400')}`}>
                {language === 'th' ? detail.th : detail.en}
              </Text>
            </View>
            {selectValue === code && (
              <View className="flex flex-col items-end">
                <Icon
                  type="checkedIcon"
                  width={20}
                  height={20}
                  color="#014541"
                />
              </View>
            )}
          </View>
          <Spacing height={12} />
        </TouchableOpacity>
      ))}
      {hasError && (
        <Text size="B2" color="error">
          {t(
            'General__Please_select_rate',
            'Please selected at least one rate',
          )}
        </Text>
      )}
    </View>
  );
};

export default SelectList;
