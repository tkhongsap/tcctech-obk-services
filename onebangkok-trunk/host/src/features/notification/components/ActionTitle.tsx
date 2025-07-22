import React, {TouchableOpacity} from 'react-native';
import {Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';

export interface ActionTitleProps {
  edit: boolean;
  selectedAll: boolean;
  onSelectAll: Function;
  onDeselect: Function;
  description: string;
}

export const ActionTitle = (props: ActionTitleProps) => {
  const {edit, selectedAll, onSelectAll, onDeselect, description} = props;

  if (edit) {
    const onPressAction = selectedAll ? onDeselect : onSelectAll;
    return (
      <TouchableOpacity
        onPress={() => {
          onPressAction();
        }}>
        <Text className={getTheme('text-primary')}>
          {selectedAll
            ? t('General__Deselect', 'Deselect')
            : t('General__Select_all', 'Select all')}{' '}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <Text size="B1" weight="medium">
      {description}
    </Text>
  );
};
