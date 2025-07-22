import React from 'react';
import {Text, View} from 'react-native';
import {OBSpacing, OBSwitch} from '~/components';
import t from '~/utils/text';
import {useEditIdentifierState} from '../store';

interface Props {
  userName: string;
  identifier: string;
  setAsDefaultText: string;
  onPressSetAsDefault: (value: boolean) => void;
  onPressRemove: Function;
  removeText: string;
}

const NameAndIdentifierText = ({userName, identifier}: any) => {
  return (
    <View className="items-center">
      <Text className="text-center text-neutral-400 text-base font-medium leading-tight">
        {userName}
      </Text>
      <OBSpacing height={10} />
      <Text className="text-neutral-50 text-xl font-medium leading-tight tracking-tight">
        {identifier}
      </Text>
    </View>
  );
};

const SetAsDefaultPanel = ({setAsDefaultText, onPressSetAsDefault}: any) => {
  const {isDefault} = useEditIdentifierState();

  return (
    <View className="w-[350px] h-[120px] bg-zinc-800 rounded-[8px] justify-center items-center">
      <View className="w-[318px] h-[69px] border-b border-neutral-700">
        <View className="px-[12px] py-[12px] flex-row items-center">
          <View className="flex-1">
            <Text className="text-neutral-50 text-base font-medium leading-tight">
              {t('EditIdentifierForm__set_as_default', 'Set as default')}
            </Text>
            <OBSpacing height={4} />
            <Text className="text-neutral-400 text-xs font-normal leading-[14.40px]">
              {setAsDefaultText}
            </Text>
          </View>
          <OBSwitch
            enabled={isDefault.value}
            disabled={isDefault.value}
            onValueChange={onPressSetAsDefault}
          />
        </View>
      </View>
    </View>
  );
};

const RemoveButton = ({onPressRemove, removeText}: any) => {
  return (
    <Text
      className="text-red-500 text-base font-light leading-tight"
      onPress={onPressRemove}>
      {removeText}
    </Text>
  );
};

export const EditIdentifierForm = ({
  userName,
  identifier,
  setAsDefaultText,
  onPressSetAsDefault,
  onPressRemove,
  removeText,
}: Props) => {
  return (
    <View className="items-center">
      <OBSpacing height={40} />
      <NameAndIdentifierText userName={userName} identifier={identifier} />
      <OBSpacing height={38} />
      <SetAsDefaultPanel
        setAsDefaultText={setAsDefaultText}
        onPressSetAsDefault={onPressSetAsDefault}
      />
      <OBSpacing height={40} />
      <RemoveButton onPressRemove={onPressRemove} removeText={removeText} />
    </View>
  );
};
