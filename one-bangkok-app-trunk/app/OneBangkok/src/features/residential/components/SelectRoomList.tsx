import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, TextStyle} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import ToggleSwitch from './ToggleSwitch';
import {modalActions} from './ResidentialModal';
import SceneSettingDelayModal from './SceneSettingDelayModal';

export interface ListSceneSelect {
  name: string;
  value: string;
  icon: string;
}
export interface SelectListProps {
  data: ListSceneSelect[];
  onPress?: Function;
  selected: string;
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
  const [selectValue, setSelectValue] = useState('');
  const handleOnPress = (radioValue: string) => {
    setSelectValue(radioValue);
    onPress && onPress(radioValue);
  };

  useEffect(() => {
    if (disabled) {
      setSelectValue('');
    } else {
      selected && setSelectValue(selected);
    }
  }, [selected, disabled]);

  const onPressSceneSettingDelayModal = () => {
    modalActions.setContent(<SceneSettingDelayModal />);
    modalActions.show();
  };

  return (
    <View className={getTheme('flex flex-col')} style={{gap: 12}}>
      {data.map(({name, value, icon}, index) => (
        <TouchableOpacity
          disabled={disabled}
          key={index + '-checkList-' + value}
          activeOpacity={activeOpacity}
          onPress={() => {
            handleOnPress(value);
          }}>
          <View
            className={
              'min-h-[48px] flex flex-col px-4 py-3  border border-line-light'
            }
            style={{gap: 8}}>
            <View
              className="flex flex-row justify-between items-center"
              style={{gap: 8}}>
              <View className="flex-row items-center" style={{gap: 8}}>
                {selectValue === value ? (
                  <Icon
                    type={'scRadioCheckedIcon'}
                    width={24}
                    height={24}
                    color={'#FFFFFF'}
                  />
                ) : (
                  <Icon
                    type={'scRadioIcon'}
                    width={24}
                    height={24}
                    color={'#FFFFFF'}
                  />
                )}
                <Text
                  weight="regular"
                  size="B1"
                  className={`${disabled && getTheme('text-muted-400')} `}>
                  {name}
                </Text>
              </View>
              {selectValue === value ? (
                <View className="flex-row items-center" style={{gap: 12}}>
                  <TouchableOpacity
                    className="w-6 aspect-square rounded-full flex flex-row items-center justify-center bg-[#E4E4E4]"
                    onPress={onPressSceneSettingDelayModal}>
                    <Icon
                      type={'scTimeIcon'}
                      width={12}
                      height={12}
                      color={'#FFFFFF'}
                    />
                  </TouchableOpacity>
                  <ToggleSwitch initialValue={true} />
                </View>
              ) : null}
            </View>
            {selectValue === value ? (
              <View className="flex-col items-center">
                <View className="w-full flex-row items-center justify-between">
                  <Icon
                    type={'scMoonIcon'}
                    width={12}
                    height={12}
                    color={'#292929'}
                  />
                  <Icon
                    type={'scSunIcon'}
                    width={16}
                    height={16}
                    color={'#292929'}
                  />
                </View>
                <View className="w-full h-[9px] rounded-full bg-dark-teal-light"></View>
              </View>
            ) : null}
          </View>
          {/* <View
            className={
              'min-h-[48px] flex flex-col px-4 py-3  border border-line-light'
            }
            style={{gap: 8}}>
            <View
              className="flex flex-row justify-between items-center"
              style={{gap: 8}}>
              <View className="flex-row items-center" style={{gap: 8}}>
                {selectValue === value ? (
                  <Icon
                    type={'scRadioCheckedIcon'}
                    width={24}
                    height={24}
                    color={'#FFFFFF'}
                  />
                ) : (
                  <Icon
                    type={'scRadioIcon'}
                    width={24}
                    height={24}
                    color={'#FFFFFF'}
                  />
                )}
                <Text
                  weight="regular"
                  size="B1"
                  className={`${disabled && getTheme('text-muted-400')} `}>
                  {name}
                </Text>
              </View>
              {selectValue === value ? (
                <View className="flex-row items-center" style={{gap: 12}}>
                  <TouchableOpacity className="h-6 pl-2 pr-1 rounded-full flex flex-row items-center justify-center bg-dark-teal-light">
                    <Text className="text-[10px] text-white" weight="medium">
                      2
                    </Text>
                    <Icon
                      type={'scTimeWhiteIcon'}
                      width={12}
                      height={12}
                      color={'#FFFFFF'}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {selectValue === value ? (
              <View className="w-full flex-row items-center" style={{gap: 44}}>
                <TouchableOpacity className="w-[45px] aspect-square rounded-full flex flex-row items-center justify-center bg-light-gray-light">
                <Icon
                  type={'scArrowUpIcon'}
                  width={16}
                  height={16}
                  color={'#014541'}
                />
                </TouchableOpacity>
                
                <TouchableOpacity className="w-[45px] aspect-square rounded-full flex flex-row items-center justify-center bg-light-gray-light">
                <Icon
                  type={'scArrowDownIcon'}
                  width={16}
                  height={16}
                  color={'#014541'}
                />
                </TouchableOpacity>
                
              </View>
            ) : null}
          </View> */}
        </TouchableOpacity>
      ))}
      <View
        className={
          'min-h-[48px] flex flex-col items-center px-4 py-3 border border-line-light'
        }
        style={{gap: 8}}>
        <TouchableOpacity className="text-fire-engine-red">
          Delete scene
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectList;
