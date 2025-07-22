import React from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';

import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {Icon, Spacing, Text} from './atoms';
import firebaseConfigState from '~/states/firebase';

export enum SpecialWidget {
  contactSupport = 'contactSupport',
}

export type SpecialWidgetType = keyof typeof SpecialWidget;

const ContactSupport = () => {
  return (
    <View className="flex flex-row">
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            `tel://${firebaseConfigState.contract.call_contract_center.value}`,
          );
        }}>
        <Text className="leading-[19.2px]" color="primary">
          {firebaseConfigState.contract.call_contract_center.value}
        </Text>
      </TouchableOpacity>

      <Text className="leading-[19.2px]">
        {' ' + t('General__or', 'or') + ' '}
      </Text>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            `mailto:${firebaseConfigState.contract.email_contract_center.value}`,
          );
        }}>
        <Text className="leading-[19.2px]" color="primary">
          {firebaseConfigState.contract.email_contract_center.value}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export type AnnouncementType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'wait';
type Props = {
  type: AnnouncementType;
  title: string;
  message: string;
  messageDescription?: string;
  specialWidget?: SpecialWidgetType;
};

const Announcement = (props: Props) => {
  const {type, title, message, messageDescription, specialWidget} = props;

  const MAPPER: any = {
    success: {
      textClass: getTheme('text-kelly-green'),
      Icon: 'checkedIcon',
      color: '#22973F',
    },
    warning: {
      textClass: getTheme('text-jet-black'),
      Icon: 'warningIcon',
      color: '#292929',
    },
    wait: {
      textClass: getTheme('text-jet-black'),
      Icon: 'warningIcon',
      color: '#292929',
    },
    error: {
      textClass: getTheme('text-jet-black'),
      Icon: 'close',
      color: '#292929',
    },
  };

  const SPECIALWIDGET_MAPPER: {[key in SpecialWidget]: React.JSX.Element} = {
    ['contactSupport']: <ContactSupport />,
  };

  function getIcon(iconType: string) {
    const iconName = MAPPER[iconType].Icon;
    const color = MAPPER[iconType].color;
    return <Icon type={iconName} color={color} width={40} height={40} />;
  }

  return (
    <View className="w-96 px-[24px]">
      <View className="items-start">{getIcon(type)}</View>
      <Spacing height={8} />
      <View>
        <Text
          size={'H2'}
          weight={'medium'}
          className={getTheme(`${MAPPER[type].textClass}`)}>
          {title}
        </Text>
      </View>
      <View>
        <Spacing height={16} />
        <Text
          size={'B1'}
          weight={'regular'}
          className={getTheme('leading-[19.2px]')}>
          {message}
        </Text>
        {messageDescription && (
          <>
            <Spacing height={8} />
            <Text
              size="B1"
              weight="medium"
              className={getTheme('leading-[19.2px]')}>
              {messageDescription}
            </Text>
          </>
        )}
        {specialWidget && SPECIALWIDGET_MAPPER[specialWidget]}
      </View>
    </View>
  );
};

export default Announcement;
