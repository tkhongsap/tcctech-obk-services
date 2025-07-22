import React, {useState} from 'react';
import {
  Image,
  ButtonProps as RNButtonProps,
  TouchableOpacity,
  View,
} from 'react-native';

import {Icon, IconType, Spacing, Text} from '~/components/atoms';
import {activeOpacity} from '~/constants';
import getTheme from '~/utils/themes/themeUtils';
import {Checkbox} from '../atoms/Checkbox';
import clsx from 'clsx';

export enum NotificationEnum {
  Update = 'Update',
  Offer = 'Offer',
  Building = 'Building',
  Visitor = 'Visitor',
}

export const NotificationCategoryIcon = {
  [NotificationEnum.Update]: 'cog',
  [NotificationEnum.Offer]: 'offer',
  [NotificationEnum.Building]: 'building',
  [NotificationEnum.Visitor]: 'visitor',
};
export interface CategoryAndTimestampProps {
  category: NotificationEnum;
  timestamp: string;
  read: boolean;
  iconCategory: string;
  edit: boolean;
  checked: boolean;
  onSelected: Function;
}

const CategoryAndTimestamp = ({
  category,
  timestamp,
  read,
  iconCategory,
  edit,
  checked,
  onSelected,
}: CategoryAndTimestampProps) => {
  const [error, setError] = useState(false);
  const icon =
    iconCategory && !error ? (
      <View className={'p-[4px] flex justify-center items-center'}>
        <Image
          source={{uri: iconCategory}}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{width: 12, height: 12}}
          onError={() => setError(true)}
        />
      </View>
    ) : (
      <Icon
        type={NotificationCategoryIcon.Update as IconType}
        width={12}
        height={12}
        color={'#FDFDFD'}
      />
    );
  return (
    <View className="flex flex-row justify-between items-center grow h-[20px]">
      <View className="flex flex-row items-center justify-start">
        {edit ? (
          <Checkbox
            width={18}
            height={18}
            value={checked}
            onPress={onSelected}
          />
        ) : (
          <View
            className={getTheme(
              `w-5 h-5 ${read ? 'bg-muted' : 'bg-jet-black'}`,
            )}>
            {/**TODO: confirm by PO default image is Update */}
            {icon}
          </View>
        )}
        <Spacing width={edit ? 4 : 10} />
        <Text size="C1" color={read ? 'muted' : 'dark-gray'}>
          {category}
        </Text>
      </View>
      <Text size="C1" color="muted">
        {timestamp}
      </Text>
    </View>
  );
};
export interface NotficationCardProps extends RNButtonProps {
  category: NotificationEnum;
  timestamp: string;
  read?: boolean;
  image?: string;
  edit?: boolean;
  checked?: boolean;
  onSelected: Function;
  iconCategory?: string;
  bottomBorder?: boolean;
}

export const NotficationCard = (props: NotficationCardProps) => {
  const {
    title,
    onPress,
    category,
    timestamp,
    read = false,
    image,
    edit = false,
    onSelected,
    checked = false,
    iconCategory,
    bottomBorder = false,
  } = props;

  const handleOnPress = (e: any) => {
    if (!edit) {
      onPress && onPress(e);
    }
  };

  const notiCardClassName = clsx(
    getTheme('px-4 py-2 flex flex-row flex-start justify-center'),
    checked && getTheme('bg-light-gray'),
  );

  return (
    <TouchableOpacity activeOpacity={activeOpacity} onPress={handleOnPress}>
      <View className={notiCardClassName}>
        <View
          className={getTheme(
            'flex flex-col shrink grow border-[1px] border-line p-[16px]',
          )}>
          <CategoryAndTimestamp
            read={read}
            category={category}
            timestamp={timestamp}
            iconCategory={iconCategory ?? NotificationCategoryIcon['Update']}
            edit={edit}
            checked={checked}
            onSelected={onSelected}
          />
          <Spacing height={12} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            weight={read ? 'regular' : 'medium'}>
            {title}
          </Text>
          {image && (
            <>
              <View className="flex bg-center bg-no-repeat bg-cover ">
                <Image
                  source={{
                    uri: image,
                  }}
                  className="aspect-[16/9]"
                />
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
