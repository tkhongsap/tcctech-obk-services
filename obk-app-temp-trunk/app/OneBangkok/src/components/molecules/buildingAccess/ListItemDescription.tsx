import React from 'react';

import {Spacing, Text} from '~/components/atoms';
import Switch, {SwitchProps} from '~/components/atoms/Switch';
import {View} from 'react-native';

interface ListItemDescriptionProps extends SwitchProps {
  text: string;
  description?: string;
}
const ListItemDescription = (props: ListItemDescriptionProps) => {
  const {text, description, ...switchProps} = props;

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="flex-1 pr-[2px]">
        <Text size="B1" weight="medium">
          {text}
        </Text>
        <Spacing height={4} />
        {description && <Text size="C1">{description}</Text>}
      </View>
      <Switch {...switchProps} />
    </View>
  );
};

export default ListItemDescription;
