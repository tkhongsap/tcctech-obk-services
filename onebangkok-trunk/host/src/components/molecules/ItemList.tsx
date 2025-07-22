import React from 'react';
import {ListItemProps, ListItem} from './ListItem';
import {View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';

interface ItemListProps {
  items: ListItemProps[];
}
export const ItemList = ({items}: ItemListProps) => {
  return (
    <View className={getTheme('divide-y divide-line')}>
      {items.map(value => {
        return <ListItem {...value} />;
      })}
    </View>
  );
};
