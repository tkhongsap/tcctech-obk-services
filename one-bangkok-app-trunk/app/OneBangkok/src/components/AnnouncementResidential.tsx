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
  telSupport?: string;
  emailSupport?: string;
  buttonCenter?: string;
  specialWidget?: SpecialWidgetType;
};

const AnnouncementResidential = (props: Props) => {
  const {
    type,
    title,
    message,
    messageDescription,
    specialWidget,
    buttonCenter,
    telSupport,
    emailSupport,
  } = props;

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
      textClass: getTheme('text-error-light'),
      Icon: 'animationErrorIcon',
      color: '#FF3B30',
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
        <Spacing height={14} />
        <Text
          size={'B1'}
          weight={'regular'}
          className={getTheme('leading-[19.2px] whitespace-pre')}>
          {message}
        </Text>
        {messageDescription && (
          <>
            <Spacing height={4} />
            <Text
              size="B1"
              weight="medium"
              className={getTheme('leading-[19.2px]')}>
              {messageDescription}
            </Text>
          </>
        )}
        <View className="flex flex-row items-end">
          {telSupport && (
            <>
              <TouchableOpacity>
                <Text
                  size="B1"
                  weight="regular"
                  color="dark-teal"
                  className={getTheme('leading-[19.2px]')}>
                  {telSupport}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {emailSupport && (
            <>
              <Text
                size="B1"
                weight="regular"
                color="dark-gray"
                className={getTheme('leading-[19.2px] mx-[4px]')}>
                {t('Residential__Redemption_Car_Park__Or', 'or')}
              </Text>
              <TouchableOpacity>
                <Text
                  size="B1"
                  weight="regular"
                  color="dark-teal"
                  className={getTheme('leading-[19.2px]')}>
                  {emailSupport}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {buttonCenter && (
          <>
            <Spacing height={40} />
            <TouchableOpacity>
              <Text
                size="B1"
                weight="medium"
                color="dark-teal"
                className={getTheme(
                  'w-full bg-[#E4E4E4] border-[1px] border-[#BDBDBD] text-center p-[16px]',
                )}>
                {buttonCenter}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {specialWidget && SPECIALWIDGET_MAPPER[specialWidget]}
      </View>
    </View>
  );
};

export default AnnouncementResidential;
